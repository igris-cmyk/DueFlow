"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/login/actions";
import { TextField } from "@/components/forms/form-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

type LoginFormProps = {
  accountCreated?: boolean;
};

export function LoginForm({ accountCreated = false }: LoginFormProps) {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-4">
      {accountCreated ? (
        <p className="rounded-xl border border-[#bdd7c5] bg-[var(--green-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--green)]">
          Your account is ready. Sign in to continue.
        </p>
      ) : null}
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-[#e7c2bd] bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--red)]"
        >
          {state.error}
        </p>
      ) : null}

      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        error={state.fieldErrors?.email?.[0]}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        error={state.fieldErrors?.password?.[0]}
      />

      <SubmitButton pendingLabel="Signing you in..." immediateLock>
        Sign in
      </SubmitButton>
    </form>
  );
}
