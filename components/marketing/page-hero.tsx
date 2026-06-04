import { ButtonLink } from "@/components/dueflow-ui/button-link";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryLabel = "Start Free",
  primaryHref = "/pricing#plans",
  secondaryLabel,
  secondaryHref,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "grid-paper border-b border-[var(--line)] py-14 sm:py-18 lg:py-20",
        className,
      )}
    >
      <div className="site-container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow justify-center">{eyebrow}</p>
          <h1 className="text-balance mt-5 text-4xl font-black tracking-[-0.055em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
            {description}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={primaryHref} showArrow>
              {primaryLabel}
            </ButtonLink>
            {secondaryLabel && secondaryHref ? (
              <ButtonLink href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
