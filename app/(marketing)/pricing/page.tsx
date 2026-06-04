import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/dueflow-ui/button-link";
import { PricingCard } from "@/components/dueflow-ui/pricing-card";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingFaq } from "@/components/marketing/pricing-faq";
import { pricingPlans, setupFees } from "@/lib/pricing";

export const metadata: Metadata = {
  title: {
    absolute: "DueFlow Pricing — Plans for Freelancers, Contractors, and Teams",
  },
  description:
    "Simple India-first DueFlow pricing for freelancers, contractors, small teams, and service businesses. No recovery fees, no hidden commission.",
  openGraph: {
    title: "DueFlow Pricing — Plans for Freelancers, Contractors, and Teams",
    description:
      "Simple India-first DueFlow pricing for freelancers, contractors, small teams, and service businesses. No recovery fees, no hidden commission.",
  },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Early access pricing"
        title="Clear plans for businesses that want clearer cashflow."
        description="Choose the level of client, project, proof, reporting, and team control that fits your work. DueFlow has no recovery fee and no hidden commission."
        primaryHref="/signup"
        secondaryLabel="Explore Use Cases"
        secondaryHref="/use-cases"
      />

      <section id="plans" className="section-space scroll-mt-20 bg-[var(--paper)]">
        <div className="site-container">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Plans</p>
              <h2 className="text-balance mt-5 text-3xl font-black tracking-[-0.045em] text-[var(--ink)] sm:text-4xl">
                Start small. Add control as the work grows.
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                "No recovery fee",
                "No hidden commission",
                "Cancel anytime",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#69716b]"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-3.5 text-[var(--green)]"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} compact />
            ))}
          </div>
          <p className="mt-6 text-center text-xs leading-5 text-[var(--text-muted)]">
            Early access plans describe the intended DueFlow product experience.
            Features marked web + mobile include the planned mobile companion.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--paper-strong)] py-14 sm:py-16">
        <div className="site-container grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="eyebrow">Optional setup</p>
            <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[var(--ink)] sm:text-3xl">
              Help organizing the starting record.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
              Optional setup is for businesses that want help structuring their
              first clients, projects, and pending payment records. It is never
              required.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {setupFees.map((fee) => (
              <div
                key={fee.name}
                className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--paper)] p-5"
              >
                <p className="text-sm font-extrabold text-[var(--ink)]">
                  {fee.name}
                </p>
                <p className="mt-3 text-2xl font-black tracking-[-0.045em] text-[var(--green)] tabular-nums">
                  {fee.price}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  One-time, optional
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingFaq />

      <section className="grid-paper bg-[var(--paper)] py-20 text-center sm:py-24">
        <div className="site-container">
          <p className="eyebrow justify-center">Start with the record</p>
          <h2 className="text-balance mx-auto mt-6 max-w-3xl text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
            Every rupee should have a status and a next action.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[var(--text-muted)]">
            Join DueFlow early access and build a more professional payment
            follow-up habit.
          </p>
          <ButtonLink href="/signup" showArrow className="mt-8">
            Start Free
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
