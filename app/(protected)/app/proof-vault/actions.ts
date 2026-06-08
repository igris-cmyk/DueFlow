"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { FormActionState } from "@/lib/action-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { proofSchema } from "@/lib/validation/ledger";

function revalidateProofPaths({
  proofId,
  projectId,
  paymentRecordId,
}: {
  proofId?: string;
  projectId?: string;
  paymentRecordId?: string | null;
}) {
  revalidatePath("/app/proof-vault");

  if (proofId) {
    revalidatePath(`/app/proof-vault/${proofId}`);
  }

  if (projectId) {
    revalidatePath(`/app/projects/${projectId}`);
  }

  if (paymentRecordId) {
    revalidatePath(`/app/payments/${paymentRecordId}`);
  }
}

function getCreateRedirect(
  proofId: string,
  projectId: string,
  paymentRecordId: string | null,
  redirectTo: string,
) {
  if (redirectTo === "payment" && paymentRecordId) {
    return `/app/payments/${paymentRecordId}`;
  }

  if (redirectTo === "project") {
    return `/app/projects/${projectId}`;
  }

  return `/app/proof-vault/${proofId}`;
}

export async function createProofAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = proofSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let createdProof: {
    id: string;
    projectId: string;
    paymentRecordId: string | null;
  };

  try {
    const result = await getDb().$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: { id: parsed.data.projectId, organizationId: organization.id },
        select: {
          id: true,
          name: true,
          clientId: true,
          client: { select: { name: true } },
        },
      });

      if (!project) {
        return "invalid-project" as const;
      }

      const payment = parsed.data.paymentRecordId
        ? await tx.paymentRecord.findFirst({
            where: {
              id: parsed.data.paymentRecordId,
              organizationId: organization.id,
              projectId: project.id,
              type: "PAYMENT",
            },
            select: { id: true },
          })
        : null;

      if (parsed.data.paymentRecordId && !payment) {
        return "invalid-payment" as const;
      }

      const archivedAt =
        parsed.data.status === "ARCHIVED" ? new Date() : null;
      const proof = await tx.proofItem.create({
        data: {
          organizationId: organization.id,
          projectId: project.id,
          clientId: project.clientId,
          paymentRecordId: payment?.id,
          title: parsed.data.title,
          type: parsed.data.type,
          status: parsed.data.status,
          sourceUrl: parsed.data.sourceUrl,
          fileName: parsed.data.fileName,
          fileUrl: parsed.data.fileUrl,
          description: parsed.data.description,
          uploadedById: user.id,
          archivedAt,
        },
        select: {
          id: true,
          title: true,
          type: true,
          projectId: true,
          paymentRecordId: true,
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "proof",
          entityId: proof.id,
          action: "proof.created",
          metadata: {
            proofTitle: proof.title,
            proofType: proof.type,
            projectId: project.id,
            projectName: project.name,
            paymentRecordId: proof.paymentRecordId,
          },
        },
      });

      return proof;
    });

    if (result === "invalid-project") {
      return { fieldErrors: { projectId: ["Select a valid project."] } };
    }

    if (result === "invalid-payment") {
      return {
        fieldErrors: {
          paymentRecordId: [
            "This payment does not belong to the selected project.",
          ],
        },
      };
    }

    createdProof = result;
  } catch {
    return {
      error: "We could not create this proof record right now. Please try again.",
    };
  }

  revalidateProofPaths(createdProof);
  redirect(
    getCreateRedirect(
      createdProof.id,
      createdProof.projectId,
      createdProof.paymentRecordId,
      parsed.data.redirectTo,
    ),
  );
}

