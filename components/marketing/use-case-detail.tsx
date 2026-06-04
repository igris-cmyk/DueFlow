import {
  CheckCircle2,
  ClipboardCheck,
  FolderCheck,
  MessageSquareText,
  Smartphone,
  WalletCards,
} from "lucide-react";
import { ButtonLink } from "@/components/dueflow-ui/button-link";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import type { UseCase } from "@/lib/use-cases";

type UseCaseDetailProps = {
  useCase: UseCase;
};

export function UseCaseDetail({ useCase }: UseCaseDetailProps) {
  return (
    <>
      <section className="section-space bg-[var(--paper)]">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader
            eyebrow={`The ${useCase.name.toLowerCase()} payment problem`}
            title={useCase.detailTitle}
            description={useCase.pain}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailList
              title="What gets stuck"
              items={useCase.stuck}
              tone="attention"
            />
            <DetailList
              title="What DueFlow tracks"
              items={useCase.tracks}
              tone="healthy"
            />
          </div>
        </div>
      </section>

      <section className="section-space border-y border-[var(--line)] bg-[var(--paper-strong)]">
        <div className="site-container">
          <SectionHeader
            eyebrow="Example workflow"
            title={useCase.workflowTitle}
            description="The workflow stays simple: record the work, keep the proof, note what was promised, and act when the next step is due."
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCase.workflow.map((step, index) => (
              <li
                key={step}
                className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--paper)] p-5"
              >
                <span className="grid size-8 place-items-center rounded-full bg-[var(--green)] text-xs font-black text-white">
                  {index + 1}
                </span>
                <p className="mt-5 text-sm font-extrabold leading-6 text-[var(--ink)]">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-space bg-[#19201c] text-white">
        <div className="site-container">
          <SectionHeader
            eyebrow="Modules that matter"
            title={`The records ${useCase.name.toLowerCase()} need before follow-up.`}
            description="DueFlow is designed to keep the context behind the money together, so follow-up is based on facts instead of memory."
            className="[&_.eyebrow]:text-[#9fc8ab] [&_h2]:text-white [&_p:last-child]:text-white/55"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Project Ledger",
                description: "Keep value, partial payments, and balance clear.",
                icon: WalletCards,
              },
              {
                title: "Proof Vault",
                description: "Attach the proof behind the completed work.",
                icon: FolderCheck,
              },
              {
                title: "Promise Tracker",
                description: "Record what the client said and when it is due.",
                icon: ClipboardCheck,
              },
              {
                title: "Suggested Follow-Ups",
                description: "Draft respectful reminders with the right context.",
                icon: MessageSquareText,
              },
            ].map((module) => {
              const Icon = module.icon;
              return (
                <article
                  key={module.title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-5"
                >
                  <Icon aria-hidden="true" className="size-4.5 text-[#afd4b8]" />
                  <h3 className="mt-5 text-sm font-extrabold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/45">
                    {module.description}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="mt-8 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <Smartphone
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#afd4b8]"
            />
            <p className="text-sm leading-6 text-white/55">
              {useCase.mobileValue}
            </p>
          </div>
        </div>
      </section>

      <section className="grid-paper bg-[var(--paper-strong)] py-20 text-center sm:py-24">
        <div className="site-container">
          <p className="eyebrow justify-center">Early access</p>
          <h2 className="text-balance mx-auto mt-6 max-w-3xl text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
            {useCase.ctaTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
            Keep clients, projects, proof, promises, and pending balances in one
            professional record.
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
      </section>
    </>
  );
}

type DetailListProps = {
  title: string;
  items: string[];
  tone: "attention" | "healthy";
};

function DetailList({ title, items, tone }: DetailListProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#818983]">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-6 text-[#58625b]"
          >
            <CheckCircle2
              aria-hidden="true"
              className={
                tone === "healthy"
                  ? "mt-1 size-3.5 shrink-0 text-[var(--green)]"
                  : "mt-1 size-3.5 shrink-0 text-[var(--amber)]"
              }
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
