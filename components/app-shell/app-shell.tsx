import Link from "next/link";
import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/app/(protected)/app/actions";
import { AppNav } from "@/components/app-shell/app-nav";
import {
  formatBusinessType,
  formatMembershipRole,
} from "@/lib/organizations";

type AppShellProps = {
  user: {
    name: string;
    email: string;
  };
  membership: {
    role: string;
  };
  organization: {
    name: string;
    businessType: string;
  };
  children: React.ReactNode;
};

export function AppShell({
  user,
  membership,
  organization,
  children,
}: AppShellProps) {
  const role = formatMembershipRole(membership.role);
  const businessType = formatBusinessType(organization.businessType);

  return (
    <div className="min-h-screen bg-[#eeece5] lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden min-h-screen flex-col bg-[var(--ink)] px-4 py-5 text-white lg:flex">
        <Link
          href="/app/today"
          aria-label="DueFlow Today’s Cash Desk"
          className="flex items-center gap-3 px-2"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-white text-xs font-black text-[var(--ink)]">
            D
          </span>
          <span className="text-base font-black tracking-[-0.035em]">
            DueFlow
          </span>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="truncate text-sm font-extrabold text-white">
            {organization.name}
          </p>
          <p className="mt-1 truncate text-xs text-[#9eaaa3]">{businessType}</p>
        </div>

        <div className="mt-5 flex-1">
          <AppNav />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#8fc7a4]"
            />
            <div>
              <p className="text-xs font-extrabold text-white">
                Workspace protected
              </p>
              <p className="mt-1 text-xs leading-5 text-[#9eaaa3]">
                Future records stay inside this organization boundary.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#f8f6f0]/92 backdrop-blur-xl">
          <div className="flex min-h-[4.6rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <details className="group relative lg:hidden">
                <summary
                  aria-label="Open workspace navigation"
                  className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-[var(--line)] bg-[var(--paper-strong)] [&::-webkit-details-marker]:hidden"
                >
                  <Menu aria-hidden="true" className="size-4.5" />
                </summary>
                <div className="absolute left-0 top-12 w-72 rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-3 shadow-[var(--shadow-soft)]">
                  <div className="mb-3 border-b border-[var(--line)] px-2 pb-3">
                    <p className="truncate text-sm font-extrabold text-[var(--ink)]">
                      {organization.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                      {businessType}
                    </p>
                  </div>
                  <AppNav compact />
                </div>
              </details>

              <Link
                href="/app/today"
                className="inline-flex items-center gap-2 lg:hidden"
              >
                <span className="grid size-8 place-items-center rounded-xl bg-[var(--ink)] text-[0.65rem] font-black text-white">
                  D
                </span>
                <span className="hidden text-sm font-black tracking-[-0.03em] sm:block">
                  DueFlow
                </span>
              </Link>

              <div className="hidden min-w-0 lg:block">
                <p className="truncate text-sm font-extrabold text-[var(--ink)]">
                  {organization.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                  {businessType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full border border-[#bed8c6] bg-[var(--green-soft)] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-[var(--green)] sm:inline-flex">
                Early Access
              </span>
              <div className="hidden max-w-52 text-right md:block">
                <p className="truncate text-xs font-extrabold text-[var(--ink)]">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-[0.68rem] text-[var(--text-muted)]">
                  {role} · {user.email}
                </p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper-strong)] px-3 text-xs font-extrabold text-[#4d5650] shadow-sm transition hover:border-[#c9c5ba] hover:text-[var(--ink)]"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
