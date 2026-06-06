import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HandCoins, Plus } from "lucide-react";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate, statusLabel } from "@/lib/ledger";

type PaymentsPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const { filter = "all" } = await searchParams;
  const { organization } = await requireOrganization();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const payments = await getDb().paymentRecord.findMany({
    where: {
      organizationId: organization.id,
      type: "PAYMENT",
      status:
        filter === "cancelled"
          ? "CANCELLED"
          : filter === "received"
            ? { not: "CANCELLED" }
            : undefined,
      paidDate:
        filter === "this-month"
          ? { gte: monthStart, lt: monthEnd }
          : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  const filters = [
    { label: "All", href: "/app/payments", active: filter === "all" },
    {
      label: "Received",
      href: "/app/payments?filter=received",
      active: filter === "received",
    },
    {
      label: "This month",
      href: "/app/payments?filter=this-month",
      active: filter === "this-month",
    },
    {
      label: "Cancelled",
      href: "/app/payments?filter=cancelled",
      active: filter === "cancelled",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Received payments
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            Payments
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            Record real money received against tenant-owned projects. Pending
            money stays derived from project value minus valid payments.
          </p>
        </div>
        <Link
          href="/app/payments/new"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
        >
          <Plus aria-hidden="true" className="size-4" />
          Record payment
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              item.active
                ? "inline-flex min-h-10 items-center rounded-xl border border-[#bcd6c4] bg-[var(--app-accent-soft)] px-4 text-sm font-extrabold text-[var(--app-accent)]"
                : "inline-flex min-h-10 items-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] transition hover:border-[var(--app-border-strong)]"
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      <section className="mt-6">
        {payments.length === 0 ? (
          <LedgerEmptyState
            icon={HandCoins}
            title="No received payments yet"
            message="Record received money against a project so paid and pending balances update correctly."
            href="/app/payments/new"
            cta="Record payment"
          />
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <Link
                key={payment.id}
                href={`/app/payments/${payment.id}`}
                className="grid gap-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)] transition hover:border-[var(--app-border-strong)] hover:shadow-[var(--app-shadow)] lg:grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
                      {payment.client.name}
                    </h2>
                    <LedgerBadge tone={payment.status === "CANCELLED" ? "red" : "green"}>
                      {statusLabel(payment.status)}
                    </LedgerBadge>
                  </div>
                  <p className="mt-2 truncate text-[0.88rem] text-[var(--app-text-muted)]">
                    {payment.project.name}
                  </p>
                </div>
                <Metric
                  label="Amount"
                  value={formatCurrency(payment.amount, organization.currency)}
                  danger={payment.status === "CANCELLED"}
                />
                <Metric
                  label="Date"
                  value={formatDate(payment.paidDate ?? payment.createdAt)}
                />
                <Metric
                  label="Method"
                  value={payment.method ?? "Not added"}
                />
                <span className="hidden justify-self-end text-[var(--app-accent)] lg:inline-flex">
                  <ArrowRight aria-hidden="true" className="size-5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </p>
      <p
        className={
          danger
            ? "mt-1 font-black text-[var(--red)]"
            : "mt-1 font-black text-[var(--app-text)]"
        }
      >
        {value}
      </p>
    </div>
  );
}
