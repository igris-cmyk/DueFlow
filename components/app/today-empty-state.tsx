import {
  ArrowRight,
  BriefcaseBusiness,
  FileArchive,
  HandCoins,
  ListTodo,
  UserRoundPlus,
} from "lucide-react";

const previewActions = [
  {
    title: "Add first client",
    description: "Create the person or business behind a pending balance.",
    icon: UserRoundPlus,
  },
  {
    title: "Add first project",
    description: "Connect completed work to value, terms, and due dates.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Record pending payment",
    description: "Give every amount a clear status and reason.",
    icon: HandCoins,
  },
  {
    title: "Upload proof",
    description: "Keep invoices, approvals, screenshots, and work photos close.",
    icon: FileArchive,
  },
  {
    title: "Create follow-up",
    description: "Turn a pending balance into a respectful next action.",
    icon: ListTodo,
  },
];

export function TodayEmptyState() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Every rupee has a status
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.055em] text-[var(--app-text)] sm:text-4xl lg:text-5xl">
            Today’s Cash Desk
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)] sm:text-base sm:leading-8">
            Your cash desk is ready. Phase 3 will add real clients, projects,
            and pending payments so every rupee can carry a clear status and
            next action.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-[#cad9ce] bg-[var(--app-accent-soft)] px-3.5 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-accent)]">
          Workspace ready
        </span>
      </div>

      <section className="mt-8 rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow)] sm:p-7">
        <div className="flex flex-col gap-3 border-b border-[var(--app-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-black tracking-[-0.025em] text-[var(--app-text)]">
              Build the starting record
            </p>
            <p className="mt-2 text-[0.9rem] leading-6 text-[var(--app-text-muted)]">
              The core ledger will activate these workflows in Phase 3.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
            Preview actions
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {previewActions.map((action) => (
            <article
              key={action.title}
              className="flex min-h-48 flex-col items-start rounded-[1.15rem] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="grid size-10 place-items-center rounded-xl border border-[#c8d7cc] bg-[var(--app-surface-strong)] text-[var(--app-accent)] shadow-sm">
                  <action.icon aria-hidden="true" className="size-4.5" />
                </span>
                <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.07em] text-[var(--app-text-muted)]">
                  Phase 3
                </span>
              </div>
              <span className="mt-5 text-[0.95rem] font-extrabold text-[var(--app-text)]">
                {action.title}
              </span>
              <span className="mt-2 text-[0.82rem] leading-5 text-[var(--app-text-muted)]">
                {action.description}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Payment needs attention.",
            copy: "A due balance will appear with its project, proof, and next action.",
          },
          {
            label: "Proof is missing.",
            copy: "DueFlow will make gaps visible before a follow-up goes out.",
          },
          {
            label: "Follow up today.",
            copy: "Promises and follow-up history will stay connected to the record.",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-soft)]"
          >
            <p className="text-[0.95rem] font-extrabold text-[var(--app-text)]">
              {item.label}
            </p>
            <p className="mt-2 text-[0.88rem] leading-6 text-[var(--app-text-muted)]">
              {item.copy}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-accent)]">
              Core ledger preview
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
