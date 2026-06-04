"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { FormActionState } from "@/lib/action-state";
import { getPostAuthDestination } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import { normalizeEmail, signupSchema } from "@/lib/validation/auth";

export async function signupAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const destination = await getPostAuthDestination();

  if (destination) {
    redirect(destination);
  }

  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = normalizeEmail(parsed.data.email);
  const db = getDb();
  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      error: "An account with this email already exists.",
    };
  }

  try {
    const passwordHash = await hash(parsed.data.password, 12);

    await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
      },
      select: { id: true },
    });
  } catch {
    return {
      error: "We could not create your account right now. Please try again.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/onboarding",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?created=1");
    }

    throw error;
  }

  return {};
}
