import { CircleHelp, Command, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductMockupShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  bodyClassName?: string;
};

export function ProductMockupShell({
  children,
  title = "Today's Cash Desk",
  subtitle = "Thursday, 4 June",
  className,
  bodyClassName,
}: ProductMockupShellProps) {
  const navigationItems = [
    { label: "Cash Desk", count: "5" },
    { label: "Projects", count: "14" },
    { label: "Clients", count: "18" },
    { label: "Proof Vault", count: "3" },
    { label: "Reports" },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-[#303733] bg-[#1b211e] shadow-[0_28px_80px_rgba(14,18,16,0.2)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg bg-white text-[0.68rem] font-black text-[var(--ink)]">
            D
          </span>
          <span className="text-sm font-extrabold tracking-[-0.02em]">DueFlow</span>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.68rem] text-white/50 sm:flex">
          <Search aria-hidden="true" className="size-3" />
          Search clients, projects, proof
          <Command aria-hidden="true" className="size-3" />
        </div>
        <CircleHelp aria-hidden="true" className="size-4 text-white/45" />
      </div>
      <div className="grid min-h-0 grid-cols-1 md:grid-cols-[145px_1fr]">
        <aside className="hidden border-r border-white/8 px-3 py-5 md:flex md:flex-col">
          <p className="mb-3 px-2.5 text-[0.58rem] font-extrabold uppercase tracking-[0.12em] text-white/22">
            Money control
          </p>
          <div className="flex-1">
            {navigationItems.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "mb-1 flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[0.68rem] font-bold",
                  index === 0
                    ? "bg-white/10 text-white"
                    : "text-white/38",
                )}
              >
                <span>{item.label}</span>
                {item.count ? (
                  <span
                    className={cn(
                      "text-[0.58rem] font-extrabold tabular-nums",
                      index === 0 ? "text-[#afd4b8]" : "text-white/20",
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.035] px-2.5 py-2.5">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.08em] text-white/25">
              Overdue
            </p>
            <p className="mt-1 text-xs font-extrabold text-[#e4a39d] tabular-nums">
              ₹72,000
            </p>
          </div>
        </aside>
        <div className={cn("min-w-0 bg-[#f5f3ed] p-3.5 sm:p-5", bodyClassName)}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[var(--ink)]">{title}</p>
              <p className="mt-1 text-[0.68rem] text-[var(--text-muted)]">
                {subtitle}
              </p>
            </div>
            <span className="rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-[0.65rem] font-extrabold text-[var(--green)]">
              Preview experience
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
