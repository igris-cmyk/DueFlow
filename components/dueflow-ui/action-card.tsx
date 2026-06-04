import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionTone = "neutral" | "attention" | "danger";

const toneStyles: Record<ActionTone, string> = {
  neutral: "bg-[var(--slate-soft)] text-[#52605a]",
  attention: "bg-[var(--amber-soft)] text-[var(--amber)]",
  danger: "bg-[var(--red-soft)] text-[var(--red)]",
};

type ActionCardProps = {
  icon: LucideIcon;
  title: string;
  detail: string;
  tone?: ActionTone;
  className?: string;
};

export function ActionCard({
  icon: Icon,
  title,
  detail,
  tone = "neutral",
  className,
}: ActionCardProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-3.5 transition hover:border-[#c5c9c3] hover:bg-white",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl",
          toneStyles[tone],
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[var(--ink)]">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-[var(--text-muted)]">
          {detail}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-[#a5aaa5] transition group-hover:text-[var(--ink)]"
      />
    </div>
  );
}
