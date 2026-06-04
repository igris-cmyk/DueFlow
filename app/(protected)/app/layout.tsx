import { AppShell } from "@/components/app-shell/app-shell";
import { requireOrganization } from "@/lib/auth/guards";

export default async function ProtectedAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, membership, organization } = await requireOrganization();

  return (
    <AppShell
      user={user}
      membership={membership}
      organization={organization}
    >
      {children}
    </AppShell>
  );
}
