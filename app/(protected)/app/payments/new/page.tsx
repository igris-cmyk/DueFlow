import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { createPaymentAction } from "@/app/(protected)/app/payments/actions";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { PaymentForm } from "@/components/app/payment-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency } from "@/lib/ledger";

type NewPaymentPageProps = {
  searchParams: Promise<{ projectId?: string }>;
};

export const metadata: Metadata = {
  title: "Record Payment",
};

export default async function NewPaymentPage({
  searchParams,
}: NewPaymentPageProps) {
  const { projectId } = await searchParams;
  const { organization } = await requireOrganization();
  const projectSelect = {
    id: true,
    name: true,
    pendingAmount: true,
    client: { select: { name: true } },
  } as const;
  const [selectedProject, recentProjects] = await Promise.all([
    projectId
      ? getDb().project.findFirst({
          where: {
            id: projectId,
            organizationId: organization.id,
            status: { not: "CANCELLED" },
            pendingAmount: { gt: 0 },
          },
          select: projectSelect,
        })
      : Promise.resolve(null),
    getDb().project.findMany({
      where: {
        organizationId: organization.id,
        status: { not: "CANCELLED" },
        pendingAmount: { gt: 0 },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: projectSelect,
    }),
  ]);
  const projects = [
    ...(selectedProject ? [selectedProject] : []),
    ...recentProjects.filter((project) => project.id !== selectedProject?.id),
  ];
  const initialProjectId = selectedProject?.id ?? "";

  return (
    <LedgerFormShell
      eyebrow="Received payments"
      title="Record payment"
      description="Add money received against a project. The client and organization are derived server-side."
      backHref="/app/payments"
      backLabel="Back to payments"
    >
      {projects.length === 0 ? (
        <LedgerEmptyState
          icon={FolderKanban}
          title="No payable projects yet"
          message="A received payment must attach to a tenant-owned project with a pending balance."
          href="/app/projects/new"
          cta="Add project"
        />
      ) : (
        <PaymentForm
          action={createPaymentAction}
          projects={projects.map((project) => ({
            id: project.id,
            name: project.name,
            clientName: project.client.name,
            pendingAmount: formatCurrency(project.pendingAmount, organization.currency),
          }))}
          submitLabel="Record payment"
          pendingLabel="Recording payment..."
          payment={{
            projectId: initialProjectId,
            amount: "",
            paidDate: new Date().toISOString().slice(0, 10),
            method: "",
            referenceNumber: "",
            notes: "",
          }}
        />
      )}
    </LedgerFormShell>
  );
}
