"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { FormActionState } from "@/lib/action-state";
import { getPostAuthDestination } from "@/lib/auth/guards";
import { normalizeEmail, loginSchema } from "@/lib/validation/auth";

export async function loginAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const destination = await getPostAuthDestination();

  if (destination) {
    redirect(destination);
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: normalizeEmail(parsed.data.email),
      password: parsed.data.password,
      redirectTo: "/app/today",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type !== "CredentialsSignin") {
        return {
          error: "We could not sign you in right now. Please try again.",
        };
      }

      return {
        error: "Email or password is incorrect.",
      };
    }

    throw error;
  }

  return {};
}
