export const businessTypeOptions = [
  { value: "CONTRACTOR", label: "Contractor" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "AGENCY", label: "Agency" },
  { value: "PHOTOGRAPHER", label: "Photographer" },
  { value: "REPAIR_TEAM", label: "Repair Team" },
  { value: "INTERIOR_WORKER", label: "Interior Worker" },
  { value: "OTHER_SERVICE_BUSINESS", label: "Other Service Business" },
] as const;

export const currencyOptions = [
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "EUR", label: "EUR - Euro" },
] as const;

export const timezoneOptions = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "America/New_York", label: "America/New_York" },
] as const;

export type BusinessTypeValue = (typeof businessTypeOptions)[number]["value"];

export function formatBusinessType(value: string) {
  return (
    businessTypeOptions.find((option) => option.value === value)?.label ??
    value
  );
}

export function formatMembershipRole(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
