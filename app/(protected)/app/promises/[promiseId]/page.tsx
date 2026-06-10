import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Pencil, Plus, XCircle } from "lucide-react";
import { updatePromiseStatusAction } from "@/app/(protected)/app/promises/actions";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { DestructiveSubmitButton } from "@/components/forms/destructive-submit-button";
import { SubmitButton } from "@/components/forms/submit-button";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  channelLabel,
  followUpStatusLabel,
  isPromiseComputedMissed,
  promiseStatusLabel,
  statusTone,
} from "@/lib/follow-up-message";
import { formatCurrency, formatDate } from "@/lib/ledger";

type PromiseDetailPageProps = {
  params: Promise<{ promiseId: string }>;
};

export async function generateMetadata({
  params,
}: PromiseDetailPageProps): Promise<Metadata> {
  const { promiseId } = await params;
  const context = await requireOrganization();
  const promise = await getDb().clientPromise.findFirst({
    where: { id: promiseId, organizationId: context.organization.id },
    select: { client: { select: { name: true } } },
  });

  return { title: promise ? `${promise.client.name} Promise` : "Promise" };
}

export default async function PromiseDetailPage({
  params,
}: PromiseDetailPageProps) {
  const { promiseId } = await params;
  const { organization } = await requireOrganization();
  const promise = await getDb().clientPromise.findFirst({
    where: { id: promiseId, organizationId: organization.id },
    select: {
      id: true,
      promisedAmount: true,
      promisedDate: true,
      channel: true,
      status: true,
      promiseText: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { id: true, name: true } },
      project: {
        select: {
          id: true,
          name: true,
          pendingAmount: true,
        },
      },
      paymentRecord: {
        select: { id: true, amount: true, paidDate: true, createdAt: true },
      },
      proof: { select: { id: true, title: true, storageKey: true } },
      followUps: {
        orderBy: { dueDate: "asc" },
        take: 8,
        select: {
          id: true,
          title: true,
          dueDate: true,
          status: true,
          channel: true,
          priority: true,
        },
      },
    },
  });

  if (!promise) {
    notFound();
  }

  const missed = isPromiseComputedMissed({
    status: promise.status,
    promisedDate: promise.promisedDate,
    projectPendingAmount: promise.project?.pendingAmount,
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <Link
            href="/app/promises"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--app-accent)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Promises
          </Link>
          <p className="mt-5 text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Client promised
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {promise.client.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <LedgerBadge tone={statusTone(promise.status, missed)}>
              {missed ? "Promise missed" : promiseStatusLabel(promise.status)}
            </LedgerBadge>
            <LedgerBadge>{channelLabel(promise.channel)}</LedgerBadge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/promises/${promise.id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit promise
          </Link>
          <Link
            href={`/app/follow-ups/new?promiseId=${promise.id}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
          >
            <Plus aria-hidden="true" className="size-4" />
            Create follow-up
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Summary
          label="Promised amount"
          value={formatCurrency(promise.promisedAmount ?? 0, organization.currency)}
        />
        <Summary label="Promised date" value={formatDate(promise.promisedDate)} danger={missed} />
        <Summary
          label="Project pending"
          value={formatCurrency(promise.project?.pendingAmount ?? 0, organization.currency)}
        />
        <Summary label="Status" value={missed ? "Missed" : promiseStatusLabel(promise.status)} danger={missed} />
      </section>

      <section className="mt-5 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
        <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
          Promise context
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ContextLink label="Client" value={promise.client.name} href={`/app/clients/${promise.client.id}`} />
          {promise.project ? (
            <ContextLink label="Project" value={promise.project.name} href={`/app/projects/${promise.project.id}`} />
          ) : (
            <ContextBox label="Project" value="Not linked" />
          )}
          {promise.paymentRecord ? (
            <ContextLink
              label="Linked payment"
              value={formatCurrency(promise.paymentRecord.amount, organization.currency)}
              href={`/app/payments/${promise.paymentRecord.id}`}
            />
          ) : (
            <ContextBox label="Linked payment" value="Not linked" />
          )}
          {promise.proof ? (
            <ContextLink
              label="Linked proof"
              value={promise.proof.storageKey ? "Proof file attached" : promise.proof.title}
              href={`/app/proof-vault/${promise.proof.id}`}
            />
          ) : (
            <ContextBox label="Linked proof" value="Not linked" />
          )}
          <ContextBox label="Created" value={formatDate(promise.createdAt)} />
          <ContextBox label="Updated" value={formatDate(promise.updatedAt)} />
        </div>
        <div className="mt-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4">
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
            Note
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[var(--app-text-soft)]">
            {promise.promiseText}
          </p>
        </div>
        <p className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
          Marking a promise kept does not record money received. Use Record Payment to update balances.
        </p>
      </section>

      <section className="mt-5 flex flex-wrap gap-2">
        {promise.project ? (
          <Link
            href={`/app/payments/new?projectId=${promise.project.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
          >
            Record payment separately
          </Link>
        ) : null}
        <StatusForm promiseId={promise.id} status="KEPT" label="Mark kept" icon="kept" />
        <StatusForm promiseId={promise.id} status="MISSED" label="Mark missed" icon="missed" />
        <StatusForm promiseId={promise.id} status="PARTIAL" label="Mark partial" icon="partial" />
        <form action={updatePromiseStatusAction}>
          <input type="hidden" name="promiseId" value={promise.id} />
          <input type="hidden" name="status" value="CANCELLED" />
          <DestructiveSubmitButton pendingLabel="Cancelling...">
            Cancel promise
          </DestructiveSubmitButton>
        </form>
      </section>

      <section className="mt-5 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Related follow-ups
          </h2>
          <Link
            href={`/app/follow-ups/new?promiseId=${promise.id}`}
            className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add follow-up
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {promise.followUps.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#dacdb9] bg-[var(--app-surface-muted)] p-5 text-sm font-semibold text-[var(--app-text-muted)]">
              No next action set for this promise.
            </p>
          ) : (
            promise.followUps.map((followUp) => (
              <Link
                key={followUp.id}
                href={`/app/follow-ups/${followUp.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black text-[var(--app-text)]">{followUp.title}</p>
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                    Due {formatDate(followUp.dueDate)} · {channelLabel(followUp.channel)}
                  </p>
                </div>
                <LedgerBadge tone={statusTone(followUp.status)}>
                  {followUpStatusLabel(followUp.status)}
                </LedgerBadge>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function StatusForm({
  promiseId,
  status,
  label,
  icon,
}: {
  promiseId: string;
  status: string;
  label: string;
  icon: "kept" | "missed" | "partial";
}) {
  const Icon = icon === "kept" ? CheckCircle2 : icon === "missed" ? XCircle : Clock3;

  return (
    <form action={updatePromiseStatusAction}>
      <input type="hidden" name="promiseId" value={promiseId} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton pendingLabel="Updating..." className="min-h-10 w-auto px-4 py-2">
        <span className="inline-flex items-center gap-2">
          <Icon aria-hidden="true" className="size-4" />
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
      <p className={danger ? "mt-3 text-xl font-black text-[var(--red)]" : "mt-3 text-xl font-black text-[var(--app-text)]"}>
        {value}
      </p>
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
      className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)]"
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
