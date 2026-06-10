"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { PromiseStatus } from "@/app/generated/prisma/client";
import type { FormActionState } from "@/lib/action-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { defaultPromiseText } from "@/lib/follow-up-message";
import { parseDateInput, parseMoneyInput } from "@/lib/ledger";
import { promiseEditSchema, promiseSchema } from "@/lib/validation/ledger";

function revalidatePromisePaths({
  promiseId,
  projectId,
  clientId,
}: {
  promiseId?: string;
  projectId?: string | null;
  clientId?: string | null;
}) {
  revalidatePath("/app/promises");
  revalidatePath("/app/today");

  if (promiseId) {
    revalidatePath(`/app/promises/${promiseId}`);
  }

  if (projectId) {
    revalidatePath(`/app/projects/${projectId}`);
  }

  if (clientId) {
    revalidatePath(`/app/clients/${clientId}`);
  }
}

async function getPromiseContext({
  organizationId,
  projectId,
  paymentRecordId,
  proofId,
}: {
  organizationId: string;
  projectId: string;
  paymentRecordId?: string;
  proofId?: string;
}) {
  const db = getDb();
  const project = await db.project.findFirst({
    where: { id: projectId, organizationId },
    select: {
      id: true,
      name: true,
      clientId: true,
      pendingAmount: true,
      client: { select: { name: true } },
    },
  });

  if (!project) {
    return { error: "invalid-project" as const };
  }

  const [paymentRecord, proof] = await Promise.all([
    paymentRecordId
      ? db.paymentRecord.findFirst({
          where: {
            id: paymentRecordId,
            organizationId,
            projectId: project.id,
            type: "PAYMENT",
          },
          select: { id: true },
        })
      : Promise.resolve(null),
    proofId
      ? db.proofItem.findFirst({
          where: { id: proofId, organizationId, projectId: project.id },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  if (paymentRecordId && !paymentRecord) {
    return { error: "invalid-payment" as const };
  }

  if (proofId && !proof) {
    return { error: "invalid-proof" as const };
  }

  return { project, paymentRecord, proof };
}

export async function createPromiseAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = promiseSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const context = await getPromiseContext({
    organizationId: organization.id,
    projectId: parsed.data.projectId,
    paymentRecordId: parsed.data.paymentRecordId,
    proofId: parsed.data.proofId,
  });

  if ("error" in context) {
    return promiseContextError(context.error ?? "invalid-project");
  }

  const promisedAmount = parseMoneyInput(parsed.data.promisedAmount);

  if (promisedAmount.lte(0)) {
    return { fieldErrors: { promisedAmount: ["Promise amount must be greater than zero."] } };
  }

  if (promisedAmount.gt(context.project.pendingAmount)) {
    return {
      fieldErrors: {
        promisedAmount: ["Promise amount cannot exceed the current pending balance."],
      },
    };
  }

  const promisedDate = parseDateInput(parsed.data.promisedDate);

  if (!promisedDate) {
    return { fieldErrors: { promisedDate: ["Use a valid promised date."] } };
  }

  let promiseId: string;

  try {
    const promise = await getDb().$transaction(async (tx) => {
      const created = await tx.clientPromise.create({
        data: {
          organizationId: organization.id,
          clientId: context.project.clientId,
          projectId: context.project.id,
          paymentRecordId: context.paymentRecord?.id,
          proofId: context.proof?.id,
          promisedAmount,
          promisedDate,
          channel: parsed.data.channel,
          promiseText:
            parsed.data.promiseText ??
            defaultPromiseText({
              clientName: context.project.client.name,
              amount: promisedAmount,
              currency: organization.currency,
              promisedDate,
            }),
          createdById: user.id,
          updatedById: user.id,
        },
        select: { id: true },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "promise",
          entityId: created.id,
          action: "promise.created",
          metadata: {
            clientId: context.project.clientId,
            clientName: context.project.client.name,
            projectId: context.project.id,
            projectName: context.project.name,
            promisedAmount: promisedAmount.toString(),
            promisedDate: promisedDate.toISOString(),
            channel: parsed.data.channel,
            status: "OPEN",
          },
        },
      });

      return created;
    });

    promiseId = promise.id;
  } catch {
    return { error: "Unable to create promise. Please check the details and try again." };
  }

  revalidatePromisePaths({
    promiseId,
    projectId: context.project.id,
    clientId: context.project.clientId,
  });

  if (parsed.data.redirectTo === "project") {
    redirect(`/app/projects/${context.project.id}`);
  }

  redirect(`/app/promises/${promiseId}`);
}

export async function updatePromiseAction(
  promiseId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = promiseEditSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getDb().clientPromise.findFirst({
    where: { id: promiseId, organizationId: organization.id },
    select: { id: true, projectId: true, clientId: true, status: true },
  });

  if (!existing) {
    notFound();
  }

  const context = await getPromiseContext({
    organizationId: organization.id,
    projectId: parsed.data.projectId,
    paymentRecordId: parsed.data.paymentRecordId,
    proofId: parsed.data.proofId,
  });

  if ("error" in context) {
    return promiseContextError(context.error ?? "invalid-project");
  }

  const promisedAmount = parseMoneyInput(parsed.data.promisedAmount);

  if (promisedAmount.lte(0)) {
    return { fieldErrors: { promisedAmount: ["Promise amount must be greater than zero."] } };
  }

  if (promisedAmount.gt(context.project.pendingAmount)) {
    return {
      fieldErrors: {
        promisedAmount: ["Promise amount cannot exceed the current pending balance."],
      },
    };
  }

  const promisedDate = parseDateInput(parsed.data.promisedDate);

  if (!promisedDate) {
    return { fieldErrors: { promisedDate: ["Use a valid promised date."] } };
  }

  try {
    await getDb().$transaction(async (tx) => {
      await tx.clientPromise.update({
        where: { id: existing.id },
        data: {
          clientId: context.project.clientId,
          projectId: context.project.id,
          paymentRecordId: context.paymentRecord?.id ?? null,
          proofId: context.proof?.id ?? null,
          promisedAmount,
          promisedDate,
          channel: parsed.data.channel,
          promiseText:
            parsed.data.promiseText ??
            defaultPromiseText({
              clientName: context.project.client.name,
              amount: promisedAmount,
              currency: organization.currency,
              promisedDate,
            }),
          status: parsed.data.status,
          updatedById: user.id,
          keptAt: parsed.data.status === "KEPT" ? new Date() : null,
          missedAt: parsed.data.status === "MISSED" ? new Date() : null,
          partialAt: parsed.data.status === "PARTIAL" ? new Date() : null,
          cancelledAt: parsed.data.status === "CANCELLED" ? new Date() : null,
          resolvedAt: ["KEPT", "MISSED", "CANCELLED"].includes(parsed.data.status)
            ? new Date()
            : null,
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "promise",
          entityId: existing.id,
          action: "promise.updated",
          metadata: {
            clientId: context.project.clientId,
            clientName: context.project.client.name,
            projectId: context.project.id,
            projectName: context.project.name,
            promisedAmount: promisedAmount.toString(),
            promisedDate: promisedDate.toISOString(),
            channel: parsed.data.channel,
            status: parsed.data.status,
          },
        },
      });
    });
  } catch {
    return { error: "Unable to update promise. Please check the details and try again." };
  }

  revalidatePromisePaths({
    promiseId: existing.id,
    projectId: context.project.id,
    clientId: context.project.clientId,
  });
  revalidatePromisePaths({
    projectId: existing.projectId,
    clientId: existing.clientId,
  });

  redirect(`/app/promises/${existing.id}`);
}

export async function updatePromiseStatusAction(formData: FormData) {
  const { user, organization } = await requireOrganization();
  const promiseId = String(formData.get("promiseId") ?? "");
  const nextStatus = String(formData.get("status") ?? "");

  if (!promiseId || !["KEPT", "MISSED", "PARTIAL", "CANCELLED"].includes(nextStatus)) {
    notFound();
  }

  const existing = await getDb().clientPromise.findFirst({
    where: { id: promiseId, organizationId: organization.id },
    select: {
      id: true,
      status: true,
      promisedAmount: true,
      promisedDate: true,
      clientId: true,
      projectId: true,
      client: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  if (!existing) {
    notFound();
  }

  const allowedTransitions: Record<string, string[]> = {
    OPEN: ["KEPT", "MISSED", "PARTIAL", "CANCELLED"],
    MISSED: ["KEPT", "PARTIAL"],
    PARTIAL: ["KEPT", "CANCELLED"],
  };

  if (!allowedTransitions[existing.status]?.includes(nextStatus)) {
    redirect(`/app/promises/${existing.id}`);
  }

  await getDb().$transaction(async (tx) => {
    await tx.clientPromise.update({
      where: { id: existing.id },
      data: promiseStatusData(nextStatus, user.id),
    });

    await tx.activityLog.create({
      data: {
        organizationId: organization.id,
        actorId: user.id,
        entityType: "promise",
        entityId: existing.id,
        action: promiseStatusAction(nextStatus),
        metadata: {
          clientId: existing.clientId,
          clientName: existing.client.name,
          projectId: existing.projectId,
          projectName: existing.project?.name,
          promisedAmount: existing.promisedAmount?.toString(),
          promisedDate: existing.promisedDate.toISOString(),
          status: nextStatus,
        },
      },
    });
  });

  revalidatePromisePaths({
    promiseId: existing.id,
    projectId: existing.projectId,
    clientId: existing.clientId,
  });
}

function promiseStatusData(status: string, userId: string) {
  const now = new Date();
  return {
    status: status as PromiseStatus,
    updatedById: userId,
    keptAt: status === "KEPT" ? now : undefined,
    missedAt: status === "MISSED" ? now : undefined,
    partialAt: status === "PARTIAL" ? now : undefined,
    cancelledAt: status === "CANCELLED" ? now : undefined,
    resolvedAt: ["KEPT", "MISSED", "CANCELLED"].includes(status) ? now : undefined,
  };
}

function promiseStatusAction(status: string) {
  if (status === "KEPT") {
    return "promise.marked_kept";
  }

  if (status === "MISSED") {
    return "promise.marked_missed";
  }

  if (status === "PARTIAL") {
    return "promise.marked_partial";
  }

  return "promise.cancelled";
}

function promiseContextError(error: "invalid-project" | "invalid-payment" | "invalid-proof") {
  if (error === "invalid-project") {
    return { fieldErrors: { projectId: ["Select a valid project."] } };
  }

  if (error === "invalid-payment") {
    return {
      fieldErrors: {
        paymentRecordId: ["This payment does not belong to the selected project."],
      },
    };
  }

  return {
    fieldErrors: {
      proofId: ["This proof does not belong to the selected project."],
    },
  };
}
