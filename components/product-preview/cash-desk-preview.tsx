import {
  CircleAlert,
  FileWarning,
  MessageSquareText,
  Phone,
  ReceiptText,
} from "lucide-react";
import { ActionCard } from "@/components/dueflow-ui/action-card";
import { MoneyCard } from "@/components/dueflow-ui/money-card";
import { ProductMockupShell } from "@/components/dueflow-ui/product-mockup-shell";
import { PromiseChip } from "@/components/dueflow-ui/promise-chip";
import { StatusBadge, type PaymentStatus } from "@/components/dueflow-ui/status-badge";
import { cn } from "@/lib/utils";

type CashDeskPreviewProps = {
  className?: string;
  compact?: boolean;
};

const paymentRows: Array<{
  client: string;
  project: string;
  amount: string;
  status: PaymentStatus;
  promise?: string;
  missed?: boolean;
}> = [
  {
    client: "Danish Khan",
    project: "Office electrical work",
    amount: "₹12,000",
    status: "Due Soon",
    promise: "Due today",
  },
  {
    client: "Elite Decor",
    project: "Wedding stage setup",
    amount: "₹28,500",
    status: "Promise Missed",
    promise: "Promised 2 Jun",
    missed: true,
  },
  {
    client: "Rao Retail",
    project: "CCTV installation",
    amount: "₹31,500",
    status: "Proof Missing",
  },
];

export function CashDeskPreview({
  className,
  compact = false,
}: CashDeskPreviewProps) {
  return (
    <ProductMockupShell className={className}>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <MoneyCard
          label="Total pending"
          value="₹2,84,000"
          helper="Across 14 active clients"
          tone="command"
          compact
        />
        <MoneyCard
          label="Overdue"
          value="₹72,000"
          helper="Needs attention"
          tone="danger"
          compact
        />
        <MoneyCard
          label="Due this week"
          value="₹48,500"
          helper="4 payments expected"
          tone="attention"
          compact
        />
        <MoneyCard
          label="Follow-ups today"
          value="5"
          helper="Due before end of day"
          tone="healthy"
          compact
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-white/55 px-3 py-2.5">
        <span className="mr-1 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#8a928c]">
          Cash desk signals
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-[0.65rem] font-extrabold text-[var(--green)]">
          <Phone aria-hidden="true" className="size-3" />
          5 follow-ups today
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--red-soft)] px-2.5 py-1 text-[0.65rem] font-extrabold text-[var(--red)]">
          <CircleAlert aria-hidden="true" className="size-3" />
          2 promises missed
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--amber-soft)] px-2.5 py-1 text-[0.65rem] font-extrabold text-[var(--amber)]">
          <FileWarning aria-hidden="true" className="size-3" />
          3 proof gaps
        </span>
      </div>

      <div
        className={cn(
          "mt-3.5 grid gap-3.5",
          compact ? "xl:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-[0.9fr_1.1fr]",
        )}
      >
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-[var(--ink)]">
                Action queue
              </p>
              <p className="mt-0.5 text-[0.65rem] text-[var(--text-muted)]">
                What needs your attention today
              </p>
            </div>
            <span className="rounded-full bg-[var(--red-soft)] px-2 py-1 text-[0.62rem] font-extrabold text-[var(--red)]">
              5 due
            </span>
          </div>
          <div className="space-y-2">
            <ActionCard
              icon={Phone}
              title="Call Danish"
              detail="₹12,000 due today"
              tone="attention"
            />
            <ActionCard
              icon={MessageSquareText}
              title="Send reminder to Elite Decor"
              detail="Promise missed"
              tone="danger"
            />
            <ActionCard
              icon={FileWarning}
              title="Review proof gap"
              detail="CCTV Project"
              tone="attention"
            />
            {!compact ? (
              <ActionCard
                icon={ReceiptText}
                title="Upload invoice"
                detail="Shop Renovation"
              />
            ) : null}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-[var(--line)] bg-white/70 p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-[var(--ink)]">
                Pending payment ledger
              </p>
              <p className="mt-0.5 text-[0.65rem] text-[var(--text-muted)]">
                Client, project, promise, and status together
              </p>
            </div>
            <span className="text-[0.65rem] font-extrabold text-[var(--green)]">
              View all
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-strong)]">
            {paymentRows.map((row, index) => (
              <div
                key={row.client}
                className={cn(
                  "grid grid-cols-[1fr_auto] gap-3 px-3 py-3",
                  index !== paymentRows.length - 1 &&
                    "border-b border-[var(--line)]",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-extrabold text-[var(--ink)]">
                    {row.client}
                  </p>
                  <p className="mt-1 truncate text-[0.65rem] text-[var(--text-muted)]">
                    {row.project}
                  </p>
                  {row.promise ? (
                    <PromiseChip
                      label={row.promise}
                      missed={row.missed}
                      className="mt-2"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs font-black text-[var(--ink)] tabular-nums">
                    {row.amount}
                  </p>
                  <StatusBadge status={row.status} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProductMockupShell>
  );
}
