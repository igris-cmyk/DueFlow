export const proofTypeOptions = [
  { value: "INVOICE", label: "Invoice" },
  { value: "WORK_PHOTO", label: "Work Photo" },
  { value: "WHATSAPP_SCREENSHOT", label: "WhatsApp Screenshot" },
  { value: "APPROVAL", label: "Approval" },
  { value: "BILL_PHOTO", label: "Bill" },
  { value: "DELIVERY_PROOF", label: "Delivery Proof" },
  { value: "SIGNED_DOCUMENT", label: "Signed Document" },
  { value: "VOICE_NOTE", label: "Voice Note" },
  { value: "OTHER", label: "Other" },
] as const;

export const proofStatusOptions = [
  { value: "READY", label: "Ready" },
  { value: "MISSING_CONTEXT", label: "Missing Context" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export function proofTypeLabel(value: string) {
  return (
    proofTypeOptions.find((option) => option.value === value)?.label ?? "Other"
  );
}

export function proofStatusLabel(value: string) {
  return (
    proofStatusOptions.find((option) => option.value === value)?.label ??
    "Missing Context"
  );
}

export function proofStatusTone(value: string) {
  if (value === "READY") {
    return "green" as const;
  }

  if (value === "ARCHIVED") {
    return "slate" as const;
  }

  return "amber" as const;
}

export function activeProofWhere() {
  return {
    archivedAt: null,
    status: { not: "ARCHIVED" as const },
  };
}

export function safeExternalHref(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
