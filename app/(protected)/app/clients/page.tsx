import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus, UsersRound } from "lucide-react";
import { Prisma } from "@/app/generated/prisma/client";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate, statusLabel } from "@/lib/ledger";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const { organization } = await requireOrganization();
  const clients = await getDb().client.findMany({
    where: { organizationId: organization.id },
    orderBy: { updatedAt: "desc" },
    include: {
      projects: {
        select: {
          id: true,
          status: true,
          totalValue: true,
          paidAmount: true,
          pendingAmount: true,
          dueDate: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Client ledger
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            Clients
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            Connect pending money, projects, and payment history to the real
            business relationship behind each balance.
          </p>
        </div>
        <Link
          href="/app/clients/new"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
        >
          <Plus aria-hidden="true" className="size-4" />
          New client
        </Link>
      </div>

      <section className="mt-8">
        {clients.length === 0 ? (
          <LedgerEmptyState
            icon={UsersRound}
            title="Add your first client"
            message="Add your first client to connect pending money, projects, and payment history to a real business relationship."
            href="/app/clients/new"
            cta="Add client"
          />
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => {
              const activeProjects = client.projects.filter(
                (project) => project.status !== "CANCELLED",
              );
              const totalValue = activeProjects.reduce(
                (sum, project) => sum.plus(project.totalValue),
                new Prisma.Decimal(0),
              );
              const totalReceived = activeProjects.reduce(
                (sum, project) => sum.plus(project.paidAmount),
                new Prisma.Decimal(0),
              );
              const totalPending = activeProjects.reduce(
                (sum, project) => sum.plus(project.pendingAmount),
                new Prisma.Decimal(0),
              );
              const today = new Date();
              const overdueAmount = activeProjects
                .filter(
                  (project) =>
                    project.dueDate &&
                    project.dueDate < today &&
                    new Prisma.Decimal(project.pendingAmount).gt(0),
                )
                .reduce(
                  (sum, project) => sum.plus(project.pendingAmount),
                  new Prisma.Decimal(0),
                );

              return (
                <Link
                  key={client.id}
                  href={`/app/clients/${client.id}`}
                  className="grid gap-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)] transition hover:border-[var(--app-border-strong)] hover:shadow-[var(--app-shadow)] lg:grid-cols-[1.2fr_repeat(4,0.7fr)_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
                        {client.name}
                      </h2>
                      <LedgerBadge>
                        {statusLabel(client.reliabilityGrade)}
                      </LedgerBadge>
                    </div>
                    <p className="mt-2 truncate text-[0.88rem] text-[var(--app-text-muted)]">
                      {[client.phone, client.email].filter(Boolean).join(" · ") ||
                        "No contact details yet"}
                    </p>
                    <p className="mt-1 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--app-text-muted)]">
                      Updated {formatDate(client.updatedAt)}
                    </p>
                  </div>
                  <Metric label="Active projects" value={activeProjects.length} />
                  <Metric
                    label="Total value"
                    value={formatCurrency(totalValue, organization.currency)}
                  />
                  <Metric
                    label="Received"
                    value={formatCurrency(totalReceived, organization.currency)}
                  />
                  <Metric
                    label="Pending"
                    value={formatCurrency(totalPending, organization.currency)}
                    danger={overdueAmount.gt(0)}
                  />
                  <span className="hidden justify-self-end text-[var(--app-accent)] lg:inline-flex">
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </span>
                </Link>
              );
            })}
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
  value: React.ReactNode;
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
