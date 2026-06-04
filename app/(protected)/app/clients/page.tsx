import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import { EmptyModulePage } from "@/components/app/empty-module-page";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientsPage() {
  return (
    <EmptyModulePage
      eyebrow="Client ledger foundation"
      title="Clients"
      message="Clients will show who owes money, their reliability, active projects, and pending balances."
      icon={UsersRound}
      futurePoints={[
        "Keep contact details and reliability context close to the money record.",
        "See active projects and pending balances for each client.",
        "Connect promises, disputes, proof, and follow-up history.",
      ]}
    />
  );
}
