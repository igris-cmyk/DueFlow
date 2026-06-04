"use server";

import { redirect } from "next/navigation";
import type { FormActionState } from "@/lib/action-state";
import { getActiveMembership, requireUser } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { createUniqueOrganizationSlug } from "@/lib/slug";
import { organizationSchema } from "@/lib/validation/organization";

export async function createOrganizationAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();
  const existingMembership = await getActiveMembership(user.id);

  if (existingMembership) {
    redirect("/app/today");
  }

  const parsed = organizationSchema.safeParse({
    name: formData.get("name"),
    businessType: formData.get("businessType"),
    currency: formData.get("currency"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const db = getDb();

    await db.$transaction(async (tx) => {
      const slug = await createUniqueOrganizationSlug(parsed.data.name, tx);
      const organization = await tx.organization.create({
        data: {
          name: parsed.data.name,
          slug,
          businessType: parsed.data.businessType,
          currency: parsed.data.currency,
          timezone: parsed.data.timezone,
          ownerId: user.id,
        },
        select: {
          id: true,
          name: true,
          businessType: true,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "organization",
          entityId: organization.id,
          action: "organization.created",
          metadata: {
            name: organization.name,
            businessType: organization.businessType,
          },
        },
      });
    });
  } catch {
    return {
      error: "We could not create your workspace right now. Please try again.",
    };
  }

  redirect("/app/today");
}
