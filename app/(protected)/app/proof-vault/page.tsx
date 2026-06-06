import type { Metadata } from "next";
import { FileArchive } from "lucide-react";
import { EmptyModulePage } from "@/components/app/empty-module-page";

export const metadata: Metadata = {
  title: "Proof Vault",
};

export default function ProofVaultPage() {
  return (
    <EmptyModulePage
      eyebrow="Evidence foundation"
      title="Proof Vault"
      message="Proof upload comes after the core ledger. Phase 3 keeps project and payment records ready for future proof metadata."
      icon={FileArchive}
      futurePoints={[
        "Keep proof grouped by client and project.",
        "Make missing evidence visible before a payment follow-up.",
        "Prepare for a real upload backend without pretending one exists yet.",
      ]}
    />
  );
}
