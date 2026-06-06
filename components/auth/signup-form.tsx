"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/(auth)/signup/actions";
import { TextField } from "@/components/forms/form-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

export function SignupForm() {
  const [state, action] = useActionState(signupAction, initialState);

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-[#e7c2bd] bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--red)]"
        >
          {state.error}
        </p>
      ) : null}

      <TextField
        id="name"
        label="Your name"
        type="text"
        autoComplete="name"
        placeholder="Aarav Mehta"
        error={state.fieldErrors?.name?.[0]}
      />
      <TextField
        id="email"
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        error={state.fieldErrors?.email?.[0]}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={state.fieldErrors?.password?.[0]}
      />

      <SubmitButton pendingLabel="Creating your account..." immediateLock>
        Create account
      </SubmitButton>
      <p className="text-center text-[0.8rem] leading-5 text-[#657269]">
        By continuing, you are creating a private DueFlow workspace account.
      </p>
    </form>
  );
}
