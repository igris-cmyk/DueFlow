import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { EmptyModulePage } from "@/components/app/empty-module-page";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <EmptyModulePage
      eyebrow="Professional summary foundation"
      title="Reports"
      message="Reports will turn ledgers, proof, and follow-up history into professional summaries."
      icon={TrendingUp}
      futurePoints={[
        "Summarize balances without fake metrics or disconnected charts.",
        "Keep report inputs traceable to tenant-owned records.",
        "Prepare clear payment history for professional client conversations.",
      ]}
    />
  );
}
