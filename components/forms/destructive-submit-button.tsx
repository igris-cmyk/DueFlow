"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Ban, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DestructiveSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
};

export function DestructiveSubmitButton({
  children,
  pendingLabel,
  className,
}: DestructiveSubmitButtonProps) {
  const { pending } = useFormStatus();
  const [locked, setLocked] = useState(false);
  const lockTimerRef = useRef<number | null>(null);
  const sawPendingRef = useRef(false);
  const isBusy = pending || locked;

  useEffect(() => {
    if (pending) {
      sawPendingRef.current = true;
      return;
    }

    if (!locked) {
      return;
    }

    const resetDelay = sawPendingRef.current ? 0 : 3000;
    const reset = window.setTimeout(() => {
      sawPendingRef.current = false;
      setLocked(false);
    }, resetDelay);

    return () => window.clearTimeout(reset);
  }, [locked, pending]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        window.clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

  return (
    <button
      type="submit"
      disabled={isBusy}
      aria-live="polite"
      onClick={(event) => {
        const form = event.currentTarget.form;

        if (form && !form.checkValidity()) {
          return;
        }

        if (lockTimerRef.current) {
          window.clearTimeout(lockTimerRef.current);
        }

        lockTimerRef.current = window.setTimeout(() => {
          sawPendingRef.current = false;
          setLocked(true);
        }, 0);
      }}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#edc7c1] bg-[var(--red-soft)] px-3 text-sm font-extrabold text-[var(--red)] transition hover:border-[var(--red)] disabled:cursor-wait disabled:opacity-75",
        className,
      )}
    >
      {isBusy ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <Ban aria-hidden="true" className="size-4" />
      )}
      {isBusy ? pendingLabel : children}
    </button>
  );
}
