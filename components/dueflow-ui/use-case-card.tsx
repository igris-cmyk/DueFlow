import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { UseCase } from "@/lib/use-cases";
import { cn } from "@/lib/utils";

type UseCaseCardProps = {
  useCase: UseCase;
  className?: string;
};

export function UseCaseCard({ useCase, className }: UseCaseCardProps) {
  const Icon = useCase.icon;

  return (
    <Link
      href={`/use-cases/${useCase.slug}`}
      className={cn(
        "group rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:border-[#bdc4bd] hover:bg-white",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-[#a4aaa5] transition group-hover:text-[var(--ink)]"
        />
      </div>
      <h3 className="mt-6 text-lg font-extrabold tracking-[-0.025em] text-[var(--ink)]">
        {useCase.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {useCase.shortDescription}
      </p>
      <span className="mt-5 inline-flex text-xs font-extrabold text-[var(--green)]">
        See the workflow
      </span>
    </Link>
  );
}
