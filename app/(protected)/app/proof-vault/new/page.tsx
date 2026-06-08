import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { createProofAction } from "@/app/(protected)/app/proof-vault/actions";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { ProofForm } from "@/components/app/proof-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/ledger";

type NewProofPageProps = {
  searchParams: Promise<{ projectId?: string; paymentRecordId?: string }>;
};

export const metadata: Metadata = {
  title: "Add Proof",
};

export default async function NewProofPage({ searchParams }: NewProofPageProps) {
  const { projectId, paymentRecordId } = await searchParams;
  const { organization } = await requireOrganization();
  const db = getDb();
  const [selectedProject, selectedPayment, recentProjects, payments] =
    await Promise.all([
      projectId
        ? db.project.findFirst({
            where: { id: projectId, organizationId: organization.id },
            select: {
              id: true,
              name: true,
              client: { select: { name: true } },
            },
          })
        : Promise.resolve(null),
      paymentRecordId
        ? db.paymentRecord.findFirst({
            where: {
              id: paymentRecordId,
              organizationId: organization.id,
              type: "PAYMENT",
            },
            select: { id: true, projectId: true },
          })
        : Promise.resolve(null),
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
  const projects = [
    ...(selectedProject ? [selectedProject] : []),
    ...recentProjects.filter((project) => project.id !== selectedProject?.id),
  ];
  const initialProjectId =
    selectedPayment?.projectId ?? selectedProject?.id ?? "";
  const initialPaymentId =
    selectedPayment && selectedPayment.projectId === initialProjectId
      ? selectedPayment.id
      : "";
  const redirectTo = initialPaymentId
    ? "payment"
    : initialProjectId
      ? "project"
      : "proof";

  return (
    <LedgerFormShell
      eyebrow="Evidence foundation"
      title="Add proof"
      description="Create proof metadata and link it to the client, project, and payment context it supports."
      backHref="/app/proof-vault"
      backLabel="Back to Proof Vault"
    >
      {projects.length === 0 ? (
        <LedgerEmptyState
          icon={FolderKanban}
          title="Add a project first"
          message="Proof must attach to a tenant-owned project so evidence stays connected to the ledger."
          href="/app/projects/new"
          cta="Add project"
        />
      ) : (
        <ProofForm
          action={createProofAction}
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
          submitLabel="Create proof"
          pendingLabel="Creating proof..."
          redirectTo={redirectTo}
          proof={{
            title: "",
            type: "INVOICE",
            status: "READY",
            projectId: initialProjectId,
            paymentRecordId: initialPaymentId,
            description: "",
            sourceUrl: "",
            fileName: "",
            fileUrl: "",
          }}
        />
      )}
    </LedgerFormShell>
  );
}
