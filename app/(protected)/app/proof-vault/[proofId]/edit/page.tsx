import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateProofAction } from "@/app/(protected)/app/proof-vault/actions";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { ProofForm } from "@/components/app/proof-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/ledger";

type EditProofPageProps = {
  params: Promise<{ proofId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Proof",
};

export default async function EditProofPage({ params }: EditProofPageProps) {
  const { proofId } = await params;
  const { organization } = await requireOrganization();
  const db = getDb();
  const [proof, projects, payments] = await Promise.all([
    db.proofItem.findFirst({
      where: { id: proofId, organizationId: organization.id },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        projectId: true,
        paymentRecordId: true,
        description: true,
        sourceUrl: true,
        fileName: true,
        fileUrl: true,
      },
    }),
    db.project.findMany({
      where: { organizationId: organization.id },
      orderBy: { updatedAt: "desc" },
      take: 75,
      select: {
        id: true,
        name: true,
        client: { select: { name: true } },
      },
    }),
    db.paymentRecord.findMany({
      where: { organizationId: organization.id, type: "PAYMENT" },
      orderBy: { createdAt: "desc" },
      take: 150,
      select: {
        id: true,
        projectId: true,
        amount: true,
        paidDate: true,
        createdAt: true,
        referenceNumber: true,
      },
    }),
  ]);

  if (!proof) {
    notFound();
  }

  const action = updateProofAction.bind(null, proof.id);

  return (
    <LedgerFormShell
      eyebrow="Evidence foundation"
      title="Edit proof"
      description="Update proof metadata while keeping client, project, and payment links tenant-safe."
      backHref={`/app/proof-vault/${proof.id}`}
      backLabel="Back to proof"
    >
      <ProofForm
        action={action}
        projects={projects.map((project) => ({
          id: project.id,
          name: project.name,
          clientName: project.client.name,
        }))}
        payments={payments.map((payment) => ({
          id: payment.id,
          projectId: payment.projectId,
          label: `${formatCurrency(
            payment.amount,
            organization.currency,
          )} · ${formatDate(payment.paidDate ?? payment.createdAt)}${
            payment.referenceNumber ? ` · ${payment.referenceNumber}` : ""
          }`,
        }))}
        submitLabel="Save proof"
        pendingLabel="Saving proof..."
        proof={{
          title: proof.title,
          type: proof.type,
          status: proof.status,
          projectId: proof.projectId,
          paymentRecordId: proof.paymentRecordId,
          description: proof.description,
          sourceUrl: proof.sourceUrl,
          fileName: proof.fileName,
          fileUrl: proof.fileUrl,
        }}
      />
    </LedgerFormShell>
  );
}
