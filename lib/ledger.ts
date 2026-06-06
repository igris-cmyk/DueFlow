import "server-only";
import { Prisma } from "@/app/generated/prisma/client";
import type { Project } from "@/app/generated/prisma/client";

type DecimalValue = Prisma.Decimal | string | number;

export const validReceivedPaymentWhere = {
  type: "PAYMENT",
  status: { not: "CANCELLED" },
} satisfies Prisma.PaymentRecordWhereInput;

export function parseMoneyInput(value: string) {
  return new Prisma.Decimal(value);
}

export function formatCurrency(
  value: DecimalValue,
  currency = "INR",
) {
  const decimal = new Prisma.Decimal(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(decimal.toNumber());
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function parseDateInput(value: string | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export function todayUtcStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function getCurrentMonthRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { start, end };
}

export function getCurrentWeekRange(now = new Date()) {
  const start = todayUtcStartFrom(now);
  const day = start.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setUTCDate(start.getUTCDate() + mondayOffset);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);

  return { start, end };
}

export function calculateProjectFinancials(
  totalValue: DecimalValue,
  payments: Array<{ amount: DecimalValue; status: string; type: string }>,
) {
  const total = new Prisma.Decimal(totalValue);
  const paid = payments
    .filter((payment) => payment.type === "PAYMENT" && payment.status !== "CANCELLED")
    .reduce((sum, payment) => sum.plus(payment.amount), new Prisma.Decimal(0));
  const pending = Prisma.Decimal.max(total.minus(paid), new Prisma.Decimal(0));

  return { total, paid, pending };
}

export function isProjectOverdue(
  project: Pick<Project, "dueDate" | "pendingAmount">,
  now = new Date(),
) {
  if (!project.dueDate || new Prisma.Decimal(project.pendingAmount).lte(0)) {
    return false;
  }

  return project.dueDate < todayUtcStartFrom(now);
}

export function isDueThisWeek(
  project: Pick<Project, "dueDate" | "pendingAmount">,
  now = new Date(),
) {
  if (!project.dueDate || new Prisma.Decimal(project.pendingAmount).lte(0)) {
    return false;
  }

  const { start, end } = getCurrentWeekRange(now);
  return project.dueDate >= start && project.dueDate < end;
}

export function todayUtcStartFrom(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export async function recalculateProjectBalances(
  tx: Prisma.TransactionClient,
  projectId: string,
  organizationId?: string,
) {
  const project = await tx.project.findUnique({
    where: { id: projectId },
    select: { id: true, totalValue: true },
  });

  if (!project) {
    return null;
  }

  const aggregate = await tx.paymentRecord.aggregate({
    where: {
      organizationId,
      projectId,
      ...validReceivedPaymentWhere,
    },
    _sum: { amount: true },
  });

  const paid = aggregate._sum.amount ?? new Prisma.Decimal(0);
  const pending = Prisma.Decimal.max(
    new Prisma.Decimal(project.totalValue).minus(paid),
    new Prisma.Decimal(0),
  );

  return tx.project.update({
    where: { id: project.id },
    data: {
      paidAmount: paid,
      pendingAmount: pending,
    },
  });
}

export function statusLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
