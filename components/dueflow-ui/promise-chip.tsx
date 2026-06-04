import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

type PromiseChipProps = {
  label: string;
  missed?: boolean;
  className?: string;
};

export function PromiseChip({
  label,
  missed = false,
  className,
}: PromiseChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold",
        missed
          ? "bg-[var(--red-soft)] text-[var(--red)]"
          : "bg-[var(--amber-soft)] text-[var(--amber)]",
        className,
      )}
    >
      <CalendarClock aria-hidden="true" className="size-3" />
      {label}
    </span>
  );
}
