import { cn } from "@/lib/utils";

export type MoneyTone =
  | "neutral"
  | "command"
  | "healthy"
  | "attention"
  | "danger";

const toneStyles: Record<MoneyTone, string> = {
  neutral: "border-[var(--line)] bg-[var(--paper-strong)]",
  command: "border-[#303a34] bg-[#1f2823]",
  healthy: "border-[#cfe1d4] bg-[#f6faf7]",
  attention: "border-[#ead8b6] bg-[#fffaf1]",
  danger: "border-[#e8c9c4] bg-[#fff8f6]",
};

const valueStyles: Record<MoneyTone, string> = {
  neutral: "text-[var(--ink)]",
  command: "text-white",
  healthy: "text-[var(--green)]",
  attention: "text-[var(--amber)]",
  danger: "text-[var(--red)]",
};

const labelStyles: Record<MoneyTone, string> = {
  neutral: "text-[var(--text-muted)]",
  command: "text-white/55",
  healthy: "text-[var(--text-muted)]",
  attention: "text-[var(--text-muted)]",
  danger: "text-[var(--text-muted)]",
};

const helperStyles: Record<MoneyTone, string> = {
  neutral: "text-[var(--text-muted)]",
  command: "text-white/45",
  healthy: "text-[var(--text-muted)]",
  attention: "text-[var(--text-muted)]",
  danger: "text-[var(--text-muted)]",
};

type MoneyCardProps = {
  label: string;
  value: string;
  helper: string;
  tone?: MoneyTone;
  compact?: boolean;
  className?: string;
};

export function MoneyCard({
  label,
  value,
  helper,
  tone = "neutral",
  compact = false,
  className,
}: MoneyCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-[var(--shadow-card)]",
        compact ? "p-3.5" : "p-4 sm:p-5",
        toneStyles[tone],
        className,
      )}
    >
      <p
        className={cn(
          "text-[0.68rem] font-extrabold uppercase tracking-[0.11em]",
          labelStyles[tone],
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-extrabold leading-none tracking-[-0.04em] tabular-nums",
          compact ? "text-xl" : "text-2xl sm:text-[1.7rem]",
          valueStyles[tone],
        )}
      >
        {value}
      </p>
      <p className={cn("mt-2 text-xs leading-5", helperStyles[tone])}>
        {helper}
      </p>
    </div>
  );
}
