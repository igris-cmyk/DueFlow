import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  getProofFile,
  ProofFileStorageConfigError,
  safeContentDispositionFileName,
} from "@/lib/proof-file";

type ProofFileRouteProps = {
  params: Promise<{ proofId: string }>;
};

export async function GET(_request: Request, { params }: ProofFileRouteProps) {
  const { proofId } = await params;
  const { organization } = await requireOrganization();
  const proof = await getDb().proofItem.findFirst({
    where: {
      id: proofId,
      organizationId: organization.id,
      archivedAt: null,
      status: { not: "ARCHIVED" },
    },
    select: {
      storageKey: true,
      uploadedFileName: true,
      uploadedFileMimeType: true,
    },
  });

  if (!proof?.storageKey || !proof.uploadedFileName) {
    notFound();
  }

  let blob;

  try {
    blob = await getProofFile(proof.storageKey);
  } catch (error) {
    if (error instanceof ProofFileStorageConfigError) {
      return new NextResponse("Proof upload storage is not configured yet.", {
        status: 503,
        headers: privateHeaders(),
      });
    }

    return new NextResponse("Proof file could not be opened.", {
      status: 502,
      headers: privateHeaders(),
    });
  }

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    notFound();
  }

  const fileName = safeContentDispositionFileName(proof.uploadedFileName);
  const contentType =
    proof.uploadedFileMimeType ?? blob.blob.contentType ?? "application/octet-stream";

  return new NextResponse(blob.stream, {
    status: 200,
    headers: {
      ...privateHeaders(),
      "Content-Type": contentType,
      "Content-Length": String(blob.blob.size),
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}

function privateHeaders() {
  return {
    "Cache-Control": "no-store, private",
    "X-Content-Type-Options": "nosniff",
  };
}
