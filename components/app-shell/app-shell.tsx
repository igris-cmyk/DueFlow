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
  const userInitials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-dvh bg-[var(--app-bg)] text-[var(--app-text)] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh min-h-0 flex-col overflow-hidden bg-[var(--app-sidebar)] px-5 py-6 text-[var(--app-sidebar-text)] lg:flex">
        <Link
          href="/app/today"
          aria-label="DueFlow Today’s Cash Desk"
          className="flex items-center gap-3 px-1"
        >
          <span className="grid size-10 place-items-center rounded-[0.9rem] bg-[#f7f4eb] text-sm font-black text-[var(--app-sidebar)] shadow-sm ring-1 ring-white/20">
            D
          </span>
          <span>
            <span className="block text-base font-black tracking-[-0.035em]">
              DueFlow
            </span>
            <span className="mt-0.5 block text-xs font-medium text-[var(--app-sidebar-muted)]">
              Cashflow command center
            </span>
          </span>
        </Link>

        <div className="mt-8 rounded-[1.15rem] border border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-surface)] p-4 shadow-[0_12px_28px_rgba(10,18,13,0.12)]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.11em] text-[#9fb0a5]">
              Current workspace
            </p>
            <span className="rounded-full border border-[#4d6356] bg-[#314339] px-2 py-0.5 text-[0.66rem] font-extrabold uppercase tracking-[0.07em] text-[#b9d4c2]">
              Early Access
            </span>
          </div>
          <p className="mt-3 truncate text-[0.95rem] font-extrabold text-white">
            {organization.name}
          </p>
          <p className="mt-1 truncate text-[0.8rem] leading-5 text-[var(--app-sidebar-muted)]">
            {businessType}
          </p>
        </div>

        <div className="mt-7 flex min-h-0 flex-1 flex-col">
          <p className="mb-3 shrink-0 px-2 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-[#a9b8af]">
            Workspace
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-4">
            <AppNav />
          </div>
        </div>

        <div className="mt-3 shrink-0 rounded-[1.15rem] border border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-surface)] p-4 [@media(max-height:820px)]:hidden">
          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-[1.1rem] shrink-0 text-[#9ac8aa]"
            />
            <div>
              <p className="text-sm font-extrabold text-white">
                Workspace protected
              </p>
              <p className="mt-1.5 text-[0.8rem] leading-5 text-[var(--app-sidebar-muted)]">
                Ledger records stay inside this organization boundary.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-surface)]/95 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <details className="group relative z-50 lg:hidden">
                <summary
                  aria-label="Open workspace navigation"
                  className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)] [&::-webkit-details-marker]:hidden"
                >
                  <Menu aria-hidden="true" className="size-4.5" />
                </summary>
                <div className="absolute left-0 top-12 z-50 max-h-[min(31rem,calc(100dvh-6rem))] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-3 shadow-[var(--app-shadow)]">
                  <div className="mb-3 border-b border-[var(--app-border)] px-2 pb-3">
                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--app-accent)]">
                      DueFlow workspace
                    </p>
                    <p className="mt-2 truncate text-[0.95rem] font-extrabold text-[var(--app-text)]">
                      {organization.name}
                    </p>
                    <p className="mt-1 truncate text-[0.8rem] text-[var(--app-text-muted)]">
                      {businessType}
                    </p>
                  </div>
                  <AppNav compact />
                </div>
              </details>

              <div className="min-w-0 lg:hidden">
                <p className="truncate text-sm font-extrabold text-[var(--app-text)]">
                  {organization.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-[var(--app-text-muted)]">
                  {businessType}
                </p>
              </div>

              <div className="hidden min-w-0 lg:block">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.11em] text-[var(--app-text-muted)]">
                  Current workspace
                </p>
                <p className="mt-1 truncate text-base font-extrabold text-[var(--app-text)]">
                  {organization.name}
                </p>
                <p className="mt-0.5 truncate text-[0.8rem] text-[var(--app-text-muted)]">
                  {businessType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full border border-[#c5d8ca] bg-[var(--app-accent-soft)] px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-[var(--app-accent)] xl:inline-flex">
                Early Access
              </span>
              <span className="hidden size-9 place-items-center rounded-full border border-[#cbd4cd] bg-[#edf2ed] text-xs font-black text-[var(--app-accent)] md:grid">
                {userInitials}
              </span>
              <div className="hidden max-w-56 text-right md:block">
                <p className="truncate text-sm font-extrabold text-[var(--app-text)]">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-[0.78rem] text-[var(--app-text-muted)]">
                  {role} · {user.email}
                </p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-3.5 text-sm font-bold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100dvh-5rem)] min-w-0 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-11">
          {children}
        </main>
      </div>
    </div>
  );
}
