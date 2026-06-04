import Link from "next/link";
import { CheckCircle2, Landmark, ShieldCheck } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const foundationPoints = [
  "One workspace for balances, proof, promises, and next actions.",
  "Built for work-based businesses, not generic CRM busywork.",
  "Tenant boundaries and audit history from the first record.",
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-[var(--paper)] lg:grid lg:h-dvh lg:min-h-0 lg:grid-cols-[0.92fr_1.08fr] lg:overflow-hidden">
      <section className="relative hidden h-dvh min-h-0 overflow-hidden border-r border-[var(--app-sidebar-border)] bg-[var(--app-sidebar)] px-10 py-8 text-white lg:flex lg:flex-col lg:justify-between xl:px-14">
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[0.9rem] bg-[#f7f4eb] text-sm font-black text-[var(--app-sidebar)] shadow-sm ring-1 ring-white/20">
              D
            </span>
            <span className="text-lg font-black tracking-[-0.04em]">DueFlow</span>
          </Link>
        </div>

        <div className="relative max-w-lg">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.15em] text-[#a8ceb5]">
            Cashflow command center
          </p>
          <h2 className="text-balance mt-4 text-3xl font-black leading-[1.08] tracking-[-0.055em] xl:text-[2.65rem]">
            Your work is done. Your money should not be lost in WhatsApp.
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-7 text-[#c5cec8]">
            Build a professional record for every pending payment, from the
            reason it is stuck to the next action due.
          </p>
          <div className="mt-7 space-y-3">
            {foundationPoints.map((point) => (
              <div
                key={point}
                className="flex gap-3 border-t border-white/10 pt-3 text-[0.88rem] leading-6 text-[#d9e0db]"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4.5 shrink-0 text-[#8fc7a4]"
                />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4 text-[0.75rem] font-bold text-[#aebbb2]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-4" />
            Secure account foundation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Landmark aria-hidden="true" className="size-4" />
            Every rupee has a status
          </span>
        </div>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8 lg:h-dvh lg:min-h-0 lg:overflow-y-auto lg:py-6">
        <div className="w-full max-w-lg">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2.5 lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--app-sidebar)] text-xs font-black text-white">
              D
            </span>
            <span className="text-base font-black tracking-[-0.035em]">
              DueFlow
            </span>
          </Link>
          <div className="rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow)] sm:p-7 lg:p-8">
            <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
              {eyebrow}
            </p>
            <h1 className="text-balance mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-[2.15rem]">
              {title}
            </h1>
            <p className="mt-3 text-[0.92rem] leading-7 text-[var(--text-muted)]">
              {description}
            </p>
            <div className="mt-6">{children}</div>
            <div className="mt-5 text-center text-sm text-[var(--text-muted)]">
              {footer}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
