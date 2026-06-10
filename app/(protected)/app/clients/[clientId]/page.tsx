import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FolderKanban, Pencil, Plus } from "lucide-react";
import { Prisma } from "@/app/generated/prisma/client";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  statusLabel,
  todayUtcStart,
} from "@/lib/ledger";

type ClientDetailPageProps = {
  params: Promise<{ clientId: string }>;
};

export async function generateMetadata({
  params,
}: ClientDetailPageProps): Promise<Metadata> {
  const { clientId } = await params;
  const context = await requireOrganization();
  const client = await getDb().client.findFirst({
    where: { id: clientId, organizationId: context.organization.id },
    select: { name: true },
  });

  return { title: client?.name ?? "Client" };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = await params;
  const { organization } = await requireOrganization();
  const client = await getDb().client.findFirst({
    where: { id: clientId, organizationId: organization.id },
    include: {
      projects: {
        orderBy: { updatedAt: "desc" },
        include: {
          paymentRecords: {
            where: { type: "PAYMENT" },
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      },
      paymentRecords: {
        where: { type: "PAYMENT" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { project: { select: { name: true } } },
      },
      clientPromises: {
        where: { status: { in: ["OPEN", "MISSED", "PARTIAL"] } },
        orderBy: { promisedDate: "asc" },
        take: 10,
        select: {
          id: true,
          status: true,
          promisedDate: true,
          project: { select: { pendingAmount: true } },
        },
      },
      followUps: {
        where: { status: { in: ["OPEN", "SNOOZED"] } },
        orderBy: { dueDate: "asc" },
        take: 10,
        select: { id: true, dueDate: true },
      },
    },
  });

  if (!client) {
    notFound();
  }

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
  const today = todayUtcStart();
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
  const openPromises = client.clientPromises.length;
  const missedPromises = client.clientPromises.filter(
    (promise) =>
      promise.status === "OPEN" &&
      promise.promisedDate < today &&
      new Prisma.Decimal(promise.project?.pendingAmount ?? 0).gt(0),
  ).length;
  const dueFollowUps = client.followUps.filter(
    (followUp) => followUp.dueDate <= today,
  ).length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Client profile
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {client.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            {client.category ?? "Client"} ·{" "}
            {statusLabel(client.reliabilityGrade)} reliability
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/clients/${client.id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit client
          </Link>
          <Link
            href={`/app/projects/new?clientId=${client.id}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add project
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Summary label="Total value" value={formatCurrency(totalValue, organization.currency)} />
        <Summary label="Received" value={formatCurrency(totalReceived, organization.currency)} />
        <Summary label="Pending" value={formatCurrency(totalPending, organization.currency)} />
        <Summary
          label="Overdue"
          value={formatCurrency(overdueAmount, organization.currency)}
          danger={overdueAmount.gt(0)}
        />
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <Summary label="Open promises" value={String(openPromises)} />
        <Summary
          label="Missed promises"
          value={String(missedPromises)}
          danger={missedPromises > 0}
        />
        <Summary
          label="Follow-ups due"
          value={String(dueFollowUps)}
          danger={dueFollowUps > 0}
        />
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Contact
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Detail label="Phone" value={client.phone ?? "Not added"} />
            <Detail label="Email" value={client.email ?? "Not added"} />
            <Detail label="Address" value={client.address ?? "Not added"} />
            <Detail label="Notes" value={client.notes ?? "No notes yet"} />
          </dl>
        </div>

        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
              Projects
            </h2>
            <LedgerBadge>{activeProjects.length} active</LedgerBadge>
          </div>
          <div className="mt-4 space-y-3">
            {client.projects.length === 0 ? (
              <LedgerEmptyState
                icon={FolderKanban}
                title="No projects yet"
                message="Create a project for this client to set total value, due date, and pending balance."
                href={`/app/projects/new?clientId=${client.id}`}
                cta="Add project"
              />
            ) : (
              client.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/app/projects/${project.id}`}
                  className="grid gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)] sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-black text-[var(--app-text)]">
                      {project.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                      Due {formatDate(project.dueDate)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-black text-[var(--app-text)]">
                      {formatCurrency(project.pendingAmount, organization.currency)}
                    </p>
                    <p className="mt-1 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--app-text-muted)]">
                      Pending balance
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Recent payment records
          </h2>
          <Link
            href="/app/payments"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--app-accent)]"
          >
            View payments
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {client.paymentRecords.length === 0 ? (
            <p className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-sm font-semibold text-[var(--app-text-muted)]">
              No received payments recorded for this client yet.
            </p>
          ) : (
            client.paymentRecords.map((payment) => (
              <Link
                key={payment.id}
                href={`/app/payments/${payment.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black text-[var(--app-text)]">
                    {payment.project.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                    {formatDate(payment.paidDate ?? payment.createdAt)}
                  </p>
                </div>
                <p className="font-black text-[var(--app-text)]">
                  {formatCurrency(payment.amount, organization.currency)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Summary({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
      <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </p>
      <p
        className={
          danger
            ? "mt-3 text-xl font-black text-[var(--red)]"
            : "mt-3 text-xl font-black text-[var(--app-text)]"
        }
      >
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 break-words font-semibold leading-6 text-[var(--app-text-soft)]">
        {value}
      </dd>
    </div>
  );
}
