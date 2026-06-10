ALTER TYPE "PromiseStatus" ADD VALUE IF NOT EXISTS 'PARTIAL';

ALTER TYPE "FollowUpStatus" ADD VALUE IF NOT EXISTS 'DONE';
ALTER TYPE "FollowUpStatus" ADD VALUE IF NOT EXISTS 'SNOOZED';
ALTER TYPE "FollowUpStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

ALTER TYPE "FollowUpChannel" ADD VALUE IF NOT EXISTS 'SMS';

ALTER TABLE "ClientPromise"
ADD COLUMN IF NOT EXISTS "paymentRecordId" TEXT,
ADD COLUMN IF NOT EXISTS "proofId" TEXT,
ADD COLUMN IF NOT EXISTS "channel" "FollowUpChannel",
ADD COLUMN IF NOT EXISTS "updatedById" TEXT,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS "keptAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "missedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "partialAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);

ALTER TABLE "FollowUp"
ADD COLUMN IF NOT EXISTS "promiseId" TEXT,
ADD COLUMN IF NOT EXISTS "proofId" TEXT,
ADD COLUMN IF NOT EXISTS "createdById" TEXT,
ADD COLUMN IF NOT EXISTS "updatedById" TEXT,
ADD COLUMN IF NOT EXISTS "completedById" TEXT,
ADD COLUMN IF NOT EXISTS "message" TEXT,
ADD COLUMN IF NOT EXISTS "snoozedUntil" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ClientPromise_paymentRecordId_fkey'
  ) THEN
    ALTER TABLE "ClientPromise"
    ADD CONSTRAINT "ClientPromise_paymentRecordId_fkey"
    FOREIGN KEY ("paymentRecordId") REFERENCES "PaymentRecord"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ClientPromise_proofId_fkey'
  ) THEN
    ALTER TABLE "ClientPromise"
    ADD CONSTRAINT "ClientPromise_proofId_fkey"
    FOREIGN KEY ("proofId") REFERENCES "ProofItem"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'FollowUp_promiseId_fkey'
  ) THEN
    ALTER TABLE "FollowUp"
    ADD CONSTRAINT "FollowUp_promiseId_fkey"
    FOREIGN KEY ("promiseId") REFERENCES "ClientPromise"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'FollowUp_proofId_fkey'
  ) THEN
    ALTER TABLE "FollowUp"
    ADD CONSTRAINT "FollowUp_proofId_fkey"
    FOREIGN KEY ("proofId") REFERENCES "ProofItem"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ClientPromise_organizationId_projectId_status_idx"
ON "ClientPromise"("organizationId", "projectId", "status");

CREATE INDEX IF NOT EXISTS "ClientPromise_organizationId_clientId_status_idx"
ON "ClientPromise"("organizationId", "clientId", "status");

CREATE INDEX IF NOT EXISTS "ClientPromise_paymentRecordId_idx"
ON "ClientPromise"("paymentRecordId");

CREATE INDEX IF NOT EXISTS "ClientPromise_proofId_idx"
ON "ClientPromise"("proofId");

CREATE INDEX IF NOT EXISTS "FollowUp_organizationId_projectId_status_idx"
ON "FollowUp"("organizationId", "projectId", "status");

CREATE INDEX IF NOT EXISTS "FollowUp_organizationId_clientId_status_idx"
ON "FollowUp"("organizationId", "clientId", "status");

CREATE INDEX IF NOT EXISTS "FollowUp_organizationId_promiseId_idx"
ON "FollowUp"("organizationId", "promiseId");

CREATE INDEX IF NOT EXISTS "FollowUp_promiseId_idx"
ON "FollowUp"("promiseId");

CREATE INDEX IF NOT EXISTS "FollowUp_proofId_idx"
ON "FollowUp"("proofId");
