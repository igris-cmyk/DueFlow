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
    <nav aria-label="Workspace navigation" className="space-y-1">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
              isActive
                ? "bg-white text-[var(--ink)] shadow-sm"
                : compact
                  ? "text-[#4e5852] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]"
                  : "text-[#aeb9b2] hover:bg-white/8 hover:text-white",
            )}
          >
            <item.icon
              aria-hidden="true"
              className={cn(
                "size-4.5 shrink-0",
                isActive ? "text-[var(--green)]" : "",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
