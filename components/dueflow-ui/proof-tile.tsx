import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ProofTileProps = {
  type: string;
  project: string;
  date: string;
  icon: LucideIcon;
  tone?: "green" | "amber" | "slate" | "red";
  className?: string;
};

const tileTone = {
  green: "bg-[#e5efe8] text-[var(--green)]",
  amber: "bg-[#f7ecd9] text-[var(--amber)]",
  slate: "bg-[#e9edeb] text-[#58635d]",
  red: "bg-[#f5e5e2] text-[var(--red)]",
};

export function ProofTile({
  type,
  project,
  date,
  icon: Icon,
  tone = "slate",
  className,
}: ProofTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-3.5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn("grid size-10 place-items-center rounded-xl", tileTone[tone])}
        >
          <Icon aria-hidden="true" className="size-4.5" />
        </span>
        <CheckCircle2 aria-label="Attached" className="size-4 text-[var(--green)]" />
      </div>
      <p className="mt-4 text-sm font-extrabold text-[var(--ink)]">{type}</p>
      <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{project}</p>
      <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#939a94]">
        {date}
      </p>
    </div>
  );
}
