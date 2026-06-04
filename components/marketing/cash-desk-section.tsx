import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { CashDeskPreview } from "@/components/product-preview/cash-desk-preview";
import { cashDeskQuestions } from "@/lib/dueflow-content";

export function CashDeskSection() {
  return (
    <section
      id="product-preview"
      className="section-space border-b border-[var(--line)] bg-[var(--paper-strong)]"
    >
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <SectionHeader
            eyebrow="Today's Cash Desk"
            title="Open the day with the money that needs attention."
            description="DueFlow does not open with a generic dashboard. Today's Cash Desk turns pending balances into a clear action queue, so the right follow-up happens before another promise is forgotten."
          />
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {cashDeskQuestions.map((question) => (
              <li
                key={question}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3.5 py-3 text-sm font-bold text-[#4e5751]"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[var(--green)]"
                />
                {question}
              </li>
            ))}
          </ul>
        </div>
        <CashDeskPreview className="mt-12" />
      </div>
    </section>
  );
}
