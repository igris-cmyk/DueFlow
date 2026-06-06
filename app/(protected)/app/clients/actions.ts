"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { FormActionState } from "@/lib/action-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { clientSchema } from "@/lib/validation/ledger";

export async function createClientAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let clientId: string;

  try {
    const client = await getDb().$transaction(async (tx) => {
      const created = await tx.client.create({
        data: {
          ...parsed.data,
          organizationId: organization.id,
        },
        select: { id: true, name: true, reliabilityGrade: true },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "client",
          entityId: created.id,
          action: "client.created",
          metadata: {
            clientName: created.name,
            reliabilityGrade: created.reliabilityGrade,
          },
        },
      });

      return created;
    });

    clientId = client.id;
  } catch {
    return {
      error: "We could not create this client right now. Please try again.",
    };
  }

  revalidatePath("/app/clients");
  revalidatePath("/app/today");
  redirect(`/app/clients/${clientId}`);
}

export async function updateClientAction(
  clientId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const updated = await getDb().$transaction(async (tx) => {
      const existing = await tx.client.findFirst({
        where: { id: clientId, organizationId: organization.id },
        select: { id: true, name: true },
      });

      if (!existing) {
        notFound();
      }

      const client = await tx.client.update({
        where: { id: existing.id },
        data: parsed.data,
        select: { id: true, name: true, reliabilityGrade: true },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "client",
          entityId: client.id,
          action: "client.updated",
          metadata: {
            previousName: existing.name,
            clientName: client.name,
            reliabilityGrade: client.reliabilityGrade,
          },
        },
      });

      return client;
    });

    revalidatePath("/app/clients");
    revalidatePath(`/app/clients/${updated.id}`);
  } catch (error) {
    if ((error as Error).message === "NEXT_NOT_FOUND") {
      throw error;
    }

    return {
      error: "We could not update this client right now. Please try again.",
    };
  }

  redirect(`/app/clients/${clientId}`);
}
