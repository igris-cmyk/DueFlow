import { ButtonLink } from "@/components/dueflow-ui/button-link";

export function FinalCta() {
  return (
    <section className="grid-paper bg-[var(--paper-strong)] py-20 sm:py-24">
      <div className="site-container">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--line)] bg-[var(--paper-strong)] px-5 py-12 text-center shadow-[var(--shadow-soft)] sm:px-10 sm:py-16">
          <p className="eyebrow justify-center">A better next action</p>
          <h2 className="text-balance mt-6 text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
            Every pending payment should have a client, a project, proof, a reason, and a next action.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
            DueFlow is opening early access for work-based businesses that want
            a calmer, clearer way to control pending money.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/pricing#plans" showArrow>
              Start Free
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              View Pricing
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
