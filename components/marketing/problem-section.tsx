import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { problems } from "@/lib/dueflow-content";

export function ProblemSection() {
  return (
    <section id="why-dueflow" className="section-space bg-[var(--paper)]">
      <div className="site-container">
        <SectionHeader
          eyebrow="Why DueFlow"
          title="Money gets lost when work, proof, and promises live in different places."
          description="The problem is rarely that the work was not done. The problem is that the payment story becomes fragmented, easy to delay, and hard to follow up on with confidence."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <article
                key={problem.title}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-[var(--red-soft)] text-[var(--red)]">
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <span className="text-xs font-black text-[#c7cbc7]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold tracking-[-0.025em] text-[var(--ink)]">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {problem.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
