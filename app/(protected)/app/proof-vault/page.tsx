import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileArchive, Plus } from "lucide-react";
import type { Prisma } from "@/app/generated/prisma/client";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { LedgerEmptyState } from "@/components/app/ledger-empty-state";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/ledger";
import {
  activeProofWhere,
  proofStatusLabel,
  proofStatusTone,
  proofTypeLabel,
  proofTypeOptions,
} from "@/lib/proof";

type ProofVaultPageProps = {
  searchParams: Promise<{
    type?: string;
    context?: string;
    projectId?: string;
    clientId?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Proof Vault",
};

export default async function ProofVaultPage({
  searchParams,
}: ProofVaultPageProps) {
  const { type, context = "active", projectId, clientId } = await searchParams;
  const { organization } = await requireOrganization();
  const db = getDb();
  const validType = proofTypeOptions.find(
    (option) => option.value === type,
  )?.value;
  const where: Prisma.ProofItemWhereInput = {
    organizationId: organization.id,
    type: validType,
    projectId: projectId || undefined,
    clientId: clientId || undefined,
    paymentRecordId:
      context === "payment-linked"
        ? { not: null }
        : context === "payment-unlinked"
          ? null
          : undefined,
    status:
      context === "missing"
        ? "MISSING_CONTEXT"
        : context === "archived"
          ? "ARCHIVED"
          : undefined,
    ...(context === "archived" || context === "missing"
      ? {}
      : activeProofWhere()),
  };

  const [proofItems, projects, clients, activeCount, missingCount] =
    await Promise.all([
      db.proofItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 75,
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          description: true,
          createdAt: true,
          uploadedBy: { select: { name: true } },
          project: { select: { id: true, name: true } },
          client: { select: { id: true, name: true } },
          paymentRecord: {
            select: {
              id: true,
              amount: true,
              paidDate: true,
              createdAt: true,
            },
          },
        },
      }),
      db.project.findMany({
        where: { organizationId: organization.id },
        orderBy: { name: "asc" },
        take: 75,
        select: { id: true, name: true, client: { select: { name: true } } },
      }),
      db.client.findMany({
        where: { organizationId: organization.id },
        orderBy: { name: "asc" },
        take: 75,
        select: { id: true, name: true },
      }),
      db.proofItem.count({
        where: { organizationId: organization.id, ...activeProofWhere() },
      }),
      db.proofItem.count({
        where: { organizationId: organization.id, status: "MISSING_CONTEXT" },
      }),
    ]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Evidence foundation
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            Proof Vault
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            Attach invoices, approvals, screenshots, work photos, and payment
            evidence to the client and project ledger records they support.
          </p>
        </div>
        <Link
          href="/app/proof-vault/new"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add proof
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <VaultMetric label="Active proof" value={String(activeCount)} />
        <VaultMetric label="Needs context" value={String(missingCount)} />
        <VaultMetric label="Showing" value={String(proofItems.length)} />
      </section>

      <section className="mt-6 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-4 shadow-[var(--app-shadow-soft)]">
        <form action="/app/proof-vault" className="grid gap-3 lg:grid-cols-[repeat(4,1fr)_auto] lg:items-end">
          <FilterSelect
            label="Type"
            name="type"
            value={validType ?? ""}
            options={[
              { value: "", label: "All types" },
              ...proofTypeOptions,
            ]}
          />
          <FilterSelect
            label="Project"
            name="projectId"
            value={projectId ?? ""}
            options={[
              { value: "", label: "All projects" },
              ...projects.map((project) => ({
                value: project.id,
                label: `${project.client.name} - ${project.name}`,
              })),
            ]}
          />
          <FilterSelect
            label="Client"
            name="clientId"
            value={clientId ?? ""}
            options={[
              { value: "", label: "All clients" },
              ...clients.map((client) => ({
                value: client.id,
                label: client.name,
              })),
            ]}
          />
          <FilterSelect
            label="Context"
            name="context"
            value={context}
            options={[
              { value: "active", label: "Active proof" },
              { value: "payment-linked", label: "Linked to payment" },
              { value: "payment-unlinked", label: "Project only" },
              { value: "missing", label: "Missing context" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#2a352d]"
          >
            Filter
          </button>
        </form>
      </section>

      <section className="mt-6">
        {proofItems.length === 0 ? (
          <LedgerEmptyState
            icon={FileArchive}
            title="Proof Vault is ready"
            message="Add invoices, approvals, work photos, screenshots, and payment evidence once your project ledger needs proof attached."
            href="/app/proof-vault/new"
            cta="Add proof"
          />
        ) : (
          <div className="grid gap-4">
            {proofItems.map((proof) => (
              <Link
                key={proof.id}
                href={`/app/proof-vault/${proof.id}`}
                className="grid gap-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)] transition hover:border-[var(--app-border-strong)] hover:shadow-[var(--app-shadow)] lg:grid-cols-[1.2fr_0.85fr_0.8fr_0.8fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
                      {proof.title}
                    </h2>
                    <LedgerBadge>{proofTypeLabel(proof.type)}</LedgerBadge>
                    <LedgerBadge tone={proofStatusTone(proof.status)}>
                      {proofStatusLabel(proof.status)}
                    </LedgerBadge>
                  </div>
                  <p className="mt-2 truncate text-[0.88rem] text-[var(--app-text-muted)]">
                    {proof.description ?? "No description added."}
                  </p>
                </div>
                <Metric label="Client" value={proof.client.name} />
                <Metric label="Project" value={proof.project.name} />
                <Metric
                  label="Payment"
                  value={
                    proof.paymentRecord
                      ? `${formatCurrency(
                          proof.paymentRecord.amount,
                          organization.currency,
                        )} · ${formatDate(
                          proof.paymentRecord.paidDate ??
                            proof.paymentRecord.createdAt,
                        )}`
                      : "Not linked"
                  }
                />
                <div className="hidden justify-self-end text-[var(--app-accent)] lg:block">
                  <ArrowRight aria-hidden="true" className="size-5" />
                </div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--app-text-muted)] lg:col-span-5">
                  Added {formatDate(proof.createdAt)}
                  {proof.uploadedBy?.name ? ` by ${proof.uploadedBy.name}` : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function VaultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
      <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-[var(--app-text)]">{value}</p>
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

function FilterSelect({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="min-h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm font-bold text-[var(--app-text-soft)]"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
