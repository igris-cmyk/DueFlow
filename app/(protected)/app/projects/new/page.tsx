import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import { createProjectAction } from "@/app/(protected)/app/projects/actions";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { ProjectForm } from "@/components/app/project-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";

type NewProjectPageProps = {
  searchParams: Promise<{ clientId?: string }>;
};

export const metadata: Metadata = {
  title: "New Project",
};

export default async function NewProjectPage({
  searchParams,
}: NewProjectPageProps) {
  const { clientId } = await searchParams;
  const { organization } = await requireOrganization();
  const clients = await getDb().client.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <LedgerFormShell
      eyebrow="Project ledger"
      title="Add project"
      description="Set the agreed work value, due date, and payment terms that drive the pending balance."
      backHref="/app/projects"
      backLabel="Back to projects"
    >
      {clients.length === 0 ? (
        <LedgerEmptyState
          icon={UsersRound}
          title="Add a client first"
          message="A project must belong to a tenant-owned client before it can carry a value or payment history."
          href="/app/clients/new"
          cta="Add client"
        />
      ) : (
        <ProjectForm
          action={createProjectAction}
          clients={clients}
          submitLabel="Create project"
          pendingLabel="Creating project..."
          project={{
            clientId: clientId ?? "",
            name: "",
            description: "",
            status: "ACTIVE",
            totalValue: "",
            startDate: "",
            dueDate: "",
            completionDate: "",
            paymentTerms: "",
            riskStatus: "HEALTHY",
          }}
        />
      )}
    </LedgerFormShell>
  );
}
