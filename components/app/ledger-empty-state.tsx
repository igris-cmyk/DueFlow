import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type LedgerEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message: string;
  href: string;
  cta: string;
};

export function LedgerEmptyState({
  icon: Icon,
  title,
  message,
  href,
  cta,
}: LedgerEmptyStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-6 text-center shadow-[var(--app-shadow-soft)] sm:p-8">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#c7d6cb] bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-black tracking-[-0.035em] text-[var(--app-text)]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[0.92rem] leading-7 text-[var(--app-text-muted)]">
        {message}
      </p>
      <Link
        href={href}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
      >
        {cta}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
