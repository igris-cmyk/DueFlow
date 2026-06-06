ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

ALTER TABLE "PaymentRecord"
ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "cancelledById" TEXT;

CREATE INDEX IF NOT EXISTS "PaymentRecord_organizationId_paidDate_idx"
ON "PaymentRecord"("organizationId", "paidDate");
