"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { Prisma } from "@/app/generated/prisma/client";
import type { FormActionState } from "@/lib/action-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { parseDateInput, parseMoneyInput, recalculateProjectBalances } from "@/lib/ledger";
import { projectSchema } from "@/lib/validation/ledger";

export async function createProjectAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let projectId: string;

  try {
    const project = await getDb().$transaction(async (tx) => {
      const client = await tx.client.findFirst({
        where: { id: parsed.data.clientId, organizationId: organization.id },
        select: { id: true, name: true },
      });

      if (!client) {
        return null;
      }

      const totalValue = parseMoneyInput(parsed.data.totalValue);
      const created = await tx.project.create({
        data: {
          organizationId: organization.id,
          clientId: client.id,
          name: parsed.data.name,
          description: parsed.data.description,
          status: parsed.data.status,
          totalValue,
          paidAmount: new Prisma.Decimal(0),
          pendingAmount: totalValue,
          startDate: parseDateInput(parsed.data.startDate),
          dueDate: parseDateInput(parsed.data.dueDate),
          completionDate: parseDateInput(parsed.data.completionDate),
          paymentTerms: parsed.data.paymentTerms,
          riskStatus: parsed.data.riskStatus,
        },
        select: { id: true, name: true, totalValue: true },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "project",
          entityId: created.id,
          action: "project.created",
          metadata: {
            projectName: created.name,
            clientName: client.name,
            totalValue: created.totalValue.toString(),
          },
        },
      });

      return created;
    });

    if (!project) {
      return { fieldErrors: { clientId: ["Choose a valid client."] } };
    }

    projectId = project.id;
  } catch {
    return {
      error: "We could not create this project right now. Please try again.",
    };
  }

  revalidatePath("/app/projects");
  revalidatePath("/app/clients");
  revalidatePath("/app/today");
  redirect(`/app/projects/${projectId}`);
}

export async function updateProjectAction(
  projectId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const result = await getDb().$transaction(async (tx) => {
      const existing = await tx.project.findFirst({
        where: { id: projectId, organizationId: organization.id },
        select: { id: true, name: true, paidAmount: true },
      });

      if (!existing) {
        notFound();
      }

      const client = await tx.client.findFirst({
        where: { id: parsed.data.clientId, organizationId: organization.id },
        select: { id: true, name: true },
      });

      if (!client) {
        return "invalid-client" as const;
      }

      const totalValue = parseMoneyInput(parsed.data.totalValue);
      if (totalValue.lt(existing.paidAmount)) {
        return "below-paid" as const;
      }

      const updated = await tx.project.update({
        where: { id: existing.id },
        data: {
          clientId: client.id,
          name: parsed.data.name,
          description: parsed.data.description,
          status: parsed.data.status,
          totalValue,
          startDate: parseDateInput(parsed.data.startDate),
          dueDate: parseDateInput(parsed.data.dueDate),
          completionDate: parseDateInput(parsed.data.completionDate),
          paymentTerms: parsed.data.paymentTerms,
          riskStatus: parsed.data.riskStatus,
        },
        select: { id: true, name: true, totalValue: true },
      });

      await recalculateProjectBalances(tx, existing.id);

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "project",
          entityId: updated.id,
          action: "project.updated",
          metadata: {
            previousName: existing.name,
            projectName: updated.name,
            clientName: client.name,
            totalValue: updated.totalValue.toString(),
          },
        },
      });

      return updated;
    });

    if (result === "invalid-client") {
      return { fieldErrors: { clientId: ["Choose a valid client."] } };
    }

    if (result === "below-paid") {
      return {
        fieldErrors: {
          totalValue: ["Total value cannot be lower than received payments."],
        },
      };
    }

    revalidatePath("/app/projects");
    revalidatePath(`/app/projects/${projectId}`);
    revalidatePath("/app/clients");
    revalidatePath("/app/today");
  } catch (error) {
    if ((error as Error).message === "NEXT_NOT_FOUND") {
      throw error;
    }

    return {
      error: "We could not update this project right now. Please try again.",
    };
  }

  redirect(`/app/projects/${projectId}`);
}
