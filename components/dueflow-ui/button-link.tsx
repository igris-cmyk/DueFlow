import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
  showArrow?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  showArrow = false,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6b4f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f1ea]",
        variant === "primary" &&
          "bg-[#101513] !text-white shadow-[0_8px_22px_rgba(21,24,23,0.18)] hover:bg-[#1b211e] hover:!text-white hover:shadow-md",
        variant === "secondary" &&
          "border border-black/10 bg-white/60 !text-[#111513] hover:border-black/20 hover:bg-white hover:!text-[#111513]",
        variant === "light" &&
          "bg-white !text-[var(--ink)] hover:bg-[var(--paper-muted)] hover:!text-[var(--ink)]",
        className,
      )}
    >
      {children}
      {showArrow ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}
