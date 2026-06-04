import Link from "next/link";
import { Menu } from "lucide-react";
import { ButtonLink } from "@/components/dueflow-ui/button-link";

const navItems = [
  { label: "Product", href: "/#product" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Pricing", href: "/pricing" },
  { label: "Why DueFlow", href: "/#why-dueflow" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f5ef]/88 backdrop-blur-xl">
      <div className="site-container flex h-[4.4rem] items-center justify-between gap-4">
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

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-bold text-[#5a625d] transition hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/pricing#plans" className="min-h-10 px-4 py-2">
            Start Free
          </ButtonLink>
        </div>

        <details className="group relative md:hidden">
          <summary
            aria-label="Open navigation menu"
            className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-strong)] [&::-webkit-details-marker]:hidden"
          >
            <Menu aria-hidden="true" className="size-4.5" />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-12 w-64 rounded-2xl border border-[var(--line)] bg-[var(--paper-strong)] p-3 shadow-[var(--shadow-soft)]"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-3 py-2.5 text-sm font-bold text-[#59615c] hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/pricing#plans" className="mt-2 w-full">
              Start Free
            </ButtonLink>
          </nav>
        </details>
      </div>
    </header>
  );
}
