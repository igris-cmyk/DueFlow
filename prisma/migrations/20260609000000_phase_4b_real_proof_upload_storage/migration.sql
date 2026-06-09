ALTER TABLE "ProofItem"
ADD COLUMN IF NOT EXISTS "storageProvider" TEXT,
ADD COLUMN IF NOT EXISTS "storageKey" TEXT,
ADD COLUMN IF NOT EXISTS "storageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "uploadedFileName" TEXT,
ADD COLUMN IF NOT EXISTS "uploadedFileSize" INTEGER,
ADD COLUMN IF NOT EXISTS "uploadedFileMimeType" TEXT,
ADD COLUMN IF NOT EXISTS "fileUploadedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "fileUploadedById" TEXT,
ADD COLUMN IF NOT EXISTS "fileRemovedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "fileRemovedById" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ProofItem_fileUploadedById_fkey'
  ) THEN
    ALTER TABLE "ProofItem"
    ADD CONSTRAINT "ProofItem_fileUploadedById_fkey"
    FOREIGN KEY ("fileUploadedById")
    REFERENCES "User"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ProofItem_fileRemovedById_fkey'
  ) THEN
    ALTER TABLE "ProofItem"
    ADD CONSTRAINT "ProofItem_fileRemovedById_fkey"
    FOREIGN KEY ("fileRemovedById")
    REFERENCES "User"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ProofItem_organizationId_storageProvider_idx"
ON "ProofItem"("organizationId", "storageProvider");

CREATE INDEX IF NOT EXISTS "ProofItem_fileUploadedById_idx"
ON "ProofItem"("fileUploadedById");

CREATE INDEX IF NOT EXISTS "ProofItem_fileRemovedById_idx"
ON "ProofItem"("fileRemovedById");
