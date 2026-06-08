import Link from "next/link";
import { FileArchive, Plus } from "lucide-react";
import { LedgerBadge } from "@/components/app/ledger-badge";
import {
  proofStatusLabel,
  proofStatusTone,
  proofTypeLabel,
} from "@/lib/proof";

type ProofSectionProps = {
  title: string;
  emptyTitle: string;
  emptyMessage: string;
  addHref: string;
  addLabel: string;
  proofs: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    description: string | null;
    createdAt: Date;
  }>;
};

export function ProofSection({
  title,
  emptyTitle,
  emptyMessage,
  addHref,
  addLabel,
  proofs,
}: ProofSectionProps) {
  const hasProof = proofs.length > 0;

  return (
    <section className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
              {title}
            </h2>
            <LedgerBadge tone={hasProof ? "green" : "amber"}>
              {hasProof ? `${proofs.length} attached` : "Proof missing"}
            </LedgerBadge>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
            {hasProof ? "Work completed. Proof attached." : emptyMessage}
          </p>
        </div>
        <Link
          href={addHref}
          className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
        >
          <Plus aria-hidden="true" className="size-4" />
          {addLabel}
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {hasProof ? (
          proofs.map((proof) => (
            <Link
              key={proof.id}
              href={`/app/proof-vault/${proof.id}`}
              className="block rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 transition hover:border-[var(--app-border-strong)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="min-w-0 truncate font-black text-[var(--app-text)]">
                  {proof.title}
                </p>
                <LedgerBadge>{proofTypeLabel(proof.type)}</LedgerBadge>
                <LedgerBadge tone={proofStatusTone(proof.status)}>
                  {proofStatusLabel(proof.status)}
                </LedgerBadge>
              </div>
              <p className="mt-2 break-words text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
                {proof.description ?? "Evidence linked to this ledger record."}
              </p>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dacdb9] bg-[var(--app-surface-muted)] p-5">
            <FileArchive
              aria-hidden="true"
              className="size-5 text-[var(--app-accent)]"
            />
            <p className="mt-3 font-black text-[var(--app-text)]">
              {emptyTitle}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
