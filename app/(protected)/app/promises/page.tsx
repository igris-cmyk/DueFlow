import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake, Plus } from "lucide-react";
import type { Prisma } from "@/app/generated/prisma/client";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  channelLabel,
  isPromiseComputedMissed,
  promiseStatusLabel,
  statusTone,
} from "@/lib/follow-up-message";
import { formatCurrency, formatDate, todayUtcStart } from "@/lib/ledger";

type PromisesPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export const metadata: Metadata = {
  title: "Promises",
};

export default async function PromisesPage({ searchParams }: PromisesPageProps) {
  const { status = "active" } = await searchParams;
  const { organization } = await requireOrganization();
  const today = todayUtcStart();
  const where: Prisma.ClientPromiseWhereInput = {
    organizationId: organization.id,
    ...(status === "kept"
      ? { status: "KEPT" as const }
      : status === "cancelled"
        ? { status: "CANCELLED" as const }
        : status === "missed"
          ? { status: "OPEN" as const, promisedDate: { lt: today } }
          : { status: { in: ["OPEN", "MISSED", "PARTIAL"] } }),
  };
  const promises = await getDb().clientPromise.findMany({
    where,
    orderBy: [{ promisedDate: "asc" }, { createdAt: "desc" }],
    take: 75,
    select: {
      id: true,
      promisedAmount: true,
      promisedDate: true,
      channel: true,
      status: true,
      promiseText: true,
      client: { select: { name: true } },
      project: {
        select: {
          id: true,
          name: true,
          pendingAmount: true,
        },
      },
      followUps: {
        where: { status: { in: ["OPEN", "SNOOZED"] } },
        select: { id: true },
        take: 3,
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Promise history
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            Client Promises
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            Record what a client said, when they said they would pay, and what
            next action should happen if that promise slips.
          </p>
        </div>
        <Link
          href="/app/promises/new"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add promise
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["active", "Active"],
          ["missed", "Missed"],
          ["kept", "Kept"],
          ["cancelled", "Cancelled"],
        ].map(([value, label]) => (
          <Link
            key={value}
            href={`/app/promises?status=${value}`}
            className={
              status === value
                ? "rounded-full border border-[#bfd5c5] bg-[var(--app-accent-soft)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--app-accent)]"
                : "rounded-full border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--app-text-muted)]"
            }
          >
            {label}
          </Link>
        ))}
      </div>

      <section className="mt-6">
        {promises.length === 0 ? (
          <LedgerEmptyState
            icon={Handshake}
            title="No client promises yet"
            message="When a client says “I’ll pay tomorrow” or “I’ll clear it Friday,” record it here so it does not disappear in WhatsApp."
            href="/app/promises/new"
            cta="Add promise"
          />
        ) : (
          <div className="grid gap-4">
            {promises.map((promise) => {
              const missed = isPromiseComputedMissed({
                status: promise.status,
                promisedDate: promise.promisedDate,
                projectPendingAmount: promise.project?.pendingAmount,
              });

              return (
                <Link
                  key={promise.id}
                  href={`/app/promises/${promise.id}`}
                  className="grid gap-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)] transition hover:border-[var(--app-border-strong)] hover:shadow-[var(--app-shadow)] lg:grid-cols-[1.2fr_0.75fr_0.7fr_0.7fr_auto] lg:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
                        {promise.client.name}
                      </h2>
                      <LedgerBadge tone={statusTone(promise.status, missed)}>
                        {missed ? "Promise missed" : promiseStatusLabel(promise.status)}
                      </LedgerBadge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[0.88rem] text-[var(--app-text-muted)]">
                      {promise.promiseText}
                    </p>
                  </div>
                  <Metric label="Project" value={promise.project?.name ?? "No project"} />
                  <Metric
                    label="Promised"
                    value={formatCurrency(promise.promisedAmount ?? 0, organization.currency)}
                  />
                  <Metric label="Date" value={formatDate(promise.promisedDate)} />
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <LedgerBadge>{channelLabel(promise.channel)}</LedgerBadge>
                    <LedgerBadge tone={promise.followUps.length ? "green" : "amber"}>
                      {promise.followUps.length ? "Next action set" : "No action"}
                    </LedgerBadge>
                    <ArrowRight aria-hidden="true" className="hidden size-5 text-[var(--app-accent)] lg:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </p>
      <p className="mt-1 truncate font-black text-[var(--app-text)]">{value}</p>
    </div>
  );
}
