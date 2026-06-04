import {
  Camera,
  CheckCircle2,
  FileCheck2,
  FileText,
  FolderOpen,
  MessageSquareText,
  Mic,
  PackageCheck,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { ProofTile } from "@/components/dueflow-ui/proof-tile";
import { ProductMockupShell } from "@/components/dueflow-ui/product-mockup-shell";

const proofItems = [
  {
    type: "Invoice",
    project: "Shop Renovation",
    date: "Uploaded 31 May",
    icon: FileText,
    tone: "green" as const,
  },
  {
    type: "Work Photo",
    project: "CCTV Project",
    date: "Captured 2 Jun",
    icon: Camera,
    tone: "slate" as const,
  },
  {
    type: "WhatsApp Screenshot",
    project: "Elite Decor",
    date: "Attached 1 Jun",
    icon: MessageSquareText,
    tone: "amber" as const,
  },
  {
    type: "Approval",
    project: "Office Electrical",
    date: "Approved 28 May",
    icon: ShieldCheck,
    tone: "green" as const,
  },
  {
    type: "Bill Photo",
    project: "Cafe Interior",
    date: "Captured 3 Jun",
    icon: Receipt,
    tone: "amber" as const,
  },
  {
    type: "Delivery Proof",
    project: "Furniture Order",
    date: "Delivered 30 May",
    icon: PackageCheck,
    tone: "slate" as const,
  },
  {
    type: "Signed Document",
    project: "Marble Installation",
    date: "Signed 27 May",
    icon: FileCheck2,
    tone: "green" as const,
  },
  {
    type: "Voice Note",
    project: "Repair Contract",
    date: "Saved 29 May",
    icon: Mic,
    tone: "red" as const,
  },
];

type ProofVaultPreviewProps = {
  className?: string;
};

export function ProofVaultPreview({ className }: ProofVaultPreviewProps) {
  return (
    <ProductMockupShell
      title="Proof Vault"
      subtitle="Proof attached to the right project"
      className={className}
    >
      <div className="grid gap-3.5 lg:grid-cols-[1fr_180px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-white/60 px-3 py-2.5">
            <span className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold text-[var(--ink)]">
              <FolderOpen aria-hidden="true" className="size-3.5 text-[var(--green)]" />
              All project proof
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[var(--green-soft)] px-2 py-1 text-[0.6rem] font-extrabold text-[var(--green)]">
                12 attached
              </span>
              <span className="rounded-full bg-[var(--amber-soft)] px-2 py-1 text-[0.6rem] font-extrabold text-[var(--amber)]">
                1 proof gap
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {proofItems.map((item) => (
              <ProofTile key={`${item.project}-${item.type}`} {...item} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[#1f2823] p-4 text-white">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.11em] text-[#9fc8ab]">
              Proof Pack
            </p>
            <span className="rounded-full bg-white/8 px-2 py-1 text-[0.58rem] font-extrabold text-white/50">
              Ready to review
            </span>
          </div>
          <p className="mt-4 text-base font-extrabold tracking-[-0.025em] text-white">
            Shop Renovation
          </p>
          <p className="mt-2 text-xs leading-5 text-white/55">
            A clean project summary with payment history, proof, follow-ups, and
            pending balance.
          </p>
          <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.035] p-3">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.08em] text-white/30">
              Pending balance
            </p>
            <p className="mt-1.5 text-xl font-black tracking-[-0.04em] text-white tabular-nums">
              ₹55,000
            </p>
          </div>
          <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
            {["Payment history", "Proof timeline", "Follow-up record"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-[0.65rem] font-bold text-white/48"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-3 text-[#9fc8ab]"
                  />
                  {item}
                </div>
              ),
            )}
          </div>
          <span className="mt-5 inline-flex rounded-full bg-white px-3 py-1.5 text-[0.65rem] font-extrabold text-[var(--ink)]">
            Preview Proof Pack
          </span>
        </div>
      </div>
    </ProductMockupShell>
  );
}
