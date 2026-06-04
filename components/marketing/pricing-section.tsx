import { ButtonLink } from "@/components/dueflow-ui/button-link";
import { PricingCard } from "@/components/dueflow-ui/pricing-card";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { pricingPlans } from "@/lib/pricing";

export function PricingSection() {
  return (
    <section className="section-space bg-[var(--paper)]">
      <div className="site-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Early access pricing"
            title="Simple plans for clearer cashflow."
            description="Start small, then add deeper proof, reporting, and team control as the business grows. No recovery fee. No hidden commission."
          />
          <ButtonLink
            href="/pricing"
            variant="secondary"
            showArrow
            className="shrink-0"
          >
            Compare plans
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
