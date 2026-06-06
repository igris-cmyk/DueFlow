"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { Prisma } from "@/app/generated/prisma/client";
import type { FormActionState } from "@/lib/action-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  parseDateInput,
  parseMoneyInput,
  recalculateProjectBalances,
  validReceivedPaymentWhere,
} from "@/lib/ledger";
import { paymentSchema } from "@/lib/validation/ledger";

const LEDGER_TRANSACTION_RETRIES = 2;

async function runLedgerTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  for (let attempt = 1; attempt <= LEDGER_TRANSACTION_RETRIES; attempt += 1) {
    try {
      return await getDb().$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (attempt < LEDGER_TRANSACTION_RETRIES && isWriteConflict(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to complete ledger transaction.");
}

function isWriteConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  );
}

async function getProjectRemaining(
  tx: Prisma.TransactionClient,
  organizationId: string,
  projectId: string,
  excludePaymentId?: string,
) {
  const [project, paid] = await Promise.all([
    tx.project.findFirst({
      where: { id: projectId, organizationId },
      select: { id: true, clientId: true, name: true, totalValue: true },
    }),
    tx.paymentRecord.aggregate({
      where: {
        organizationId,
        projectId,
        id: excludePaymentId ? { not: excludePaymentId } : undefined,
        ...validReceivedPaymentWhere,
      },
      _sum: { amount: true },
    }),
  ]);

  if (!project) {
    return null;
  }

  const paidAmount = paid._sum.amount ?? new Prisma.Decimal(0);
  return {
    ...project,
    paidAmount,
    remaining: Prisma.Decimal.max(
      new Prisma.Decimal(project.totalValue).minus(paidAmount),
      new Prisma.Decimal(0),
    ),
  };
}

async function updateProjectBalanceFromPaid(
  tx: Prisma.TransactionClient,
  project: { id: string; totalValue: Prisma.Decimal },
  paidAmount: Prisma.Decimal,
) {
  const pendingAmount = Prisma.Decimal.max(
    new Prisma.Decimal(project.totalValue).minus(paidAmount),
    new Prisma.Decimal(0),
  );

  return tx.project.update({
    where: { id: project.id },
    data: { paidAmount, pendingAmount },
    select: { id: true },
  });
}

export async function createPaymentAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let projectId: string;

  try {
    const result = await runLedgerTransaction(async (tx) => {
      const project = await getProjectRemaining(
        tx,
        organization.id,
        parsed.data.projectId,
      );

      if (!project) {
        return "invalid-project" as const;
      }

      const amount = parseMoneyInput(parsed.data.amount);
      if (amount.lte(0)) {
        return "invalid-amount" as const;
      }

      if (amount.gt(project.remaining)) {
        return "overpayment" as const;
      }

      const paidAmount = project.paidAmount.plus(amount);
      const payment = await tx.paymentRecord.create({
        data: {
          organizationId: organization.id,
          projectId: project.id,
          clientId: project.clientId,
          type: "PAYMENT",
          status: "PAID",
          amount,
          paidDate: parseDateInput(parsed.data.paidDate) ?? new Date(),
          method: parsed.data.method,
          referenceNumber: parsed.data.referenceNumber,
          notes: parsed.data.notes,
        },
        select: { id: true, amount: true },
      });

      await updateProjectBalanceFromPaid(tx, project, paidAmount);

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "payment",
          entityId: payment.id,
          action: "payment.created",
          metadata: {
            projectName: project.name,
            amount: payment.amount.toString(),
          },
        },
      });

      return { payment, projectId: project.id };
    });

    if (result === "invalid-project") {
      return { fieldErrors: { projectId: ["Choose a valid project."] } };
    }

    if (result === "invalid-amount") {
      return { fieldErrors: { amount: ["Enter an amount above zero."] } };
    }

    if (result === "overpayment") {
      return {
        fieldErrors: {
          amount: ["Received payment cannot exceed the pending balance."],
        },
      };
    }

    projectId = result.projectId;
  } catch {
    return {
      error: "We could not record this payment right now. Please try again.",
    };
  }

  revalidatePath("/app/payments");
  revalidatePath(`/app/projects/${projectId}`);
  revalidatePath("/app/projects");
  revalidatePath("/app/today");
  redirect(`/app/projects/${projectId}`);
}

