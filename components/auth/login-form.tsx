"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/login/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

type LoginFormProps = {
  accountCreated?: boolean;
};

export function LoginForm({ accountCreated = false }: LoginFormProps) {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-5">
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

      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        error={state.fieldErrors?.email?.[0]}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        error={state.fieldErrors?.password?.[0]}
      />

      <SubmitButton pendingLabel="Signing you in...">Sign in</SubmitButton>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  error?: string;
};

function FormField({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  error,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-extrabold text-[var(--ink)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--paper-strong)] px-4 py-3 text-sm text-[var(--ink)] shadow-sm transition placeholder:text-[#a0a6a1] hover:border-[#c9c5ba] focus:border-[var(--green)] focus:outline-none focus:ring-2 focus:ring-[var(--green)]/15"
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 text-xs font-semibold text-[var(--red)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
