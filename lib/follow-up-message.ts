import "server-only";
import { Prisma } from "@/app/generated/prisma/client";
export {
  channelLabel,
  channelOptions,
  followUpPriorityOptions,
  followUpStatusLabel,
  followUpStatusOptions,
  promiseStatusLabel,
  promiseStatusOptions,
  statusTone,
} from "@/lib/follow-up-options";
import { formatCurrency, formatDate } from "@/lib/ledger";

type MoneyValue = Prisma.Decimal | string | number | null | undefined;

export function isPromiseComputedMissed({
  status,
  promisedDate,
  projectPendingAmount,
  now = new Date(),
}: {
  status: string;
  promisedDate: Date;
  projectPendingAmount: MoneyValue;
  now?: Date;
}) {
  if (status !== "OPEN") {
    return false;
  }

  const pending = new Prisma.Decimal(projectPendingAmount ?? 0);
  return promisedDate < todayUtcStartFrom(now) && pending.gt(0);
}

export function generateFollowUpMessage({
  clientName,
  projectName,
  amount,
  currency,
  promisedDate,
  hasProof,
  type = "payment-reminder",
}: {
  clientName: string;
  projectName: string;
  amount: MoneyValue;
  currency: string;
  promisedDate?: Date | null;
  hasProof?: boolean;
  type?: "payment-reminder" | "missed-promise" | "proof-backed" | "approval";
}) {
  const formattedAmount = formatCurrency(amount ?? 0, currency);

  if (type === "missed-promise" && promisedDate) {
    return `Hi ${clientName}, you had mentioned that the payment for ${projectName} would be cleared by ${formatDate(promisedDate)}. I am following up so we can close the pending balance of ${formattedAmount}. Please update me when possible.`;
  }

  if (type === "proof-backed" || hasProof) {
    return `Hi ${clientName}, following up on the pending balance for ${projectName}. I have the invoice or proof ready if you need it again. Please confirm when the payment can be cleared.`;
  }

  if (type === "approval") {
    return `Hi ${clientName}, checking if the work or payment approval for ${projectName} is complete from your side. Once confirmed, please help clear the pending balance of ${formattedAmount}.`;
  }

  return `Hi ${clientName}, just following up on the pending balance for ${projectName}. The work is marked complete from our side. Please let me know when you can clear the pending amount of ${formattedAmount}.`;
}

export function defaultPromiseText({
  clientName,
  amount,
  currency,
  promisedDate,
}: {
  clientName: string;
  amount: MoneyValue;
  currency: string;
  promisedDate: Date;
}) {
  return `${clientName} promised ${formatCurrency(amount ?? 0, currency)} by ${formatDate(promisedDate)}.`;
}

function todayUtcStartFrom(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}
