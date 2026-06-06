import { cn } from "@/lib/utils";

type LedgerBadgeProps = {
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "slate";
};

const toneClassNames = {
  green:
    "border-[#bcd6c4] bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
  amber: "border-[#ead7b3] bg-[var(--amber-soft)] text-[var(--amber)]",
  red: "border-[#edc7c1] bg-[var(--red-soft)] text-[var(--red)]",
  slate:
    "border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--app-text-muted)]",
};

export function LedgerBadge({ children, tone = "slate" }: LedgerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.08em]",
        toneClassNames[tone],
      )}
    >
      {children}
    </span>
  );
}
