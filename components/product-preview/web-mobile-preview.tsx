import {
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  MessageSquareText,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MoneyCard } from "@/components/dueflow-ui/money-card";
import { ProductMockupShell } from "@/components/dueflow-ui/product-mockup-shell";
import {
  StatusBadge,
  type PaymentStatus,
} from "@/components/dueflow-ui/status-badge";
import { cn } from "@/lib/utils";

type WebMobilePreviewProps = {
  className?: string;
};

const projectRows: Array<{
  project: string;
  client: string;
  amount: string;
  status: PaymentStatus;
}> = [
  {
    project: "Shop Renovation",
    client: "Rao Retail",
    amount: "₹55,000",
    status: "Pending",
  },
  {
    project: "Office Electrical",
    client: "Danish Khan",
    amount: "₹12,000",
    status: "Due Soon",
  },
  {
    project: "CCTV Project",
    client: "Khurana Stores",
    amount: "₹31,500",
    status: "Proof Missing",
  },
];

const mobileActions: Array<{
  icon: LucideIcon;
  action: string;
  project: string;
}> = [
  { icon: MessageSquareText, action: "Follow up", project: "Elite Decor" },
  { icon: Camera, action: "Add proof", project: "CCTV Project" },
  { icon: WalletCards, action: "Mark received", project: "Danish Khan" },
];

export function WebMobilePreview({ className }: WebMobilePreviewProps) {
  return (
    <div className={cn("relative pb-8 sm:pb-12 lg:pr-24", className)}>
      <ProductMockupShell
        title="Cash Desk command center"
        subtitle="Web · review balances, proof, and reports"
      >
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
          <MoneyCard
            label="Pending"
            value="₹2,84,000"
            helper="14 active clients"
            tone="command"
            compact
          />
          <MoneyCard
            label="Received this month"
            value="₹1,42,500"
            helper="9 payments"
            tone="healthy"
            compact
          />
          <MoneyCard
            label="Overdue"
            value="₹72,000"
            helper="Needs attention"
            tone="danger"
            compact
            className="col-span-2 lg:col-span-1"
          />
        </div>
        <div className="mt-3.5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)]">
          {projectRows.map(({ project, client, amount, status }, index) => (
            <div
              key={project}
              className={cn(
                "grid grid-cols-[1fr_auto] items-center gap-3 px-3.5 py-3",
                index !== 2 && "border-b border-[var(--line)]",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-[var(--ink)]">
                  {project}
                </p>
                <p className="mt-1 truncate text-[0.65rem] text-[var(--text-muted)]">
                  {client}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs font-black text-[var(--ink)] tabular-nums sm:inline">
                  {amount}
                </span>
                <StatusBadge status={status} />
              </div>
            </div>
          ))}
        </div>
      </ProductMockupShell>

      <div className="relative mx-auto -mt-7 w-[235px] rounded-[2rem] border-[5px] border-[#202622] bg-[#202622] p-1 shadow-[0_24px_60px_rgba(14,18,16,0.28)] sm:absolute sm:-bottom-1 sm:right-0 sm:mt-0">
        <div className="overflow-hidden rounded-[1.55rem] bg-[#f7f5ef]">
          <div className="flex items-center justify-between bg-[#1b211e] px-4 pb-3 pt-4 text-white">
            <div>
              <p className="text-[0.62rem] text-white/45">Thursday, 4 June</p>
              <p className="mt-1 text-xs font-extrabold">
                Today&apos;s actions
              </p>
            </div>
            <span className="grid size-7 place-items-center rounded-full bg-white/10">
              <Bell aria-hidden="true" className="size-3.5" />
            </span>
          </div>
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.09em] text-[var(--green)]">
                  Field action view
                </p>
                <p className="mt-0.5 text-[0.58rem] text-[var(--text-muted)]">
                  Preview experience
                </p>
              </div>
              <span className="rounded-full bg-[var(--green-soft)] px-2 py-1 text-[0.55rem] font-extrabold text-[var(--green)]">
                Planned
              </span>
            </div>
            <div className="rounded-2xl bg-[var(--green)] p-3 text-white">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white/60">
                Pending amount
              </p>
              <p className="mt-1.5 text-xl font-black tracking-[-0.04em] tabular-nums">
                ₹2,84,000
              </p>
              <p className="mt-1 text-[0.62rem] text-white/65">
                5 follow-ups need attention
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {mobileActions.map(({ icon: Icon, action, project }) => (
                <div
                  key={action}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--paper-strong)] p-2.5"
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[var(--green-soft)] text-[var(--green)]">
                    <Icon aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.65rem] font-extrabold text-[var(--ink)]">
                      {action}
                    </span>
                    <span className="block truncate text-[0.58rem] text-[var(--text-muted)]">
                      {project}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-3 text-[#a6ada7]"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.58rem] font-bold text-[var(--green)]">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Mobile companion planned
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
