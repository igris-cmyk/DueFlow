import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { cancelPaymentAction } from "@/app/(protected)/app/payments/actions";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { DestructiveSubmitButton } from "@/components/forms/destructive-submit-button";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate, statusLabel } from "@/lib/ledger";

type PaymentDetailPageProps = {
  params: Promise<{ paymentId: string }>;
};

export async function generateMetadata({
  params,
}: PaymentDetailPageProps): Promise<Metadata> {
  const { paymentId } = await params;
  const context = await requireOrganization();
  const payment = await getDb().paymentRecord.findFirst({
    where: { id: paymentId, organizationId: context.organization.id },
    select: { referenceNumber: true },
  });

  return { title: payment?.referenceNumber ?? "Payment" };
}

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentId } = await params;
  const { organization } = await requireOrganization();
  const payment = await getDb().paymentRecord.findFirst({
    where: { id: paymentId, organizationId: organization.id, type: "PAYMENT" },
    select: {
      id: true,
      type: true,
      amount: true,
      status: true,
      paidDate: true,
      method: true,
      referenceNumber: true,
      notes: true,
      cancelledAt: true,
      createdAt: true,
      client: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });

  if (!payment) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Received payment
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {formatCurrency(payment.amount, organization.currency)}
          </h1>
          <p className="mt-4 text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            {payment.client.name} · {payment.project.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {payment.status !== "CANCELLED" ? (
            <Link
              href={`/app/payments/${payment.id}/edit`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
            >
              <Pencil aria-hidden="true" className="size-4" />
              Edit payment
            </Link>
          ) : null}
          {payment.status !== "CANCELLED" ? (
            <form action={cancelPaymentAction}>
              <input type="hidden" name="paymentId" value={payment.id} />
              <DestructiveSubmitButton
                pendingLabel="Cancelling..."
                className="min-h-11 px-4"
              >
                Cancel payment
              </DestructiveSubmitButton>
            </form>
          ) : null}
        </div>
      </div>

      <section className="mt-8 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow)] sm:p-7">
        <div className="flex flex-wrap gap-2">
          <LedgerBadge tone={payment.status === "CANCELLED" ? "red" : "green"}>
            {statusLabel(payment.status)}
          </LedgerBadge>
          <LedgerBadge>{statusLabel(payment.type)}</LedgerBadge>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Client" value={payment.client.name} href={`/app/clients/${payment.client.id}`} />
          <Detail label="Project" value={payment.project.name} href={`/app/projects/${payment.project.id}`} />
          <Detail label="Received date" value={formatDate(payment.paidDate ?? payment.createdAt)} />
          <Detail label="Method" value={payment.method ?? "Not added"} />
          <Detail label="Reference" value={payment.referenceNumber ?? "Not added"} />
          <Detail label="Cancelled at" value={formatDate(payment.cancelledAt)} />
        </dl>
        <div className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4">
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
            Notes
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--app-text-soft)]">
            {payment.notes ?? "No notes added."}
          </p>
        </div>
      </section>
    </div>
  );
}

function Detail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <dt className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-black text-[var(--app-text)]">
        {value}
      </dd>
    </>
  );

  return href ? (
    <Link
      href={href}
      className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)]"
    >
      {content}
    </Link>
  ) : (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4">
      {content}
    </div>
  );
}
