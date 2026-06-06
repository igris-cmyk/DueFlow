import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  isProjectOverdue,
  statusLabel,
} from "@/lib/ledger";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const { organization } = await requireOrganization();
  const projects = await getDb().project.findMany({
    where: { organizationId: organization.id },
    orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
    include: {
      client: { select: { name: true } },
      paymentRecords: {
        where: { type: "PAYMENT" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Project ledger
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            Projects
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            Track total project value, received payments, pending balance, due
            dates, and money status from one tenant-safe ledger.
          </p>
        </div>
        <Link
          href="/app/projects/new"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
        >
          <Plus aria-hidden="true" className="size-4" />
          New project
        </Link>
      </div>

      <section className="mt-8">
        {projects.length === 0 ? (
          <LedgerEmptyState
            icon={FolderKanban}
            title="Create your first project"
            message="Projects turn work value into a clear project ledger with received and pending balances."
            href="/app/projects/new"
            cta="Add project"
          />
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => {
              const overdue = isProjectOverdue(project);
              return (
                <Link
                  key={project.id}
                  href={`/app/projects/${project.id}`}
                  className="grid gap-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)] transition hover:border-[var(--app-border-strong)] hover:shadow-[var(--app-shadow)] lg:grid-cols-[1.15fr_repeat(4,0.7fr)_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
                        {project.name}
                      </h2>
                      <LedgerBadge tone={overdue ? "red" : "green"}>
                        {overdue ? "Overdue" : statusLabel(project.status)}
                      </LedgerBadge>
                    </div>
                    <p className="mt-2 truncate text-[0.88rem] text-[var(--app-text-muted)]">
                      {project.client.name}
                    </p>
                    <p className="mt-1 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--app-text-muted)]">
                      Latest payment{" "}
                      {project.paymentRecords[0]
                        ? formatDate(
                            project.paymentRecords[0].paidDate ??
                              project.paymentRecords[0].createdAt,
                          )
                        : "not recorded"}
                    </p>
                  </div>
                  <Metric
                    label="Total"
                    value={formatCurrency(project.totalValue, organization.currency)}
                  />
                  <Metric
                    label="Received"
                    value={formatCurrency(project.paidAmount, organization.currency)}
                  />
                  <Metric
                    label="Pending"
                    value={formatCurrency(project.pendingAmount, organization.currency)}
                    danger={overdue}
                  />
                  <Metric label="Due date" value={formatDate(project.dueDate)} />
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
