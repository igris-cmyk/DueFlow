import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  FileArchive,
  HandCoins,
  ListTodo,
  Pencil,
  Plus,
} from "lucide-react";
import { cancelPaymentAction } from "@/app/(protected)/app/payments/actions";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { DestructiveSubmitButton } from "@/components/forms/destructive-submit-button";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  isProjectOverdue,
  statusLabel,
} from "@/lib/ledger";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const context = await requireOrganization();
  const project = await getDb().project.findFirst({
    where: { id: projectId, organizationId: context.organization.id },
    select: { name: true },
  });

  return { title: project?.name ?? "Project" };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;
  const { organization } = await requireOrganization();
  const project = await getDb().project.findFirst({
    where: { id: projectId, organizationId: organization.id },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      totalValue: true,
      paidAmount: true,
      pendingAmount: true,
      startDate: true,
      dueDate: true,
      completionDate: true,
      paymentTerms: true,
      riskStatus: true,
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
      paymentRecords: {
        where: { type: "PAYMENT" },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          amount: true,
          status: true,
          paidDate: true,
          createdAt: true,
          method: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const overdue = isProjectOverdue(project);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Project ledger
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            {project.client.name} · Due {formatDate(project.dueDate)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/projects/${project.id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit project
          </Link>
          <Link
            href={`/app/payments/new?projectId=${project.id}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
          >
            <Plus aria-hidden="true" className="size-4" />
            Record payment
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Summary label="Total value" value={formatCurrency(project.totalValue, organization.currency)} />
        <Summary label="Received" value={formatCurrency(project.paidAmount, organization.currency)} />
        <Summary
          label="Pending"
          value={formatCurrency(project.pendingAmount, organization.currency)}
          danger={overdue}
        />
        <Summary label="Due date" value={formatDate(project.dueDate)} danger={overdue} />
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <div className="flex flex-wrap gap-2">
            <LedgerBadge tone={overdue ? "red" : "green"}>
              {overdue ? "Overdue" : statusLabel(project.status)}
            </LedgerBadge>
            <LedgerBadge tone="amber">{statusLabel(project.riskStatus)}</LedgerBadge>
          </div>
          <h2 className="mt-5 text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Client
          </h2>
          <Link
            href={`/app/clients/${project.client.id}`}
            className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)]"
          >
            <div>
              <p className="font-black text-[var(--app-text)]">
                {project.client.name}
              </p>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                {[project.client.phone, project.client.email]
                  .filter(Boolean)
                  .join(" · ") || "No contact details yet"}
              </p>
            </div>
            <ArrowRight aria-hidden="true" className="size-4 text-[var(--app-accent)]" />
          </Link>

          <dl className="mt-5 space-y-3 text-sm">
            <Detail label="Start date" value={formatDate(project.startDate)} />
            <Detail label="Completion date" value={formatDate(project.completionDate)} />
            <Detail label="Payment terms" value={project.paymentTerms ?? "Not added"} />
            <Detail label="Description" value={project.description ?? "No description yet"} />
          </dl>
        </div>

        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
              Recent payment history
            </h2>
            <LedgerBadge>{project.paymentRecords.length} shown</LedgerBadge>
          </div>
          <div className="mt-4 space-y-3">
            {project.paymentRecords.length === 0 ? (
              <p className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-sm font-semibold text-[var(--app-text-muted)]">
                No received payments recorded yet.
              </p>
            ) : (
              project.paymentRecords.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link href={`/app/payments/${payment.id}`} className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-[var(--app-text)]">
                        {formatCurrency(payment.amount, organization.currency)}
                      </p>
                      <LedgerBadge
                        tone={payment.status === "CANCELLED" ? "red" : "green"}
                      >
                        {statusLabel(payment.status)}
                      </LedgerBadge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                      {formatDate(payment.paidDate ?? payment.createdAt)}
                      {payment.method ? ` · ${payment.method}` : ""}
                    </p>
                  </Link>
                  {payment.status !== "CANCELLED" ? (
                    <form action={cancelPaymentAction}>
                      <input type="hidden" name="paymentId" value={payment.id} />
                      <DestructiveSubmitButton pendingLabel="Cancelling...">
                        Cancel
                      </DestructiveSubmitButton>
                    </form>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <Future icon={FileArchive} title="Proof" copy="Proof upload comes after the core ledger is reliable." />
        <Future icon={ListTodo} title="Follow-ups" copy="Follow-up queues will use real project balances later." />
        <Future icon={AlertTriangle} title="Promises" copy="Promise tracking is deferred until payments are grounded." />
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

function Future({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof HandCoins;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-soft)]">
      <Icon aria-hidden="true" className="size-5 text-[var(--app-accent)]" />
      <p className="mt-4 text-[0.95rem] font-extrabold text-[var(--app-text)]">
        {title}
      </p>
      <p className="mt-2 text-[0.88rem] leading-6 text-[var(--app-text-muted)]">
        {copy}
      </p>
    </div>
  );
}
