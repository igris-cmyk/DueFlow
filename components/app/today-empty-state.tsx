import {
  ArrowRight,
  BriefcaseBusiness,
  HandCoins,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";

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
    title: "Record received payment",
    description: "Record money received once a project exists.",
    icon: HandCoins,
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
            Your cash desk is ready. Add a client, create a project, and record
            received payments so every rupee carries a clear status.
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
              Start with a real client, then attach a project and payment history.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
            Core actions
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {previewActions.map((action) => (
            <article
              key={action.title}
              className="flex min-h-48 flex-col items-start rounded-[1.15rem] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="grid size-10 place-items-center rounded-xl border border-[#c8d7cc] bg-[var(--app-surface-strong)] text-[var(--app-accent)] shadow-sm">
                  <action.icon aria-hidden="true" className="size-4.5" />
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

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/app/clients/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d]"
        >
          Add first client
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          href="/app/projects/new"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 text-sm font-extrabold text-[var(--app-text-soft)] shadow-sm transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-text)]"
        >
          Add project
        </Link>
      </div>

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
