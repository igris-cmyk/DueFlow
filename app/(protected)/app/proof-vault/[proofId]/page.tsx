import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { archiveProofAction } from "@/app/(protected)/app/proof-vault/actions";
import { LedgerBadge } from "@/components/app/ledger-badge";
import { DestructiveSubmitButton } from "@/components/forms/destructive-submit-button";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/ledger";
import {
  proofStatusLabel,
  proofStatusTone,
  proofTypeLabel,
  safeExternalHref,
} from "@/lib/proof";

type ProofDetailPageProps = {
  params: Promise<{ proofId: string }>;
};

export async function generateMetadata({
  params,
}: ProofDetailPageProps): Promise<Metadata> {
  const { proofId } = await params;
  const context = await requireOrganization();
  const proof = await getDb().proofItem.findFirst({
    where: { id: proofId, organizationId: context.organization.id },
    select: { title: true },
  });

  return { title: proof?.title ?? "Proof" };
}

export default async function ProofDetailPage({
  params,
}: ProofDetailPageProps) {
  const { proofId } = await params;
  const { organization } = await requireOrganization();
  const proof = await getDb().proofItem.findFirst({
    where: { id: proofId, organizationId: organization.id },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      description: true,
      sourceUrl: true,
      fileName: true,
      fileUrl: true,
      archivedAt: true,
      createdAt: true,
      updatedAt: true,
      uploadedBy: { select: { name: true } },
      client: { select: { id: true, name: true, phone: true, email: true } },
      project: { select: { id: true, name: true } },
      paymentRecord: {
        select: {
          id: true,
          amount: true,
          paidDate: true,
          createdAt: true,
          method: true,
          referenceNumber: true,
        },
      },
    },
  });

  if (!proof) {
    notFound();
  }

  const sourceHref = safeExternalHref(proof.sourceUrl);
  const fileHref = safeExternalHref(proof.fileUrl);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <Link
            href="/app/proof-vault"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--app-accent)]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Proof Vault
          </Link>
          <p className="mt-5 text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Evidence linked
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {proof.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <LedgerBadge>{proofTypeLabel(proof.type)}</LedgerBadge>
            <LedgerBadge tone={proofStatusTone(proof.status)}>
              {proofStatusLabel(proof.status)}
            </LedgerBadge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/app/proof-vault/${proof.id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit proof
          </Link>
          {proof.status !== "ARCHIVED" ? (
            <form action={archiveProofAction}>
              <input type="hidden" name="proofId" value={proof.id} />
              <DestructiveSubmitButton pendingLabel="Archiving...">
                <span className="inline-flex items-center gap-2">
                  <Archive aria-hidden="true" className="size-4" />
                  Archive
                </span>
              </DestructiveSubmitButton>
            </form>
          ) : null}
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Ledger context
          </h2>
          <div className="mt-4 space-y-3">
            <ContextLink
              label="Client"
              value={proof.client.name}
              href={`/app/clients/${proof.client.id}`}
            />
            <ContextLink
              label="Project"
              value={proof.project.name}
              href={`/app/projects/${proof.project.id}`}
            />
            {proof.paymentRecord ? (
              <ContextLink
                label="Payment"
                value={`${formatCurrency(
                  proof.paymentRecord.amount,
                  organization.currency,
                )} · ${formatDate(
                  proof.paymentRecord.paidDate ??
                    proof.paymentRecord.createdAt,
                )}`}
                href={`/app/payments/${proof.paymentRecord.id}`}
              />
            ) : (
              <ContextBox label="Payment" value="Not linked" />
            )}
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
          <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            Proof record
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Detail label="Created" value={formatDate(proof.createdAt)} />
            <Detail label="Updated" value={formatDate(proof.updatedAt)} />
            <Detail
              label="Created by"
              value={proof.uploadedBy?.name ?? "Not recorded"}
            />
            <Detail
              label="Archived at"
              value={formatDate(proof.archivedAt)}
            />
            <Detail
              label="Reference file"
              value={proof.fileName ?? "Not added"}
            />
            <Detail
              label="Payment method"
              value={proof.paymentRecord?.method ?? "Not linked"}
            />
          </dl>
          <div className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
              Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[var(--app-text-soft)]">
              {proof.description ?? "No description added."}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {sourceHref ? (
              <ReferenceLink href={sourceHref}>Open source</ReferenceLink>
            ) : null}
            {fileHref ? (
              <ReferenceLink href={fileHref}>Open reference file</ReferenceLink>
            ) : null}
          </div>
        </div>
      </section>
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

function ReferenceLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
    >
      {children}
      <ExternalLink aria-hidden="true" className="size-4" />
    </a>
  );
}
