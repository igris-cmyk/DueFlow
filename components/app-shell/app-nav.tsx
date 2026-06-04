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

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9rem] font-bold leading-5 transition",
              isActive
                ? "bg-[#f5f2e9] text-[var(--app-text)] shadow-[0_4px_14px_rgba(10,18,13,0.13)]"
                : compact
                  ? "text-[var(--app-text-soft)] hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]"
                  : "text-[var(--app-sidebar-muted)] hover:bg-white/[0.07] hover:text-[var(--app-sidebar-text)]",
            )}
          >
            {isActive ? (
              <span className="absolute left-0 h-5 w-1 rounded-r-full bg-[var(--app-accent)]" />
            ) : null}
            <item.icon
              aria-hidden="true"
              className={cn(
                "size-[1.1rem] shrink-0",
                isActive ? "text-[var(--app-accent)]" : "",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
