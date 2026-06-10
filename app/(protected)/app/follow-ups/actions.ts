"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { FollowUpStatus } from "@/app/generated/prisma/client";
import type { FormActionState } from "@/lib/action-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { generateFollowUpMessage } from "@/lib/follow-up-message";
import { parseDateInput } from "@/lib/ledger";
import { followUpEditSchema, followUpSchema } from "@/lib/validation/ledger";

function revalidateFollowUpPaths({
  followUpId,
  projectId,
  clientId,
  promiseId,
}: {
  followUpId?: string;
  projectId?: string | null;
  clientId?: string | null;
  promiseId?: string | null;
}) {
  revalidatePath("/app/follow-ups");
  revalidatePath("/app/today");

  if (followUpId) {
    revalidatePath(`/app/follow-ups/${followUpId}`);
  }

  if (projectId) {
    revalidatePath(`/app/projects/${projectId}`);
  }

  if (clientId) {
    revalidatePath(`/app/clients/${clientId}`);
  }

  if (promiseId) {
    revalidatePath(`/app/promises/${promiseId}`);
  }
}

async function getFollowUpContext({
  organizationId,
  projectId,
  promiseId,
  paymentRecordId,
  proofId,
}: {
  organizationId: string;
  projectId: string;
  promiseId?: string;
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
      proofItems: {
        where: { archivedAt: null, status: { not: "ARCHIVED" } },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!project) {
    return { error: "invalid-project" as const };
  }

  const [promise, paymentRecord, proof] = await Promise.all([
    promiseId
      ? db.clientPromise.findFirst({
          where: { id: promiseId, organizationId, projectId: project.id },
          select: { id: true, promisedDate: true, promisedAmount: true },
        })
      : Promise.resolve(null),
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

  if (promiseId && !promise) {
    return { error: "invalid-promise" as const };
  }

  if (paymentRecordId && !paymentRecord) {
    return { error: "invalid-payment" as const };
  }

  if (proofId && !proof) {
    return { error: "invalid-proof" as const };
  }

  return { project, promise, paymentRecord, proof };
}

export async function createFollowUpAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = followUpSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const context = await getFollowUpContext({
    organizationId: organization.id,
    projectId: parsed.data.projectId,
    promiseId: parsed.data.promiseId,
    paymentRecordId: parsed.data.paymentRecordId,
    proofId: parsed.data.proofId,
  });

  if ("error" in context) {
    return followUpContextError(context.error ?? "invalid-project");
  }

  const dueDate = parseDateInput(parsed.data.dueDate);

  if (!dueDate) {
    return { fieldErrors: { dueDate: ["Follow-up date is required."] } };
  }

  let followUpId: string;
  const message =
    parsed.data.message ??
    generateFollowUpMessage({
      clientName: context.project.client.name,
      projectName: context.project.name,
      amount: context.promise?.promisedAmount ?? context.project.pendingAmount,
      currency: organization.currency,
      promisedDate: context.promise?.promisedDate,
      hasProof: Boolean(context.proof || context.project.proofItems.length > 0),
      type: context.promise ? "missed-promise" : "payment-reminder",
    });

  try {
    const followUp = await getDb().$transaction(async (tx) => {
      const created = await tx.followUp.create({
        data: {
          organizationId: organization.id,
          clientId: context.project.clientId,
          projectId: context.project.id,
          promiseId: context.promise?.id,
          paymentRecordId: context.paymentRecord?.id,
          proofId: context.proof?.id,
          title: parsed.data.title,
          dueDate,
          channel: parsed.data.channel,
          priority: parsed.data.priority,
          status: "OPEN",
          message,
          notes: parsed.data.notes,
          createdById: user.id,
          updatedById: user.id,
        },
        select: { id: true },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "follow_up",
          entityId: created.id,
          action: "follow_up.created",
          metadata: {
            clientId: context.project.clientId,
            clientName: context.project.client.name,
            projectId: context.project.id,
            projectName: context.project.name,
            followUpDueDate: dueDate.toISOString(),
            channel: parsed.data.channel,
            status: "OPEN",
          },
        },
      });

      return created;
    });

    followUpId = followUp.id;
  } catch {
    return { error: "Unable to create follow-up. Please check the details and try again." };
  }

  revalidateFollowUpPaths({
    followUpId,
    projectId: context.project.id,
    clientId: context.project.clientId,
    promiseId: context.promise?.id,
  });

  if (parsed.data.redirectTo === "project") {
    redirect(`/app/projects/${context.project.id}`);
  }

  if (parsed.data.redirectTo === "promise" && context.promise) {
    redirect(`/app/promises/${context.promise.id}`);
  }

  redirect(`/app/follow-ups/${followUpId}`);
}

export async function updateFollowUpAction(
  followUpId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = followUpEditSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await getDb().followUp.findFirst({
    where: { id: followUpId, organizationId: organization.id },
    select: { id: true, projectId: true, clientId: true, promiseId: true },
  });

  if (!existing) {
    notFound();
  }

  const context = await getFollowUpContext({
    organizationId: organization.id,
    projectId: parsed.data.projectId,
    promiseId: parsed.data.promiseId,
    paymentRecordId: parsed.data.paymentRecordId,
    proofId: parsed.data.proofId,
  });

  if ("error" in context) {
    return followUpContextError(context.error ?? "invalid-project");
  }

  const dueDate = parseDateInput(parsed.data.dueDate);

  if (!dueDate) {
    return { fieldErrors: { dueDate: ["Follow-up date is required."] } };
  }

  try {
    await getDb().$transaction(async (tx) => {
      await tx.followUp.update({
        where: { id: existing.id },
        data: {
          clientId: context.project.clientId,
          projectId: context.project.id,
          promiseId: context.promise?.id ?? null,
          paymentRecordId: context.paymentRecord?.id ?? null,
          proofId: context.proof?.id ?? null,
          title: parsed.data.title,
          dueDate,
          channel: parsed.data.channel,
          priority: parsed.data.priority,
          status: parsed.data.status,
          message: parsed.data.message,
          notes: parsed.data.notes,
          updatedById: user.id,
          completedAt: parsed.data.status === "DONE" ? new Date() : null,
          completedById: parsed.data.status === "DONE" ? user.id : null,
          cancelledAt: parsed.data.status === "CANCELLED" ? new Date() : null,
          snoozedUntil: parsed.data.status === "SNOOZED" ? dueDate : null,
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "follow_up",
          entityId: existing.id,
          action: "follow_up.updated",
          metadata: {
            clientId: context.project.clientId,
            clientName: context.project.client.name,
            projectId: context.project.id,
            projectName: context.project.name,
            followUpDueDate: dueDate.toISOString(),
            channel: parsed.data.channel,
            status: parsed.data.status,
          },
        },
      });
    });
  } catch {
    return { error: "Unable to update follow-up. Please check the details and try again." };
  }

  revalidateFollowUpPaths({
    followUpId: existing.id,
    projectId: context.project.id,
    clientId: context.project.clientId,
    promiseId: context.promise?.id,
  });
  revalidateFollowUpPaths({
    projectId: existing.projectId,
    clientId: existing.clientId,
    promiseId: existing.promiseId,
  });

  redirect(`/app/follow-ups/${existing.id}`);
}

export async function updateFollowUpStatusAction(formData: FormData) {
  const { user, organization } = await requireOrganization();
  const followUpId = String(formData.get("followUpId") ?? "");
  const nextStatus = String(formData.get("status") ?? "");

  if (!followUpId || !["DONE", "SNOOZED", "CANCELLED", "OPEN"].includes(nextStatus)) {
    notFound();
  }

  const existing = await getDb().followUp.findFirst({
    where: { id: followUpId, organizationId: organization.id },
    select: {
      id: true,
      status: true,
      dueDate: true,
      clientId: true,
      projectId: true,
      promiseId: true,
      channel: true,
      client: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  if (!existing) {
    notFound();
  }

  const allowedTransitions: Record<string, string[]> = {
    OPEN: ["DONE", "SNOOZED", "CANCELLED"],
    SNOOZED: ["OPEN", "DONE", "CANCELLED"],
  };

  if (!allowedTransitions[existing.status]?.includes(nextStatus)) {
    redirect(`/app/follow-ups/${existing.id}`);
  }

  const snoozedUntil = new Date(existing.dueDate);
  snoozedUntil.setUTCDate(snoozedUntil.getUTCDate() + 3);

  await getDb().$transaction(async (tx) => {
    await tx.followUp.update({
      where: { id: existing.id },
      data: {
        status: nextStatus as FollowUpStatus,
        updatedById: user.id,
        completedAt: nextStatus === "DONE" ? new Date() : null,
        completedById: nextStatus === "DONE" ? user.id : null,
        cancelledAt: nextStatus === "CANCELLED" ? new Date() : null,
        dueDate: nextStatus === "SNOOZED" ? snoozedUntil : undefined,
        snoozedUntil: nextStatus === "SNOOZED" ? snoozedUntil : null,
      },
    });

    await tx.activityLog.create({
      data: {
        organizationId: organization.id,
        actorId: user.id,
        entityType: "follow_up",
        entityId: existing.id,
        action: followUpStatusAction(nextStatus),
        metadata: {
          clientId: existing.clientId,
          clientName: existing.client.name,
          projectId: existing.projectId,
          projectName: existing.project?.name,
          followUpDueDate: existing.dueDate.toISOString(),
          channel: existing.channel,
          status: nextStatus,
        },
      },
    });
  });

  revalidateFollowUpPaths({
    followUpId: existing.id,
    projectId: existing.projectId,
    clientId: existing.clientId,
    promiseId: existing.promiseId,
  });
}

function followUpStatusAction(status: string) {
  if (status === "DONE") {
    return "follow_up.marked_done";
  }

  if (status === "SNOOZED") {
    return "follow_up.snoozed";
  }

  if (status === "CANCELLED") {
    return "follow_up.cancelled";
  }

  return "follow_up.updated";
}

function followUpContextError(
  error: "invalid-project" | "invalid-promise" | "invalid-payment" | "invalid-proof",
) {
  if (error === "invalid-project") {
    return { fieldErrors: { projectId: ["Select a valid project."] } };
  }

  if (error === "invalid-promise") {
    return {
      fieldErrors: {
        promiseId: ["This promise does not belong to the selected project."],
      },
    };
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
