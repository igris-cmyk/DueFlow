import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { pricingFaqs } from "@/lib/pricing";

export function PricingFaq() {
  return (
    <section className="section-space border-t border-[var(--line)] bg-[var(--paper-strong)]">
      <div className="site-container grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
        <SectionHeader
          eyebrow="Pricing FAQ"
          title="Straight answers before you start."
          description="DueFlow pricing is designed to be clear about what the product does, what it does not do, and how early access works."
        />
        <div className="overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[var(--paper)]">
          {pricingFaqs.map((item) => (
            <details
              key={item.question}
              className="group border-b border-[var(--line)] last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-extrabold text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[var(--green)] transition group-open:rotate-45"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-7 text-[var(--text-muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
