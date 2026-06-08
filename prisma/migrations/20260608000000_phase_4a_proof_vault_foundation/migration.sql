DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProofStatus') THEN
    CREATE TYPE "ProofStatus" AS ENUM ('READY', 'MISSING_CONTEXT', 'ARCHIVED');
  END IF;
END $$;

ALTER TABLE "ProofItem"
ADD COLUMN IF NOT EXISTS "paymentRecordId" TEXT,
ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT 'Untitled proof',
ADD COLUMN IF NOT EXISTS "status" "ProofStatus" NOT NULL DEFAULT 'READY',
ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT,
ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ProofItem_paymentRecordId_fkey'
  ) THEN
    ALTER TABLE "ProofItem"
    ADD CONSTRAINT "ProofItem_paymentRecordId_fkey"
    FOREIGN KEY ("paymentRecordId") REFERENCES "PaymentRecord"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ProofItem_organizationId_status_idx"
ON "ProofItem"("organizationId", "status");

CREATE INDEX IF NOT EXISTS "ProofItem_paymentRecordId_idx"
ON "ProofItem"("paymentRecordId");
