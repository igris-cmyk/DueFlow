import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateFollowUpAction } from "@/app/(protected)/app/follow-ups/actions";
import { FollowUpForm } from "@/components/app/follow-up-form";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/ledger";

type EditFollowUpPageProps = {
  params: Promise<{ followUpId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Follow-Up",
};

export default async function EditFollowUpPage({
  params,
}: EditFollowUpPageProps) {
  const { followUpId } = await params;
  const { organization } = await requireOrganization();
  const [followUp, projects, promises, payments, proofs] = await Promise.all([
    getDb().followUp.findFirst({
      where: { id: followUpId, organizationId: organization.id },
      select: {
        id: true,
        projectId: true,
        promiseId: true,
        paymentRecordId: true,
        proofId: true,
        title: true,
        dueDate: true,
        channel: true,
        priority: true,
        status: true,
        message: true,
        notes: true,
      },
    }),
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

  if (!followUp) {
    notFound();
  }

  const action = updateFollowUpAction.bind(null, followUp.id);

  return (
    <LedgerFormShell
      eyebrow="Manual follow-up"
      title="Edit follow-up"
      description="Keep the next action current without sending anything automatically."
      backHref={`/app/follow-ups/${followUp.id}`}
      backLabel="Back to follow-up"
    >
      <FollowUpForm
        action={action}
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
          projectId: followUp.projectId ?? "",
          promiseId: followUp.promiseId,
          paymentRecordId: followUp.paymentRecordId,
          proofId: followUp.proofId,
          title: followUp.title,
          dueDate: toDateInputValue(followUp.dueDate),
          channel: followUp.channel,
          priority: followUp.priority,
          status: followUp.status,
          message: followUp.message,
          notes: followUp.notes,
        }}
        submitLabel="Save follow-up"
        pendingLabel="Saving follow-up..."
        showStatus
      />
    </LedgerFormShell>
  );
}
