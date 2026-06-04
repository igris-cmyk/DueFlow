"use client";

import { useActionState } from "react";
import { createOrganizationAction } from "@/app/(onboarding)/onboarding/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";
import {
  businessTypeOptions,
  currencyOptions,
  timezoneOptions,
} from "@/lib/organizations";

const initialState: FormActionState = {};

export function OrganizationForm() {
  const [state, action] = useActionState(
    createOrganizationAction,
    initialState,
  );

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

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-extrabold text-[var(--ink)]"
        >
          Workspace or business name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="organization"
          placeholder="Mehta Interiors"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={
            state.fieldErrors?.name ? "name-error" : undefined
          }
          className="min-h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--paper-strong)] px-4 py-3 text-sm text-[var(--ink)] shadow-sm transition placeholder:text-[#a0a6a1] hover:border-[#c9c5ba] focus:border-[var(--green)] focus:outline-none focus:ring-2 focus:ring-[var(--green)]/15"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p
            id="name-error"
            className="mt-2 text-xs font-semibold text-[var(--red)]"
          >
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>

      <SelectField
        id="businessType"
        label="Business type"
        defaultValue=""
        options={businessTypeOptions}
        placeholder="Choose your business type"
        error={state.fieldErrors?.businessType?.[0]}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="currency"
          label="Currency"
          defaultValue="INR"
          options={currencyOptions}
          error={state.fieldErrors?.currency?.[0]}
        />
        <SelectField
          id="timezone"
          label="Timezone"
          defaultValue="Asia/Kolkata"
          options={timezoneOptions}
          error={state.fieldErrors?.timezone?.[0]}
        />
      </div>

      <SubmitButton pendingLabel="Creating your workspace...">
        Enter DueFlow
      </SubmitButton>
    </form>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  defaultValue: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
};

function SelectField({
  id,
  label,
  defaultValue,
  options,
  placeholder,
  error,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-extrabold text-[var(--ink)]"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--paper-strong)] px-4 py-3 text-sm text-[var(--ink)] shadow-sm transition hover:border-[#c9c5ba] focus:border-[var(--green)] focus:outline-none focus:ring-2 focus:ring-[var(--green)]/15"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
