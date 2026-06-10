"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

type CopyMessageButtonProps = {
  message: string;
};

export function CopyMessageButton({ message }: CopyMessageButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#2a352d]"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Clipboard aria-hidden="true" className="size-4" />
      )}
      {copied ? "Copied" : "Copy message"}
    </button>
  );
}
