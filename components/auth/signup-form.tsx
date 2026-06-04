"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/(auth)/signup/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

export function SignupForm() {
  const [state, action] = useActionState(signupAction, initialState);

  return (
    <form action={action} className="space-y-5">
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-[#e7c2bd] bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--red)]"
        >
          {state.error}
        </p>
      ) : null}

      <FormField
        id="name"
        label="Your name"
        type="text"
        autoComplete="name"
        placeholder="Aarav Mehta"
        error={state.fieldErrors?.name?.[0]}
      />
      <FormField
        id="email"
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        error={state.fieldErrors?.email?.[0]}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={state.fieldErrors?.password?.[0]}
      />

      <SubmitButton pendingLabel="Creating your account...">
        Create account
      </SubmitButton>
      <p className="text-center text-xs leading-5 text-[#7a817c]">
        By continuing, you are creating a private DueFlow workspace account.
      </p>
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
