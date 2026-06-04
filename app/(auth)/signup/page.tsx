import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getPostAuthDestination } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a DueFlow account and set up your cashflow command center.",
};

export default async function SignupPage() {
  const destination = await getPostAuthDestination();

  if (destination) {
    redirect(destination);
  }

  return (
    <AuthShell
      eyebrow="Start free"
      title="Create your DueFlow account."
      description="Set up the secure foundation for your business workspace. You will name the workspace in the next step."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-extrabold text-[var(--green)]">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
