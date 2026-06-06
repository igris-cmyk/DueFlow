import Link from "next/link";

type LedgerFormShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
};

export function LedgerFormShell({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  children,
}: LedgerFormShellProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            {eyebrow}
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-[0.95rem] leading-7 text-[var(--app-text-muted)]">
            {description}
          </p>
        </div>
        <Link
          href={backHref}
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
        >
          {backLabel}
        </Link>
      </div>

      <section className="mt-8 rounded-[1.5rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow)] sm:p-7">
        {children}
      </section>
    </div>
  );
}
