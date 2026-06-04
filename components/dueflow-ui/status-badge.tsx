import { cn } from "@/lib/utils";

export type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Due Soon"
  | "Overdue"
  | "Promise Missed"
  | "Proof Missing"
  | "Disputed";

const statusStyles: Record<PaymentStatus, string> = {
  Paid: "bg-[var(--green-soft)] text-[var(--green)]",
  Pending: "bg-[var(--slate-soft)] text-[#53605a]",
  "Due Soon": "bg-[var(--amber-soft)] text-[var(--amber)]",
  Overdue: "bg-[var(--red-soft)] text-[var(--red)]",
  "Promise Missed": "bg-[var(--red-soft)] text-[var(--red)]",
  "Proof Missing": "bg-[var(--amber-soft)] text-[var(--amber)]",
  Disputed: "bg-[#eee9f5] text-[#675080]",
};

type StatusBadgeProps = {
  status: PaymentStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold tracking-[0.02em]",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
