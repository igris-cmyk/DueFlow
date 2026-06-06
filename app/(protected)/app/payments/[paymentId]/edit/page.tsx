import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updatePaymentAction } from "@/app/(protected)/app/payments/actions";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { PaymentForm } from "@/components/app/payment-form";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, toDateInputValue } from "@/lib/ledger";

type EditPaymentPageProps = {
  params: Promise<{ paymentId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Payment",
};

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const { paymentId } = await params;
  const { organization } = await requireOrganization();
  const payment = await getDb().paymentRecord.findFirst({
    where: { id: paymentId, organizationId: organization.id, type: "PAYMENT" },
  });

  if (!payment) {
    notFound();
  }

  if (payment.status === "CANCELLED") {
    notFound();
  }

  const projectSelect = {
    id: true,
    name: true,
    pendingAmount: true,
    client: { select: { name: true } },
  } as const;
  const [currentProject, recentProjects] = await Promise.all([
    getDb().project.findFirst({
      where: { id: payment.projectId, organizationId: organization.id },
      select: projectSelect,
    }),
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
    ...(currentProject ? [currentProject] : []),
    ...recentProjects.filter((project) => project.id !== currentProject?.id),
  ];
  const action = updatePaymentAction.bind(null, payment.id);

  return (
    <LedgerFormShell
      eyebrow="Received payments"
      title="Edit payment"
      description="Adjust the received payment record. Balances are recalculated server-side after save."
      backHref={`/app/payments/${payment.id}`}
      backLabel="Back to payment"
    >
      <PaymentForm
        action={action}
        projects={projects.map((project) => ({
          id: project.id,
          name: project.name,
          clientName: project.client.name,
          pendingAmount: formatCurrency(project.pendingAmount, organization.currency),
        }))}
        submitLabel="Save payment"
        pendingLabel="Saving payment..."
        payment={{
          projectId: payment.projectId,
          amount: payment.amount.toString(),
          paidDate: toDateInputValue(payment.paidDate),
          method: payment.method,
          referenceNumber: payment.referenceNumber,
          notes: payment.notes,
        }}
      />
    </LedgerFormShell>
  );
}
