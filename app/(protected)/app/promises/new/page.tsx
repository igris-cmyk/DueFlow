import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { createPromiseAction } from "@/app/(protected)/app/promises/actions";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { PromiseForm } from "@/components/app/promise-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/ledger";

type NewPromisePageProps = {
  searchParams: Promise<{ projectId?: string }>;
};

export const metadata: Metadata = {
  title: "Add Promise",
};

export default async function NewPromisePage({ searchParams }: NewPromisePageProps) {
  const { projectId } = await searchParams;
  const { organization } = await requireOrganization();
  const [projects, payments, proofs] = await Promise.all([
    getDb().project.findMany({
      where: { organizationId: organization.id, pendingAmount: { gt: 0 } },
      orderBy: { updatedAt: "desc" },
      take: 75,
      select: {
        id: true,
        name: true,
        pendingAmount: true,
        client: { select: { name: true } },
      },
    }),
    getDb().paymentRecord.findMany({
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
    getDb().proofItem.findMany({
      where: { organizationId: organization.id, archivedAt: null, status: { not: "ARCHIVED" } },
      orderBy: { createdAt: "desc" },
      take: 150,
      select: { id: true, projectId: true, title: true, type: true },
    }),
  ]);
  const selectedProject = projects.find((project) => project.id === projectId);

  return (
    <LedgerFormShell
      eyebrow="Promise tracking"
      title="Add client promise"
      description="Record what the client said without changing ledger balances. Payments are still recorded separately."
      backHref={selectedProject ? `/app/projects/${selectedProject.id}` : "/app/promises"}
      backLabel={selectedProject ? "Back to project" : "Back to promises"}
    >
      {projects.length === 0 ? (
        <LedgerEmptyState
          icon={FolderKanban}
          title="No pending projects"
          message="Promises attach to projects with pending balance so the commitment stays grounded in the ledger."
          href="/app/projects"
          cta="View projects"
        />
      ) : (
        <PromiseForm
          action={createPromiseAction}
          projects={projects.map((project) => ({
            id: project.id,
            name: project.name,
            clientName: project.client.name,
            pendingLabel: formatCurrency(project.pendingAmount, organization.currency),
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
          proofs={proofs.map((proof) => ({
            id: proof.id,
            projectId: proof.projectId,
            label: `${proof.title} · ${proof.type.toLowerCase().replaceAll("_", " ")}`,
          }))}
          promise={{
            projectId: selectedProject?.id ?? "",
            paymentRecordId: null,
            proofId: null,
            promisedAmount: selectedProject
              ? selectedProject.pendingAmount.toString()
              : "",
            promisedDate: toDateInputValue(new Date()),
            channel: "WHATSAPP",
            promiseText: "",
          }}
          submitLabel="Create promise"
          pendingLabel="Creating promise..."
          redirectTo={selectedProject ? "project" : "promise"}
        />
      )}
    </LedgerFormShell>
  );
}
