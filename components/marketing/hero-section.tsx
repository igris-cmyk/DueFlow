import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/dueflow-ui/button-link";
import { CashDeskPreview } from "@/components/product-preview/cash-desk-preview";

export function HeroSection() {
  return (
    <section className="grid-paper overflow-hidden border-b border-[var(--line)]">
      <div className="site-container pb-14 pt-12 sm:pb-18 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow justify-center">
            Cashflow command center for work-based businesses
          </p>
          <h1 className="text-balance mt-5 text-4xl font-black tracking-[-0.06em] text-[var(--ink)] sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.02] xl:text-[4.5rem]">
            Your work is done. Your money should not be lost in WhatsApp.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            DueFlow helps contractors, freelancers, agencies, and service
            businesses track pending payments, proof, client promises, disputes,
            and follow-ups from one premium cashflow command center.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/signup" showArrow>
              Start Free
            </ButtonLink>
            <ButtonLink href="/#product-preview" variant="secondary">
              View Product Preview
            </ButtonLink>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              "No recovery fee",
              "No hidden commission",
              "Every message user-approved",
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
        <div className="relative mx-auto mt-8 max-w-[1080px] sm:mt-12">
          <div className="absolute inset-x-12 -bottom-8 h-24 rounded-full bg-[#597763]/15 blur-3xl" />
          <CashDeskPreview compact className="relative" />
        </div>
      </div>
    </section>
  );
}
