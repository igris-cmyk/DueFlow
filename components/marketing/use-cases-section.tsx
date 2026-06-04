import { ButtonLink } from "@/components/dueflow-ui/button-link";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { UseCaseCard } from "@/components/dueflow-ui/use-case-card";
import { useCases } from "@/lib/use-cases";

export function UseCasesSection() {
  return (
    <section className="section-space border-y border-[var(--line)] bg-[var(--paper-strong)]">
      <div className="site-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Use cases"
            title="Built for businesses where finished work does not always mean finished payment."
            description="Different businesses lose track of money in different ways. DueFlow keeps the payment story clear without forcing every team into the same workflow."
          />
          <ButtonLink
            href="/use-cases"
            variant="secondary"
            showArrow
            className="shrink-0"
          >
            Explore use cases
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.slug} useCase={useCase} />
          ))}
        </div>
      </div>
    </section>
  );
}
