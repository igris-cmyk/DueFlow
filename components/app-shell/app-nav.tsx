"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  FileArchive,
  FolderKanban,
  HandCoins,
  ListTodo,
  Settings2,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Today’s Cash Desk",
    href: "/app/today",
    icon: CalendarCheck2,
  },
  {
    label: "Clients",
    href: "/app/clients",
    icon: UsersRound,
  },
  {
    label: "Projects",
    href: "/app/projects",
    icon: FolderKanban,
  },
  {
    label: "Payments",
    href: "/app/payments",
    icon: HandCoins,
  },
  {
    label: "Follow-Ups",
    href: "/app/follow-ups",
    icon: ListTodo,
  },
  {
    label: "Proof Vault",
    href: "/app/proof-vault",
    icon: FileArchive,
  },
  {
    label: "Reports",
    href: "/app/reports",
    icon: TrendingUp,
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: Settings2,
  },
];

type AppNavProps = {
  compact?: boolean;
};

export function AppNav({ compact = false }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace navigation" className="space-y-1.5">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9rem] font-bold leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] focus-visible:ring-offset-2",
              compact
                ? "focus-visible:ring-offset-[var(--app-surface-strong)]"
                : "focus-visible:ring-offset-[var(--app-sidebar)]",
              compact
                ? isActive
                  ? "border border-[#bdd2c3] bg-[var(--app-accent-soft)] text-[var(--app-text)] shadow-[0_4px_14px_rgba(42,47,43,0.08)]"
                  : "border border-transparent text-[var(--app-text-soft)] hover:border-[var(--app-border)] hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]"
                : isActive
                  ? "border border-[#e0daca] bg-[#f5f2e9] text-[var(--app-text)] shadow-[0_4px_14px_rgba(10,18,13,0.13)]"
                  : "border border-transparent text-[#d4ddd7] hover:border-[#4a5a50] hover:bg-[#334139] hover:text-white",
            )}
          >
            {isActive ? (
              <span className="absolute left-0 h-5 w-1 rounded-r-full bg-[var(--app-accent)]" />
            ) : null}
            <Icon
              aria-hidden="true"
              className={cn(
                "size-[1.1rem] shrink-0 transition-colors",
                compact
                  ? isActive
                    ? "text-[var(--app-accent)]"
                    : "text-[var(--app-text-muted)] group-hover:text-[var(--app-accent)]"
                  : isActive
                    ? "text-[var(--app-accent)]"
                    : "text-[#adc0b5] group-hover:text-[#d8eadf]",
              )}
            />
            <span className="min-w-0 truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
