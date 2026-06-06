import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, HandCoins, Plus, UsersRound } from "lucide-react";
import { Prisma } from "@/app/generated/prisma/client";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { TodayEmptyState } from "@/components/app/today-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  getCurrentMonthRange,
  getCurrentWeekRange,
  todayUtcStart,
} from "@/lib/ledger";

export const metadata: Metadata = {
  title: "Today’s Cash Desk",
};

export default async function TodayPage() {
  const { organization } = await requireOrganization();
  const db = getDb();
  const today = todayUtcStart();
  const week = getCurrentWeekRange();
  const month = getCurrentMonthRange();
  const activeProjectWhere = {
    organizationId: organization.id,
    status: { not: "CANCELLED" },
  } satisfies Prisma.ProjectWhereInput;
  const pendingProjectWhere = {
    ...activeProjectWhere,
    pendingAmount: { gt: 0 },
  } satisfies Prisma.ProjectWhereInput;
  const overdueProjectWhere = {
    ...pendingProjectWhere,
    dueDate: { lt: today },
  } satisfies Prisma.ProjectWhereInput;
  const dueThisWeekWhere = {
    ...pendingProjectWhere,
    dueDate: { gte: today, lt: week.end },
  } satisfies Prisma.ProjectWhereInput;

  const [
    clientsCount,
    activeProjectsCount,
    totalPendingAggregate,
    overdueAggregate,
    dueThisWeekAggregate,
    receivedThisMonth,
    overdueProjects,
    dueThisWeekProjects,
    pendingProjects,
    recentPayments,
  ] = await Promise.all([
    db.client.count({ where: { organizationId: organization.id } }),
    db.project.count({ where: activeProjectWhere }),
    db.project.aggregate({
      where: activeProjectWhere,
      _sum: { pendingAmount: true },
    }),
    db.project.aggregate({
      where: overdueProjectWhere,
      _sum: { pendingAmount: true },
    }),
    db.project.aggregate({
      where: dueThisWeekWhere,
      _sum: { pendingAmount: true },
    }),
    db.paymentRecord.aggregate({
      where: {
        organizationId: organization.id,
        type: "PAYMENT",
        status: { not: "CANCELLED" },
        OR: [
          { paidDate: { gte: month.start, lt: month.end } },
          {
            paidDate: null,
            createdAt: { gte: month.start, lt: month.end },
          },
        ],
      },
      _sum: { amount: true },
    }),
    db.project.findMany({
      where: overdueProjectWhere,
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        name: true,
        dueDate: true,
        pendingAmount: true,
        client: { select: { name: true } },
      },
    }),
    db.project.findMany({
      where: dueThisWeekWhere,
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        name: true,
        dueDate: true,
        pendingAmount: true,
        client: { select: { name: true } },
      },
    }),
    db.project.findMany({
      where: pendingProjectWhere,
      orderBy: [{ pendingAmount: "desc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        name: true,
        paidAmount: true,
        pendingAmount: true,
        client: { select: { name: true } },
      },
    }),
    db.paymentRecord.findMany({
      where: {
        organizationId: organization.id,
        type: "PAYMENT",
        status: { not: "CANCELLED" },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        paidDate: true,
        createdAt: true,
        client: { select: { name: true } },
        project: { select: { name: true } },
      },
    }),
  ]);

  if (clientsCount === 0 && activeProjectsCount === 0) {
    return <TodayEmptyState />;
  }

  const totalPending =
    totalPendingAggregate._sum.pendingAmount ?? new Prisma.Decimal(0);
  const overdueTotal =
    overdueAggregate._sum.pendingAmount ?? new Prisma.Decimal(0);
  const dueThisWeek =
    dueThisWeekAggregate._sum.pendingAmount ?? new Prisma.Decimal(0);

  const cards = [
    {
      label: "Total pending",
      value: formatCurrency(totalPending, organization.currency),
      tone: totalPending.gt(0) ? "amber" : "green",
    },
    {
      label: "Total overdue",
      value: formatCurrency(overdueTotal, organization.currency),
      tone: overdueTotal.gt(0) ? "red" : "green",
    },
    {
      label: "Due this week",
      value: formatCurrency(dueThisWeek, organization.currency),
      tone: dueThisWeek.gt(0) ? "amber" : "green",
    },
    {
      label: "Received this month",
      value: formatCurrency(receivedThisMonth._sum.amount ?? 0, organization.currency),
      tone: "green",
    },
    {
      label: "Active clients",
      value: String(clientsCount),
      tone: "slate",
    },
    {
      label: "Active projects",
      value: String(activeProjectsCount),
      tone: "slate",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Every rupee has a status
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.055em] text-[var(--app-text)] sm:text-4xl lg:text-5xl">
            Today’s Cash Desk
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)] sm:text-base sm:leading-8">
            Real organization-scoped totals from your clients, projects, and
            received payment records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/app/clients/new" icon={UsersRound} label="Add client" />
          <QuickLink href="/app/projects/new" icon={BriefcaseBusiness} label="Add project" />
          <QuickLink href="/app/payments/new" icon={HandCoins} label="Record payment" primary />
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]"
          >
            <LedgerBadge tone={card.tone as "green" | "amber" | "red" | "slate"}>
              {card.label}
            </LedgerBadge>
            <p className="mt-4 text-xl font-black tracking-[-0.035em] text-[var(--app-text)]">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel title="Payments needing attention">
          {overdueProjects.length === 0 && dueThisWeekProjects.length === 0 ? (
            <EmptyLine copy="No overdue or due-this-week pending balances." />
          ) : (
            [...overdueProjects, ...dueThisWeekProjects]
              .filter(
                (project, index, list) =>
                  list.findIndex((item) => item.id === project.id) === index,
              )
              .slice(0, 6)
              .map((project) => (
                <ProjectLine
                  key={project.id}
                  href={`/app/projects/${project.id}`}
                  title={project.name}
                  client={project.client.name}
                  amount={formatCurrency(project.pendingAmount, organization.currency)}
                  meta={`Due ${formatDate(project.dueDate)}`}
                  danger={Boolean(project.dueDate && project.dueDate < today)}
                />
              ))
          )}
        </Panel>

        <Panel title="Recently received payments">
          {recentPayments.length === 0 ? (
            <EmptyLine copy="No received payments recorded yet." />
          ) : (
            recentPayments.map((payment) => (
              <ProjectLine
                key={payment.id}
                href={`/app/payments/${payment.id}`}
                title={payment.client.name}
                client={payment.project.name}
                amount={formatCurrency(payment.amount, organization.currency)}
                meta={formatDate(payment.paidDate ?? payment.createdAt)}
              />
            ))
          )}
        </Panel>
      </section>

      <section className="mt-5 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Projects with pending balance
          </h2>
          <Link
            href="/app/projects"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--app-accent)]"
          >
            View projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {pendingProjects.length === 0 ? (
            <EmptyLine copy="No pending project balances right now." />
          ) : (
            pendingProjects.map((project) => (
              <ProjectLine
                key={project.id}
                href={`/app/projects/${project.id}`}
                title={project.name}
                client={project.client.name}
                amount={formatCurrency(project.pendingAmount, organization.currency)}
                meta={`Received ${formatCurrency(project.paidAmount, organization.currency)}`}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  primary = false,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
          : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
      }
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </Link>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
      <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
        {title}
      </h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function ProjectLine({
  href,
  title,
  client,
  amount,
  meta,
  danger = false,
}: {
  href: string;
  title: string;
  client: string;
  amount: string;
  meta: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className="grid gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)] sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div className="min-w-0">
        <p className="truncate font-black text-[var(--app-text)]">{title}</p>
        <p className="mt-1 truncate text-sm text-[var(--app-text-muted)]">
          {client}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className={danger ? "font-black text-[var(--red)]" : "font-black text-[var(--app-text)]"}>
          {amount}
        </p>
        <p className="mt-1 text-[0.78rem] font-bold text-[var(--app-text-muted)]">
          {meta}
        </p>
      </div>
    </Link>
  );
}

function EmptyLine({ copy }: { copy: string }) {
  return (
    <p className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
      {copy}
    </p>
  );
}
