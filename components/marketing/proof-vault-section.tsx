import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { ProofVaultPreview } from "@/components/product-preview/proof-vault-preview";

const proofTypes = [
  "Bill photos",
  "Work photos",
  "WhatsApp screenshots",
  "Approvals",
  "Invoices",
  "Voice notes",
  "Signed documents",
  "Delivery proof",
];

export function ProofVaultSection() {
  return (
    <section className="section-space bg-[var(--paper)]">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <SectionHeader
            eyebrow="Proof Vault"
            title="Proof should be attached to the project, not buried in the gallery."
            description="When a balance is questioned, the strongest answer is a calm, complete record. Proof Vault is designed to keep the evidence behind the work easy to find and professionally organized."
          />
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--green)]">
              What belongs in the vault
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {proofTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#58615a]"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-3.5 text-[var(--green)]"
                  />
                  {type}
                </span>
              ))}
            </div>
            <div className="mt-5 border-t border-[var(--line)] pt-5">
              <p className="text-sm font-extrabold text-[var(--ink)]">
                Proof Pack preview
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">
                Generate a clean project summary with payment history, proof,
                follow-ups, and pending balance.
              </p>
            </div>
          </div>
        </div>
        <ProofVaultPreview className="mt-12" />
      </div>
    </section>
  );
}