export async function updatePaymentAction(
  paymentId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let redirectProjectId = parsed.data.projectId;

  try {
    const result = await runLedgerTransaction(async (tx) => {
      const [existing, project] = await Promise.all([
        tx.paymentRecord.findFirst({
          where: { id: paymentId, organizationId: organization.id },
          select: {
            id: true,
            projectId: true,
            amount: true,
            status: true,
          },
        }),
        getProjectRemaining(
          tx,
          organization.id,
          parsed.data.projectId,
          paymentId,
        ),
      ]);

      if (!existing) {
        notFound();
      }

      if (existing.status === "CANCELLED") {
        return "cancelled" as const;
      }

      if (!project) {
        return "invalid-project" as const;
      }

      const amount = parseMoneyInput(parsed.data.amount);
      if (amount.lte(0)) {
        return "invalid-amount" as const;
      }

      if (amount.gt(project.remaining)) {
        return "overpayment" as const;
      }

      const paidAmount = project.paidAmount.plus(amount);
      const payment = await tx.paymentRecord.update({
        where: { id: existing.id },
        data: {
          projectId: project.id,
          clientId: project.clientId,
          type: "PAYMENT",
          status: "PAID",
          amount,
          paidDate: parseDateInput(parsed.data.paidDate) ?? new Date(),
          method: parsed.data.method,
          referenceNumber: parsed.data.referenceNumber,
          notes: parsed.data.notes,
        },
        select: { id: true, amount: true, projectId: true },
      });

      if (existing.projectId !== project.id) {
        await Promise.all([
          recalculateProjectBalances(tx, existing.projectId, organization.id),
          updateProjectBalanceFromPaid(tx, project, paidAmount),
        ]);
      } else {
        await updateProjectBalanceFromPaid(tx, project, paidAmount);
      }

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "payment",
          entityId: payment.id,
          action: "payment.updated",
          metadata: {
            previousAmount: existing.amount.toString(),
            newAmount: payment.amount.toString(),
            projectName: project.name,
          },
        },
      });

      return payment;
    });

    if (result === "cancelled") {
      return { error: "Cancelled payments cannot be edited." };
    }

    if (result === "invalid-project") {
      return { fieldErrors: { projectId: ["Choose a valid project."] } };
    }

    if (result === "invalid-amount") {
      return { fieldErrors: { amount: ["Enter an amount above zero."] } };
    }

    if (result === "overpayment") {
      return {
        fieldErrors: {
          amount: ["Received payment cannot exceed the pending balance."],
        },
      };
    }

    redirectProjectId = result.projectId;
  } catch (error) {
    if ((error as Error).message === "NEXT_NOT_FOUND") {
      throw error;
    }

    return {
      error: "We could not update this payment right now. Please try again.",
    };
  }

  revalidatePath("/app/payments");
  revalidatePath(`/app/payments/${paymentId}`);
  revalidatePath(`/app/projects/${redirectProjectId}`);
  revalidatePath("/app/projects");
  revalidatePath("/app/today");
  redirect(`/app/payments/${paymentId}`);
}

export async function cancelPaymentAction(formData: FormData) {
  const { user, organization } = await requireOrganization();
  const paymentId = String(formData.get("paymentId") ?? "");

  if (!paymentId) {
    notFound();
  }

  const result = await runLedgerTransaction(async (tx) => {
    const existing = await tx.paymentRecord.findFirst({
      where: { id: paymentId, organizationId: organization.id },
      select: { id: true, projectId: true, amount: true, status: true },
    });

    if (!existing) {
      notFound();
    }

    if (existing.status !== "CANCELLED") {
      await tx.paymentRecord.update({
        where: { id: existing.id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelledById: user.id,
        },
      });

      await recalculateProjectBalances(tx, existing.projectId, organization.id);

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "payment",
          entityId: existing.id,
          action: "payment.cancelled",
          metadata: {
            amount: existing.amount.toString(),
            status: "CANCELLED",
          },
        },
      });
    }

    return existing;
  });

  revalidatePath("/app/payments");
  revalidatePath(`/app/payments/${paymentId}`);
  revalidatePath(`/app/projects/${result.projectId}`);
  revalidatePath("/app/projects");
  revalidatePath("/app/today");
}
