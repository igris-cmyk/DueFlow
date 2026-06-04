"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-5 py-3 text-[0.95rem] font-extrabold text-white shadow-[0_10px_24px_rgba(31,40,34,0.17)] transition hover:bg-[#2a352d] hover:shadow-[0_12px_28px_rgba(31,40,34,0.2)] disabled:cursor-wait disabled:opacity-75",
        className,
      )}
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <ArrowRight aria-hidden="true" className="size-4" />
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
