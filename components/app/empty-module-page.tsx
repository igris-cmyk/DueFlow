import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type EmptyModulePageProps = {
  eyebrow: string;
  title: string;
  message: string;
  icon: LucideIcon;
  futurePoints: string[];
};

export function EmptyModulePage({
  eyebrow,
  title,
  message,
  icon: Icon,
  futurePoints,
}: EmptyModulePageProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
          {eyebrow}
        </p>
        <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)] sm:text-base sm:leading-8">
          {message}
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] shadow-[var(--app-shadow)]">
        <div className="grid min-h-[24rem] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center justify-center border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] p-8 lg:border-b-0 lg:border-r">
            <div className="max-w-sm text-center">
              <span className="mx-auto inline-flex rounded-full border border-[#cbd9cf] bg-[var(--app-accent-soft)] px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-accent)]">
                Workspace ready
              </span>
              <span className="mx-auto mt-5 grid size-16 place-items-center rounded-2xl border border-[#c7d6cb] bg-[var(--app-surface-strong)] text-[var(--app-accent)] shadow-sm">
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <p className="mt-6 text-xl font-black tracking-[-0.035em] text-[var(--app-text)]">
                No records yet
              </p>
              <p className="mt-3 text-[0.9rem] leading-7 text-[var(--app-text-muted)]">
                Real records will appear here when the tenant-safe core ledger
                becomes active in Phase 3.
              </p>
            </div>
          </div>

          <div className="flex items-center p-6 sm:p-8 lg:p-10">
            <div className="w-full">
              <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                What this area will connect
              </p>
              <div className="mt-5 space-y-3">
                {futurePoints.map((point) => (
                  <div
                    key={point}
                    className="flex gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--app-shadow-soft)]"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4.5 shrink-0 text-[var(--app-accent)]"
                    />
                    <p className="text-[0.9rem] leading-6 text-[var(--app-text-soft)]">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-[0.75rem] font-extrabold uppercase tracking-[0.1em] text-[var(--app-accent)]">
                Coming in Phase 3
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
