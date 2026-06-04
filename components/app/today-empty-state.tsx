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
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--green)]">
          Every rupee has a status
        </p>
        <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.055em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
          Today’s Cash Desk
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base sm:leading-8">
          Your cash desk is ready. Add your first client, project, and pending
          payment in the next phase to start tracking every rupee with a clear
          status.
        </p>
      </div>

      <section className="mt-8 rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)] sm:p-7">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black tracking-[-0.025em] text-[var(--ink)]">
              Build the starting record
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              These workflows become active with the core ledger in Phase 3.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.09em] text-[#707973]">
            Preview actions
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {previewActions.map((action) => (
            <button
              key={action.title}
              type="button"
              disabled
              className="flex min-h-44 cursor-not-allowed flex-col items-start rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-left opacity-75"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-[#cbd9cf] bg-white text-[var(--green)]">
                <action.icon aria-hidden="true" className="size-4.5" />
              </span>
              <span className="mt-5 text-sm font-extrabold text-[var(--ink)]">
                {action.title}
              </span>
              <span className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                {action.description}
              </span>
            </button>
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
            className="rounded-2xl border border-[var(--line)] bg-[#f7f6f1] p-5"
          >
            <p className="text-sm font-extrabold text-[var(--ink)]">
              {item.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {item.copy}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[var(--green)]">
              Core ledger preview
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
