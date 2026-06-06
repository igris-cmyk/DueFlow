import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateProjectAction } from "@/app/(protected)/app/projects/actions";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { ProjectForm } from "@/components/app/project-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { toDateInputValue } from "@/lib/ledger";

type EditProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { projectId } = await params;
  const { organization } = await requireOrganization();
  const [project, clients] = await Promise.all([
    getDb().project.findFirst({
      where: { id: projectId, organizationId: organization.id },
      select: {
        id: true,
        clientId: true,
        name: true,
        description: true,
        status: true,
        totalValue: true,
        startDate: true,
        dueDate: true,
        completionDate: true,
        paymentTerms: true,
        riskStatus: true,
      },
    }),
    getDb().client.findMany({
      where: { organizationId: organization.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const action = updateProjectAction.bind(null, project.id);

  return (
    <LedgerFormShell
      eyebrow="Project ledger"
      title="Edit project"
      description="Update project terms while keeping received and pending balances server-calculated."
      backHref={`/app/projects/${project.id}`}
      backLabel="Back to project"
    >
      <ProjectForm
        action={action}
        clients={clients}
        submitLabel="Save project"
        pendingLabel="Saving project..."
        project={{
          clientId: project.clientId,
          name: project.name,
          description: project.description,
          status: project.status,
          totalValue: project.totalValue.toString(),
          startDate: toDateInputValue(project.startDate),
          dueDate: toDateInputValue(project.dueDate),
          completionDate: toDateInputValue(project.completionDate),
          paymentTerms: project.paymentTerms,
          riskStatus: project.riskStatus,
        }}
      />
    </LedgerFormShell>
  );
}
