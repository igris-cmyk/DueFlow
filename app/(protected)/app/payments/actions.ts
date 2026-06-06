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

async function getProjectRemaining(
  tx: Prisma.TransactionClient,
  projectId: string,
  excludePaymentId?: string,
) {
  const project = await tx.project.findFirst({
    where: { id: projectId },
    select: { id: true, organizationId: true, clientId: true, name: true, totalValue: true },
  });

  if (!project) {
    return null;
  }

  const paid = await tx.paymentRecord.aggregate({
    where: {
      projectId,
      id: excludePaymentId ? { not: excludePaymentId } : undefined,
      ...validReceivedPaymentWhere,
    },
    _sum: { amount: true },
  });

  const paidAmount = paid._sum.amount ?? new Prisma.Decimal(0);
  return {
    ...project,
    remaining: Prisma.Decimal.max(
      new Prisma.Decimal(project.totalValue).minus(paidAmount),
      new Prisma.Decimal(0),
    ),
  };
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
    const result = await getDb().$transaction(async (tx) => {
      const project = await getProjectRemaining(tx, parsed.data.projectId);

      if (!project || project.organizationId !== organization.id) {
        return "invalid-project" as const;
      }

      const amount = parseMoneyInput(parsed.data.amount);
      if (amount.lte(0)) {
        return "invalid-amount" as const;
      }

      if (amount.gt(project.remaining)) {
        return "overpayment" as const;
      }

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

      await recalculateProjectBalances(tx, project.id);

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
  revalidatePath("/app/clients");
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
    const result = await getDb().$transaction(async (tx) => {
      const existing = await tx.paymentRecord.findFirst({
        where: { id: paymentId, organizationId: organization.id },
        select: {
          id: true,
          projectId: true,
          amount: true,
          status: true,
        },
      });

      if (!existing) {
        notFound();
      }

      if (existing.status === "CANCELLED") {
        return "cancelled" as const;
      }

      const project = await getProjectRemaining(tx, parsed.data.projectId, existing.id);

      if (!project || project.organizationId !== organization.id) {
        return "invalid-project" as const;
      }

      const amount = parseMoneyInput(parsed.data.amount);
      if (amount.lte(0)) {
        return "invalid-amount" as const;
      }

      if (amount.gt(project.remaining)) {
        return "overpayment" as const;
      }

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

      await recalculateProjectBalances(tx, existing.projectId);
      if (existing.projectId !== project.id) {
        await recalculateProjectBalances(tx, project.id);
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
  revalidatePath("/app/clients");
  revalidatePath("/app/today");
  redirect(`/app/payments/${paymentId}`);
}

export async function cancelPaymentAction(formData: FormData) {
  const { user, organization } = await requireOrganization();
  const paymentId = String(formData.get("paymentId") ?? "");

  if (!paymentId) {
    notFound();
  }

  const result = await getDb().$transaction(async (tx) => {
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

      await recalculateProjectBalances(tx, existing.projectId);

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
  revalidatePath("/app/clients");
  revalidatePath("/app/today");
}
