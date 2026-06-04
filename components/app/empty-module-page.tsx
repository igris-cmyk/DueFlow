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
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--green)]">
          {eyebrow}
        </p>
        <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base sm:leading-8">
          {message}
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-strong)] shadow-[var(--shadow-card)]">
        <div className="grid min-h-[25rem] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-center justify-center border-b border-[var(--line)] bg-[#f1f4ef] p-8 lg:border-b-0 lg:border-r">
            <div className="max-w-sm text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-[#c9d9cd] bg-white text-[var(--green)] shadow-sm">
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <p className="mt-6 text-lg font-black tracking-[-0.035em] text-[var(--ink)]">
                No records yet
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                This module is ready for its tenant-safe workflow in Phase 3.
                Nothing has been invented to fill the space.
              </p>
            </div>
          </div>

          <div className="flex items-center p-6 sm:p-8 lg:p-10">
            <div className="w-full">
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#7a837d]">
                What this area will connect
              </p>
              <div className="mt-5 space-y-3">
                {futurePoints.map((point) => (
                  <div
                    key={point}
                    className="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4.5 shrink-0 text-[var(--green)]"
                    />
                    <p className="text-sm leading-6 text-[#505a53]">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.11em] text-[var(--green)]">
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
