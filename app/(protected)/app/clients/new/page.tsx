import type { Metadata } from "next";
import { ClientForm } from "@/components/app/client-form";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { createClientAction } from "@/app/(protected)/app/clients/actions";

export const metadata: Metadata = {
  title: "New Client",
};

export default function NewClientPage() {
  return (
    <LedgerFormShell
      eyebrow="Client ledger"
      title="Add client"
      description="Create the business relationship that projects and received payments will attach to."
      backHref="/app/clients"
      backLabel="Back to clients"
    >
      <ClientForm
        action={createClientAction}
        submitLabel="Create client"
        pendingLabel="Creating client..."
      />
    </LedgerFormShell>
  );
}
