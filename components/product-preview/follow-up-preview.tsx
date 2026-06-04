import { CheckCircle2, Copy, MessageSquareText, ShieldCheck } from "lucide-react";
import { ProductMockupShell } from "@/components/dueflow-ui/product-mockup-shell";
import { StatusBadge } from "@/components/dueflow-ui/status-badge";
import { followUpTones } from "@/lib/dueflow-content";
import { cn } from "@/lib/utils";

type FollowUpPreviewProps = {
  className?: string;
};

export function FollowUpPreview({ className }: FollowUpPreviewProps) {
  return (
    <ProductMockupShell
      title="Suggested Follow-Up"
      subtitle="Context first. You approve every message."
      className={className}
    >
      <div className="grid gap-3.5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-[var(--ink)]">
                  Elite Decor
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Wedding stage setup
                </p>
              </div>
              <StatusBadge status="Promise Missed" />
            </div>
            <div className="mt-4 rounded-xl bg-[var(--red-soft)] px-3 py-2.5">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.09em] text-[var(--red)]/70">
                Pending balance
              </p>
              <p className="mt-1 text-xl font-black tracking-[-0.04em] text-[var(--red)] tabular-nums">
                ₹28,500
              </p>
            </div>
            <dl className="mt-4 space-y-2.5 border-t border-[var(--line)] pt-4">
              {[
                ["Invoice", "INV-1048"],
                ["Promised date", "2 June"],
                ["Last follow-up", "29 May"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <dt className="text-[var(--text-muted)]">{label}</dt>
                  <dd className="font-extrabold text-[var(--ink)] tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-[#cfe1d4] bg-[#f5faf6] p-3.5">
            <div className="flex gap-2.5">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[var(--green)]"
              />
              <p className="text-xs leading-5 text-[#52605a]">
                DueFlow does not message clients automatically. Every suggestion
                stays under your approval.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <div className="flex items-center gap-2">
            <MessageSquareText
              aria-hidden="true"
              className="size-4 text-[var(--green)]"
            />
            <p className="text-xs font-extrabold text-[var(--ink)]">
              Choose a tone
            </p>
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {followUpTones.map((tone, index) => (
              <span
                key={tone}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1.5 text-[0.65rem] font-extrabold",
                  index === 0
                    ? "border-[var(--green)] bg-[var(--green-soft)] text-[var(--green)]"
                    : "border-[var(--line)] bg-[var(--paper-strong)] text-[var(--text-muted)]",
                )}
              >
                {tone}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-4">
            <p className="mb-2 text-[0.62rem] font-extrabold uppercase tracking-[0.09em] text-[#8b938d]">
              Suggested message
            </p>
            <p className="text-xs leading-6 text-[#46504a]">
              Hi, just following up on the pending balance of ₹28,500 for the
              wedding stage setup. You had mentioned 2 June as the payment date.
              Please let me know if you need the invoice or any project details
              again. Thank you.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold text-[var(--green)]">
              <CheckCircle2 aria-hidden="true" className="size-3.5" />
              Based on recorded payment facts
            </span>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1.5 text-[0.65rem] font-extrabold text-white">
                <Copy aria-hidden="true" className="size-3" />
                Approve &amp; copy
              </span>
              <p className="mt-1.5 text-[0.58rem] font-bold text-[#8c948e]">
                Paste into WhatsApp manually
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProductMockupShell>
  );
}
