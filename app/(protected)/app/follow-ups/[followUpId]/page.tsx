import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Pencil } from "lucide-react";
import { updateFollowUpStatusAction } from "@/app/(protected)/app/follow-ups/actions";
import { CopyMessageButton } from "@/components/app/copy-message-button";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { DestructiveSubmitButton } from "@/components/forms/destructive-submit-button";
import { SubmitButton } from "@/components/forms/submit-button";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  channelLabel,
  followUpStatusLabel,
  statusTone,
} from "@/lib/follow-up-message";
import { formatCurrency, formatDate, todayUtcStart } from "@/lib/ledger";

type FollowUpDetailPageProps = {
  params: Promise<{ followUpId: string }>;
};

export async function generateMetadata({
  params,
}: FollowUpDetailPageProps): Promise<Metadata> {
  const { followUpId } = await params;
  const context = await requireOrganization();
  const followUp = await getDb().followUp.findFirst({
    where: { id: followUpId, organizationId: context.organization.id },
    select: { title: true },
  });

  return { title: followUp?.title ?? "Follow-Up" };
}

export default async function FollowUpDetailPage({
  params,
}: FollowUpDetailPageProps) {
  const { followUpId } = await params;
  const { organization } = await requireOrganization();
  const today = todayUtcStart();
  const followUp = await getDb().followUp.findFirst({
    where: { id: followUpId, organizationId: organization.id },
    select: {
      id: true,
      title: true,
      dueDate: true,
      status: true,
      channel: true,
      priority: true,
      message: true,
      notes: true,
      completedAt: true,
      snoozedUntil: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { id: true, name: true } },
      project: { select: { id: true, name: true, pendingAmount: true } },
      promise: { select: { id: true, promisedDate: true, promisedAmount: true } },
      paymentRecord: { select: { id: true, amount: true } },
      proof: { select: { id: true, title: true, storageKey: true } },
    },
  });

  if (!followUp) {
    notFound();
  }

  const overdue =
    followUp.dueDate < today && ["OPEN", "SNOOZED"].includes(followUp.status);
  const message = followUp.message ?? "No message added.";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <Link
            href="/app/follow-ups"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--app-accent)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Follow-Ups
          </Link>
          <p className="mt-5 text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Manual follow-up
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {followUp.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <LedgerBadge tone={statusTone(followUp.status, overdue)}>
              {overdue ? "Overdue" : followUpStatusLabel(followUp.status)}
            </LedgerBadge>
            <LedgerBadge>{channelLabel(followUp.channel)}</LedgerBadge>
            <LedgerBadge tone={statusTone(followUp.priority)}>
              {followUp.priority.toLowerCase()}
            </LedgerBadge>
          </div>
        </div>
        <Link
          href={`/app/follow-ups/${followUp.id}/edit`}
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
        >
          <Pencil aria-hidden="true" className="size-4" />
          Edit follow-up
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Summary label="Client" value={followUp.client.name} />
        <Summary label="Due date" value={formatDate(followUp.dueDate)} danger={overdue} />
        <Summary
          label="Pending balance"
          value={formatCurrency(followUp.project?.pendingAmount ?? 0, organization.currency)}
        />
        <Summary label="Completed" value={formatDate(followUp.completedAt)} />
      </section>

      <section className="mt-5 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Message to copy manually
          </h2>
          <CopyMessageButton message={message} />
        </div>
        <textarea
          readOnly
          value={message}
          className="mt-4 min-h-40 w-full resize-y rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-sm font-semibold leading-6 text-[var(--app-text-soft)]"
        />
        <p className="mt-3 text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
          DueFlow does not send messages. Review this text, copy it, then paste
          it manually where appropriate.
        </p>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Ledger context
          </h2>
          <div className="mt-4 space-y-3">
            <ContextLink label="Client" value={followUp.client.name} href={`/app/clients/${followUp.client.id}`} />
            {followUp.project ? (
              <ContextLink label="Project" value={followUp.project.name} href={`/app/projects/${followUp.project.id}`} />
            ) : (
              <ContextBox label="Project" value="Not linked" />
            )}
            {followUp.promise ? (
              <ContextLink
                label="Promise"
                value={`${formatCurrency(followUp.promise.promisedAmount ?? 0, organization.currency)} by ${formatDate(followUp.promise.promisedDate)}`}
                href={`/app/promises/${followUp.promise.id}`}
              />
            ) : (
              <ContextBox label="Promise" value="Not linked" />
            )}
            {followUp.paymentRecord ? (
              <ContextLink
                label="Payment"
                value={formatCurrency(followUp.paymentRecord.amount, organization.currency)}
                href={`/app/payments/${followUp.paymentRecord.id}`}
              />
            ) : null}
            {followUp.proof ? (
              <ContextLink
                label="Proof"
                value={followUp.proof.storageKey ? "Proof file attached" : followUp.proof.title}
                href={`/app/proof-vault/${followUp.proof.id}`}
              />
            ) : null}
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Action state
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail label="Created" value={formatDate(followUp.createdAt)} />
            <Detail label="Updated" value={formatDate(followUp.updatedAt)} />
            <Detail label="Snoozed until" value={formatDate(followUp.snoozedUntil)} />
            <Detail label="Internal note" value={followUp.notes ?? "No note added."} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusForm followUpId={followUp.id} status="DONE" label="Mark done" />
            <StatusForm followUpId={followUp.id} status="SNOOZED" label="Snooze 3 days" />
            <form action={updateFollowUpStatusAction}>
              <input type="hidden" name="followUpId" value={followUp.id} />
              <input type="hidden" name="status" value="CANCELLED" />
              <DestructiveSubmitButton pendingLabel="Cancelling...">
                Cancel
              </DestructiveSubmitButton>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusForm({
  followUpId,
  status,
  label,
}: {
  followUpId: string;
  status: string;
  label: string;
}) {
  return (
    <form action={updateFollowUpStatusAction}>
      <input type="hidden" name="followUpId" value={followUpId} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton pendingLabel="Updating..." className="min-h-10 w-auto px-4 py-2">
        <span className="inline-flex items-center gap-2">
          <Clock3 aria-hidden="true" className="size-4" />
          {label}
        </span>
      </SubmitButton>
    </form>
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
      <p className={danger ? "mt-3 text-lg font-black text-[var(--red)]" : "mt-3 text-lg font-black text-[var(--app-text)]"}>
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
      <dd className="mt-1 break-words text-sm font-semibold leading-6 text-[var(--app-text-soft)]">
        {value}
      </dd>
    </div>
  );
}

function ContextLink({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)]"
    >
      <ContextContent label={label} value={value} />
    </Link>
  );
}

function ContextBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4">
      <ContextContent label={label} value={value} />
    </div>
  );
}

function ContextContent({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </p>
      <p className="mt-1 break-words text-base font-black text-[var(--app-text)]">
        {value}
      </p>
    </>
  );
}
