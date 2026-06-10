import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

const requiredTrimmed = (label: string, max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().min(1, `${label} is required.`).max(max),
  );

export const moneyInputSchema = z
  .preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .min(1, "Amount is required.")
      .regex(/^\d+(\.\d{1,2})?$/, "Use a valid amount with up to 2 decimals."),
  );

const optionalDate = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string().date("Use a valid date.").optional(),
);

export const clientSchema = z.object({
  name: requiredTrimmed("Client name", 120),
  phone: optionalTrimmed(40),
  email: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim().toLowerCase();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().email("Use a valid email address.").max(160).optional(),
  ),
  address: optionalTrimmed(240),
  category: optionalTrimmed(80),
  reliabilityGrade: z
    .enum(["UNKNOWN", "A", "B", "C", "D"])
    .default("UNKNOWN"),
  notes: optionalTrimmed(1200),
});

export const projectSchema = z.object({
  clientId: requiredTrimmed("Client", 120),
  name: requiredTrimmed("Project name", 140),
  description: optionalTrimmed(1600),
  status: z
    .enum(["PLANNED", "ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"])
    .default("ACTIVE"),
  totalValue: moneyInputSchema,
  startDate: optionalDate,
  dueDate: optionalDate,
  completionDate: optionalDate,
  paymentTerms: optionalTrimmed(1000),
  riskStatus: z
    .enum(["HEALTHY", "ATTENTION", "AT_RISK", "DISPUTED"])
    .default("HEALTHY"),
});

export const paymentSchema = z.object({
  projectId: requiredTrimmed("Project", 120),
  amount: moneyInputSchema,
  paidDate: optionalDate,
  method: optionalTrimmed(80),
  referenceNumber: optionalTrimmed(120),
  notes: optionalTrimmed(1000),
});

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.url("Enter a valid reference URL.").max(2048).optional(),
);

export const proofSchema = z.object({
  title: requiredTrimmed("Proof title", 140),
  type: z.enum([
    "INVOICE",
    "WORK_PHOTO",
    "WHATSAPP_SCREENSHOT",
    "APPROVAL",
    "BILL_PHOTO",
    "DELIVERY_PROOF",
    "SIGNED_DOCUMENT",
    "VOICE_NOTE",
    "OTHER",
  ]),
  status: z
    .enum(["READY", "MISSING_CONTEXT", "ARCHIVED"])
    .default("READY"),
  projectId: requiredTrimmed("Project", 120),
  paymentRecordId: optionalTrimmed(120),
  description: optionalTrimmed(1600),
  sourceUrl: optionalUrl,
  fileName: optionalTrimmed(180),
  fileUrl: optionalUrl,
  redirectTo: z.enum(["proof", "project", "payment"]).default("proof"),
});

export const promiseSchema = z.object({
  projectId: requiredTrimmed("Project", 120),
  promisedAmount: moneyInputSchema,
  promisedDate: z.string().date("Use a valid promised date."),
  channel: z.enum(["WHATSAPP", "PHONE", "IN_PERSON", "EMAIL", "SMS", "OTHER"], {
    error: "Choose a valid channel.",
  }),
  paymentRecordId: optionalTrimmed(120),
  proofId: optionalTrimmed(120),
  promiseText: optionalTrimmed(1200),
  redirectTo: z.enum(["promise", "project"]).default("promise"),
});

export const promiseEditSchema = promiseSchema.extend({
  status: z
    .enum(["OPEN", "KEPT", "MISSED", "PARTIAL", "CANCELLED"])
    .default("OPEN"),
});

export const followUpSchema = z.object({
  projectId: requiredTrimmed("Project", 120),
  promiseId: optionalTrimmed(120),
  paymentRecordId: optionalTrimmed(120),
  proofId: optionalTrimmed(120),
  title: requiredTrimmed("Follow-up title", 140),
  dueDate: z.string().date("Follow-up date is required."),
  channel: z.enum(["WHATSAPP", "PHONE", "IN_PERSON", "EMAIL", "SMS", "OTHER"], {
    error: "Choose a valid channel.",
  }),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  message: optionalTrimmed(1200),
  notes: optionalTrimmed(1200),
  redirectTo: z.enum(["follow-up", "project", "promise"]).default("follow-up"),
});

export const followUpEditSchema = followUpSchema.extend({
  status: z
    .enum(["OPEN", "DONE", "SNOOZED", "CANCELLED", "COMPLETED", "SKIPPED"])
    .default("OPEN"),
});
