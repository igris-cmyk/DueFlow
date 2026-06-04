import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { OrganizationForm } from "@/components/onboarding/organization-form";
import { getActiveMembership, requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Create your workspace",
  description: "Set up your DueFlow business workspace.",
};

export default async function OnboardingPage() {
  const user = await requireUser();
  const membership = await getActiveMembership(user.id);

  if (membership) {
    redirect("/app/today");
  }

  return (
    <main className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center border-b border-[var(--line)] bg-[var(--paper-strong)] px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-lg lg:mx-0">
          <div className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--ink)] text-sm font-black text-white">
              D
            </span>
            <span className="text-lg font-black tracking-[-0.04em]">DueFlow</span>
          </div>
          <p className="mt-12 text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--green)]">
            Workspace setup
          </p>
          <h1 className="text-balance mt-5 text-4xl font-black leading-[1.08] tracking-[-0.055em] text-[var(--ink)] sm:text-5xl">
            Give every pending payment a business home.
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-[var(--text-muted)]">
            Your workspace keeps client records, projects, proof, balances, and
            follow-ups inside one protected organization boundary.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              {
                icon: Building2,
                text: "This workspace becomes the owner of future DueFlow records.",
              },
              {
                icon: ShieldCheck,
                text: "Access is checked through active organization membership.",
              },
              {
                icon: CheckCircle2,
                text: "You will begin as the workspace OWNER.",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-sm leading-6 text-[#545d57]"
              >
                <item.icon
                  aria-hidden="true"
                  className="mt-0.5 size-4.5 shrink-0 text-[var(--green)]"
                />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-strong)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <p className="text-sm font-extrabold text-[var(--ink)]">
            Hello, {user.name}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[var(--ink)]">
            Create your business workspace
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            You can refine organization settings later. No operational records
            are created during this setup.
          </p>
          <div className="mt-7">
            <OrganizationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
