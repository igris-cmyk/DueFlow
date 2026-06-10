import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updatePromiseAction } from "@/app/(protected)/app/promises/actions";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { PromiseForm } from "@/components/app/promise-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/ledger";

type EditPromisePageProps = {
  params: Promise<{ promiseId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Promise",
};

export default async function EditPromisePage({ params }: EditPromisePageProps) {
  const { promiseId } = await params;
  const { organization } = await requireOrganization();
  const [promise, projects, payments, proofs] = await Promise.all([
    getDb().clientPromise.findFirst({
      where: { id: promiseId, organizationId: organization.id },
      select: {
        id: true,
        projectId: true,
        paymentRecordId: true,
        proofId: true,
        promisedAmount: true,
        promisedDate: true,
        channel: true,
        promiseText: true,
        status: true,
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

  if (!promise) {
    notFound();
  }

  const action = updatePromiseAction.bind(null, promise.id);

  return (
    <LedgerFormShell
      eyebrow="Promise tracking"
      title="Edit promise"
      description="Update the client commitment without changing payment totals."
      backHref={`/app/promises/${promise.id}`}
      backLabel="Back to promise"
    >
      <PromiseForm
        action={action}
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
          projectId: promise.projectId ?? "",
          paymentRecordId: promise.paymentRecordId,
          proofId: promise.proofId,
          promisedAmount: promise.promisedAmount?.toString() ?? "",
          promisedDate: toDateInputValue(promise.promisedDate),
          channel: promise.channel,
          promiseText: promise.promiseText,
          status: promise.status,
        }}
        submitLabel="Save promise"
        pendingLabel="Saving promise..."
        showStatus
      />
    </LedgerFormShell>
  );
}
