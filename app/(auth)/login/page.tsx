import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getPostAuthDestination } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your DueFlow cashflow command center.",
};

type LoginPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const destination = await getPostAuthDestination();

  if (destination) {
    redirect(destination);
  }

  const { created } = await searchParams;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Return to your cash desk."
      description="Sign in to keep pending money, proof, promises, and follow-ups connected to the right workspace."
      footer={
        <>
          New to DueFlow?{" "}
          <Link href="/signup" className="font-extrabold text-[var(--green)]">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm accountCreated={created === "1"} />
    </AuthShell>
  );
}
