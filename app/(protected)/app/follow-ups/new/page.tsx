import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { createFollowUpAction } from "@/app/(protected)/app/follow-ups/actions";
import { FollowUpForm } from "@/components/app/follow-up-form";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { generateFollowUpMessage } from "@/lib/follow-up-message";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/ledger";

type NewFollowUpPageProps = {
  searchParams: Promise<{ projectId?: string; promiseId?: string }>;
};

export const metadata: Metadata = {
  title: "Create Follow-Up",
};

export default async function NewFollowUpPage({
  searchParams,
}: NewFollowUpPageProps) {
  const { projectId, promiseId } = await searchParams;
  const { organization } = await requireOrganization();
  const selectedPromise = promiseId
    ? await getDb().clientPromise.findFirst({
        where: { id: promiseId, organizationId: organization.id },
        select: {
          id: true,
          projectId: true,
          promisedAmount: true,
          promisedDate: true,
          project: {
            select: {
              id: true,
              name: true,
              pendingAmount: true,
              client: { select: { name: true } },
              proofItems: { where: { archivedAt: null, status: { not: "ARCHIVED" } }, take: 1, select: { id: true } },
            },
          },
        },
      })
    : null;
  const initialProjectId = selectedPromise?.projectId ?? projectId ?? "";
  const [projects, promises, payments, proofs] = await Promise.all([
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
    getDb().clientPromise.findMany({
      where: { organizationId: organization.id, status: { in: ["OPEN", "MISSED", "PARTIAL"] } },
      orderBy: { promisedDate: "asc" },
      take: 150,
      select: {
        id: true,
        projectId: true,
        promisedAmount: true,
        promisedDate: true,
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
  const selectedProject = projects.find((project) => project.id === initialProjectId);
  const defaultMessage = selectedPromise?.project
    ? generateFollowUpMessage({
        clientName: selectedPromise.project.client.name,
        projectName: selectedPromise.project.name,
        amount: selectedPromise.promisedAmount ?? selectedPromise.project.pendingAmount,
        currency: organization.currency,
        promisedDate: selectedPromise.promisedDate,
        hasProof: selectedPromise.project.proofItems.length > 0,
        type: "missed-promise",
      })
    : selectedProject
      ? generateFollowUpMessage({
          clientName: selectedProject.client.name,
          projectName: selectedProject.name,
          amount: selectedProject.pendingAmount,
          currency: organization.currency,
          type: "payment-reminder",
        })
      : "";

  return (
    <LedgerFormShell
      eyebrow="Manual follow-up"
      title="Create follow-up"
      description="Set the next action and prepare a respectful message to copy manually."
      backHref={selectedPromise ? `/app/promises/${selectedPromise.id}` : "/app/follow-ups"}
      backLabel={selectedPromise ? "Back to promise" : "Back to follow-ups"}
    >
      {projects.length === 0 ? (
        <LedgerEmptyState
          icon={FolderKanban}
          title="No pending projects"
          message="Follow-ups attach to projects with pending balance so the action stays grounded in the ledger."
          href="/app/projects"
          cta="View projects"
        />
      ) : (
        <FollowUpForm
          action={createFollowUpAction}
          projects={projects.map((project) => ({
            id: project.id,
            name: project.name,
            clientName: project.client.name,
            pendingLabel: formatCurrency(project.pendingAmount, organization.currency),
          }))}
          promises={promises.map((promise) => ({
            id: promise.id,
            projectId: promise.projectId ?? "",
            label: `${promise.client.name} · ${formatCurrency(
              promise.promisedAmount ?? 0,
              organization.currency,
            )} by ${formatDate(promise.promisedDate)}`,
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
          followUp={{
            projectId: initialProjectId,
            promiseId: selectedPromise?.id ?? null,
            paymentRecordId: null,
            proofId: null,
            title: selectedPromise ? "Follow up on missed promise" : "Follow up on pending balance",
            dueDate: toDateInputValue(new Date()),
            channel: "WHATSAPP",
            priority: selectedPromise ? "HIGH" : "NORMAL",
            message: defaultMessage,
            notes: "",
          }}
          submitLabel="Create follow-up"
          pendingLabel="Creating follow-up..."
          redirectTo={selectedPromise ? "promise" : "follow-up"}
        />
      )}
    </LedgerFormShell>
  );
}
