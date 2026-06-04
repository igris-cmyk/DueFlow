import { ArrowRight, CheckCircle2, Smartphone } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { useCases } from "@/lib/use-cases";

export function UseCaseOverviewList() {
  return (
    <section className="section-space bg-[var(--paper)]">
      <div className="site-container">
        <SectionHeader
          eyebrow="Different work, same money problem"
          title="See what gets stuck, what DueFlow tracks, and how the next action becomes clear."
          description="Each workflow is designed around the records a real work-based business already has: clients, projects, partial payments, proof, promises, and follow-ups."
        />
        <div className="mt-12 space-y-5">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <article
                key={useCase.slug}
                id={useCase.slug}
                className="scroll-mt-24 rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)] sm:p-6"
              >
                <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <div>
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.11em] text-[#a5aba6]">
                          Use case 0{index + 1}
                        </p>
                        <h2 className="mt-1 text-xl font-black tracking-[-0.035em] text-[var(--ink)]">
                          {useCase.name}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">
                      {useCase.pain}
                    </p>
                    <div className="mt-5 rounded-2xl border border-[#cfe1d4] bg-[#f5faf6] p-4">
                      <div className="flex gap-2.5">
                        <Smartphone
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-[var(--green)]"
                        />
                        <p className="text-xs leading-5 text-[#56625a]">
                          {useCase.mobileValue}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/use-cases/${useCase.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--green)]"
                    >
                      Explore the {useCase.name.toLowerCase()} workflow
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <UseCaseList
                      title="What gets stuck"
                      items={useCase.stuck}
                      tone="attention"
                    />
                    <UseCaseList
                      title="What DueFlow tracks"
                      items={useCase.tracks}
                      tone="healthy"
                    />
                    <div className="sm:col-span-2">
                      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#818983]">
                        Example workflow
                      </p>
                      <ol className="mt-3 flex flex-wrap gap-2">
                        {useCase.workflow.map((step, stepIndex) => (
                          <li
                            key={step}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-bold text-[#5e6861]"
                          >
                            <span className="text-[0.62rem] font-black text-[var(--green)]">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type UseCaseListProps = {
  title: string;
  items: string[];
  tone: "attention" | "healthy";
};

function UseCaseList({ title, items, tone }: UseCaseListProps) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#818983]">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-5 text-[#58625b]"
          >
            <CheckCircle2
              aria-hidden="true"
              className={
                tone === "healthy"
                  ? "mt-0.5 size-3.5 shrink-0 text-[var(--green)]"
                  : "mt-0.5 size-3.5 shrink-0 text-[var(--amber)]"
              }
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
