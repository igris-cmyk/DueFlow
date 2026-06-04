import Link from "next/link";

const footerLinks = [
  { label: "Product", href: "/#product" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Pricing", href: "/pricing" },
  { label: "Why DueFlow", href: "/#why-dueflow" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="site-container flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/"
            aria-label="DueFlow home"
            className="inline-flex items-center gap-2.5"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--ink)] text-xs font-black text-white">
              D
            </span>
            <span className="text-base font-black tracking-[-0.035em] text-[var(--ink)]">
              DueFlow
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
            Cashflow command center for work-based businesses. Designed to keep
            pending money, proof, promises, and next actions clear.
          </p>
          <p className="mt-3 text-xs font-bold text-[#8a918b]">
            Early access preview experience
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-bold text-[#626a64] hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
