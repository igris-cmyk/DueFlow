import "server-only";
import { del, get, put } from "@vercel/blob";

const MB = 1024 * 1024;

export const PROOF_FILE_MAX_BYTES = 4 * MB;
export const PROOF_FILE_MAX_LABEL = "4 MB";
export const PROOF_FILE_STORAGE_PROVIDER = "vercel_blob";

const allowedFileTypes = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
} as const;

export type ProofFileValidationResult =
  | {
      ok: true;
      file: File;
      safeFileName: string;
      extension: string;
      mimeType: keyof typeof allowedFileTypes;
    }
  | {
      ok: false;
      error: string;
    };

export function validateProofFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || !value.name) {
    return {
      ok: false,
      error: "Choose a file to attach.",
    } satisfies ProofFileValidationResult;
  }

  if (value.size <= 0) {
    return {
      ok: false,
      error: "Choose a non-empty file.",
    } satisfies ProofFileValidationResult;
  }

  if (value.size > PROOF_FILE_MAX_BYTES) {
    return {
      ok: false,
      error: `File size must be ${PROOF_FILE_MAX_LABEL} or less.`,
    } satisfies ProofFileValidationResult;
  }

  if (!isAllowedMimeType(value.type)) {
    return {
      ok: false,
      error: "Only PDF, PNG, JPG, and WebP files are supported.",
    } satisfies ProofFileValidationResult;
  }

  const safeFileName = sanitizeFileName(value.name);
  const extension = getFileExtension(safeFileName);
  const allowedExtensions = allowedFileTypes[value.type];

  if (!extension || !allowedExtensions.includes(extension as never)) {
    return {
      ok: false,
      error: "File extension does not match the selected file type.",
    } satisfies ProofFileValidationResult;
  }

  return {
    ok: true,
    file: value,
    safeFileName,
    extension,
    mimeType: value.type,
  } satisfies ProofFileValidationResult;
}

export function proofUploadStorageIsConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadProofFile({
  organizationId,
  proofId,
  file,
  safeFileName,
  mimeType,
}: {
  organizationId: string;
  proofId: string;
  file: File;
  safeFileName: string;
  mimeType: string;
}) {
  if (!proofUploadStorageIsConfigured()) {
    throw new ProofFileStorageConfigError();
  }

  const pathname = [
    "organizations",
    organizationId,
    "proofs",
    proofId,
    `${crypto.randomUUID()}-${safeFileName}`,
  ].join("/");

  return put(pathname, file, {
    access: "private",
    addRandomSuffix: false,
    contentType: mimeType,
  });
}

export async function deleteProofFile(storageKey: string | null | undefined) {
  if (!storageKey || !proofUploadStorageIsConfigured()) {
    return;
  }

  await del(storageKey);
}

export async function getProofFile(storageKey: string) {
  if (!proofUploadStorageIsConfigured()) {
    throw new ProofFileStorageConfigError();
  }

  return get(storageKey, {
    access: "private",
    useCache: false,
  });
}

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) {
    return "Unknown size";
  }

  if (bytes < MB) {
    const kb = Math.max(bytes / 1024, 1);
    return `${formatCompactNumber(kb)} KB`;
  }

  return `${formatCompactNumber(bytes / MB)} MB`;
}

export function proofFileTypeLabel(mimeType: string | null | undefined) {
  if (mimeType === "application/pdf") {
    return "PDF";
  }

  if (mimeType === "image/png") {
    return "PNG image";
  }

  if (mimeType === "image/jpeg") {
    return "JPG image";
  }

  if (mimeType === "image/webp") {
    return "WebP image";
  }

  return "File";
}

export function safeContentDispositionFileName(fileName: string) {
  return sanitizeFileName(fileName).replaceAll('"', "");
}

export class ProofFileStorageConfigError extends Error {
  constructor() {
    super("Proof upload storage is not configured yet.");
  }
}

function isAllowedMimeType(value: string): value is keyof typeof allowedFileTypes {
  return Object.hasOwn(allowedFileTypes, value);
}

function sanitizeFileName(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\.+/g, ".")
    .replace(/^[-.]+|[-.]+$/g, "")
    .toLowerCase();

  return normalized.slice(0, 120) || "proof-file";
}

function getFileExtension(value: string) {
  const dotIndex = value.lastIndexOf(".");
  return dotIndex >= 0 ? value.slice(dotIndex).toLowerCase() : "";
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: value >= 10 ? 0 : 1,
  }).format(value);
}
