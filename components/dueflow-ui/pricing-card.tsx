import { Check } from "lucide-react";
import type { PricingPlan } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./button-link";

type PricingCardProps = {
  plan: PricingPlan;
  compact?: boolean;
  className?: string;
};

export function PricingCard({
  plan,
  compact = false,
  className,
}: PricingCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[1.6rem] border bg-[var(--paper-strong)] shadow-[var(--shadow-card)]",
        plan.featured
          ? "border-[var(--green)] bg-[#fbfdfb] shadow-[0_18px_45px_rgba(36,104,72,0.13)] ring-1 ring-[var(--green)]"
          : "border-[var(--line)]",
        compact ? "p-5" : "p-6",
        className,
      )}
    >
      {plan.featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-[var(--green)] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white">
          Recommended
        </span>
      ) : null}
      <div>
        <p className="text-sm font-extrabold text-[var(--green)]">{plan.name}</p>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-3xl font-black tracking-[-0.05em] text-[var(--ink)] tabular-nums">
            {plan.monthly}
          </span>
          <span className="pb-1 text-xs font-semibold text-[var(--text-muted)]">
            /month
          </span>
        </div>
        <p className="mt-2 min-h-5 text-xs text-[var(--text-muted)]">
          {plan.yearly ? (
            <>
              or{" "}
              <span className="font-extrabold text-[#4f5952]">
                {plan.yearly}
              </span>
            </>
          ) : (
            <span className="font-extrabold text-[#4f5952]">Always free</span>
          )}
        </p>
        <p className="mt-5 text-sm font-extrabold text-[var(--ink)]">
          {plan.audience}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {plan.description}
        </p>
      </div>
      <div className="my-5 h-px bg-[var(--line)]" />
      <ul className="flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2.5 text-sm leading-5 text-[#4d554f]"
          >
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--green)]"
            />
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink
        href="/signup"
        variant={plan.featured ? "primary" : "secondary"}
        className="mt-6 w-full"
      >
        Start Free
      </ButtonLink>
    </article>
  );
}
