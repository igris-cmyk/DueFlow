type AppLoadingStateProps = {
  title?: string;
  rows?: number;
};

export function AppLoadingState({
  title = "Loading ledger",
  rows = 4,
}: AppLoadingStateProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-6xl animate-pulse"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-3xl">
          <div className="h-3 w-32 rounded-full bg-[var(--app-accent-soft)]" />
          <div className="mt-4 h-10 w-full max-w-md rounded-2xl bg-[var(--app-border)]" />
          <p className="sr-only">{title}</p>
          <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-[var(--app-border)]" />
          <div className="mt-2 h-4 w-3/4 max-w-lg rounded-full bg-[var(--app-border)]" />
        </div>
        <div className="h-11 w-36 rounded-xl bg-[var(--app-border)]" />
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]"
          >
            <div className="h-5 w-24 rounded-full bg-[var(--app-border)]" />
            <div className="mt-4 h-7 w-28 rounded-full bg-[var(--app-border)]" />
          </div>
        ))}
      </section>

      <section className="mt-5 grid gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]"
          >
            <div className="h-5 w-2/5 rounded-full bg-[var(--app-border)]" />
            <div className="mt-3 h-4 w-3/5 rounded-full bg-[var(--app-border)]" />
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="h-4 rounded-full bg-[var(--app-border)]" />
              <div className="h-4 rounded-full bg-[var(--app-border)]" />
              <div className="h-4 rounded-full bg-[var(--app-border)]" />
              <div className="h-4 rounded-full bg-[var(--app-border)]" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
