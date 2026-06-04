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
    <main className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-[var(--line-dark)] bg-[var(--ink)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-white text-sm font-black text-[var(--ink)]">
              D
            </span>
            <span className="text-lg font-black tracking-[-0.04em]">DueFlow</span>
          </Link>
        </div>

        <div className="relative max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9fc2ae]">
            Cashflow command center
          </p>
          <h2 className="text-balance mt-5 text-4xl font-black leading-[1.08] tracking-[-0.055em] xl:text-5xl">
            Your work is done. Your money should not be lost in WhatsApp.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#b9c3bd]">
            Build a professional record for every pending payment, from the
            reason it is stuck to the next action due.
          </p>
          <div className="mt-10 space-y-4">
            {foundationPoints.map((point) => (
              <div
                key={point}
                className="flex gap-3 border-t border-white/10 pt-4 text-sm leading-6 text-[#d4dbd6]"
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

        <div className="relative flex items-center gap-4 text-xs font-bold text-[#9ba8a0]">
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

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2.5 lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--ink)] text-xs font-black text-white">
              D
            </span>
            <span className="text-base font-black tracking-[-0.035em]">
              DueFlow
            </span>
          </Link>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--green)]">
            {eyebrow}
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
            {description}
          </p>
          <div className="mt-8">{children}</div>
          <div className="mt-7 text-center text-sm text-[var(--text-muted)]">
            {footer}
          </div>
        </div>
      </section>
    </main>
  );
}