export async function updateProofAction(
  proofId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const { user, organization } = await requireOrganization();
  const parsed = proofSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let updatedProof: {
    id: string;
    projectId: string;
    paymentRecordId: string | null;
    previousProjectId: string;
    previousPaymentRecordId: string | null;
  };

  try {
    const result = await getDb().$transaction(async (tx) => {
      const existing = await tx.proofItem.findFirst({
        where: { id: proofId, organizationId: organization.id },
        select: {
          id: true,
          title: true,
          projectId: true,
          paymentRecordId: true,
          archivedAt: true,
        },
      });

      if (!existing) {
        notFound();
      }

      const project = await tx.project.findFirst({
        where: { id: parsed.data.projectId, organizationId: organization.id },
        select: {
          id: true,
          name: true,
          clientId: true,
          client: { select: { name: true } },
        },
      });

      if (!project) {
        return "invalid-project" as const;
      }

      const payment = parsed.data.paymentRecordId
        ? await tx.paymentRecord.findFirst({
            where: {
              id: parsed.data.paymentRecordId,
              organizationId: organization.id,
              projectId: project.id,
              type: "PAYMENT",
            },
            select: { id: true },
          })
        : null;

      if (parsed.data.paymentRecordId && !payment) {
        return "invalid-payment" as const;
      }

      const archivedAt =
        parsed.data.status === "ARCHIVED"
          ? (existing.archivedAt ?? new Date())
          : null;
      const proof = await tx.proofItem.update({
        where: { id: existing.id },
        data: {
          projectId: project.id,
          clientId: project.clientId,
          paymentRecordId: payment?.id ?? null,
          title: parsed.data.title,
          type: parsed.data.type,
          status: parsed.data.status,
          sourceUrl: parsed.data.sourceUrl,
          fileName: parsed.data.fileName,
          fileUrl: parsed.data.fileUrl,
          description: parsed.data.description,
          archivedAt,
        },
        select: {
          id: true,
          title: true,
          type: true,
          projectId: true,
          paymentRecordId: true,
        },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "proof",
          entityId: proof.id,
          action: "proof.updated",
          metadata: {
            previousTitle: existing.title,
            proofTitle: proof.title,
            proofType: proof.type,
            projectId: project.id,
            projectName: project.name,
            paymentRecordId: proof.paymentRecordId,
          },
        },
      });

      return {
        ...proof,
        previousProjectId: existing.projectId,
        previousPaymentRecordId: existing.paymentRecordId,
      };
    });

    if (result === "invalid-project") {
      return { fieldErrors: { projectId: ["Select a valid project."] } };
    }

    if (result === "invalid-payment") {
      return {
        fieldErrors: {
          paymentRecordId: [
            "This payment does not belong to the selected project.",
          ],
        },
      };
    }

    updatedProof = result;
  } catch (error) {
    if ((error as Error).message === "NEXT_NOT_FOUND") {
      throw error;
    }

    return {
      error: "We could not update this proof record right now. Please try again.",
    };
  }

  revalidateProofPaths(updatedProof);
  revalidateProofPaths({
    projectId: updatedProof.previousProjectId,
    paymentRecordId: updatedProof.previousPaymentRecordId,
  });
  redirect(`/app/proof-vault/${proofId}`);
}

export async function archiveProofAction(formData: FormData) {
  const { user, organization } = await requireOrganization();
  const proofId = String(formData.get("proofId") ?? "");

  if (!proofId) {
    notFound();
  }

  const result = await getDb().$transaction(async (tx) => {
    const existing = await tx.proofItem.findFirst({
      where: { id: proofId, organizationId: organization.id },
      select: {
        id: true,
        title: true,
        type: true,
        projectId: true,
        paymentRecordId: true,
        status: true,
      },
    });

    if (!existing) {
      notFound();
    }

    if (existing.status !== "ARCHIVED") {
      await tx.proofItem.update({
        where: { id: existing.id },
        data: { status: "ARCHIVED", archivedAt: new Date() },
      });

      await tx.activityLog.create({
        data: {
          organizationId: organization.id,
          actorId: user.id,
          entityType: "proof",
          entityId: existing.id,
          action: "proof.archived",
          metadata: {
            proofTitle: existing.title,
            proofType: existing.type,
            projectId: existing.projectId,
            paymentRecordId: existing.paymentRecordId,
          },
        },
      });
    }

    return existing;
  });

  revalidateProofPaths(result);
  redirect(`/app/proof-vault/${result.id}`);
}
