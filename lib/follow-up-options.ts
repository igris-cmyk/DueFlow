export const channelOptions = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Phone Call" },
  { value: "IN_PERSON", label: "In Person" },
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "OTHER", label: "Other" },
] as const;

export const promiseStatusOptions = [
  { value: "OPEN", label: "Open" },
  { value: "KEPT", label: "Kept" },
  { value: "MISSED", label: "Missed" },
  { value: "PARTIAL", label: "Partial" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const followUpStatusOptions = [
  { value: "OPEN", label: "Open" },
  { value: "DONE", label: "Done" },
  { value: "SNOOZED", label: "Snoozed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const followUpPriorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const;

export function channelLabel(value: string | null | undefined) {
  return channelOptions.find((option) => option.value === value)?.label ?? "Other";
}

export function promiseStatusLabel(value: string) {
  return promiseStatusOptions.find((option) => option.value === value)?.label ?? value;
}

export function followUpStatusLabel(value: string) {
  if (value === "COMPLETED") {
    return "Done";
  }

  if (value === "SKIPPED") {
    return "Cancelled";
  }

  return followUpStatusOptions.find((option) => option.value === value)?.label ?? value;
}

export function statusTone(value: string, missed = false) {
  if (missed || value === "MISSED" || value === "URGENT") {
    return "red" as const;
  }

  if (["OPEN", "SNOOZED", "PARTIAL", "HIGH", "NORMAL"].includes(value)) {
    return "amber" as const;
  }

  if (["KEPT", "DONE", "COMPLETED", "LOW"].includes(value)) {
    return "green" as const;
  }

  return "slate" as const;
}
