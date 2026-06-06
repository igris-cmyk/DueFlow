import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateClientAction } from "@/app/(protected)/app/clients/actions";
import { ClientForm } from "@/components/app/client-form";
import { LedgerFormShell } from "@/components/app/ledger-form-shell";
import { requireOrganization } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";

type EditClientPageProps = {
  params: Promise<{ clientId: string }>;
};

export const metadata: Metadata = {
  title: "Edit Client",
};

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { clientId } = await params;
  const { organization } = await requireOrganization();
  const client = await getDb().client.findFirst({
    where: { id: clientId, organizationId: organization.id },
  });

  if (!client) {
    notFound();
  }

  const action = updateClientAction.bind(null, client.id);

  return (
    <LedgerFormShell
      eyebrow="Client ledger"
      title="Edit client"
      description="Keep contact details and reliability context current for this organization."
      backHref={`/app/clients/${client.id}`}
      backLabel="Back to client"
    >
      <ClientForm
        action={action}
        submitLabel="Save client"
        pendingLabel="Saving client..."
        client={client}
      />
    </LedgerFormShell>
  );
}
