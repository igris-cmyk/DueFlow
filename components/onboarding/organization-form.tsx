"use client";

import { useActionState } from "react";
import { createOrganizationAction } from "@/app/(onboarding)/onboarding/actions";
import { SelectField, TextField } from "@/components/forms/form-field";
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
        label="Workspace or business name"
        type="text"
        autoComplete="organization"
        placeholder="Mehta Interiors"
        error={state.fieldErrors?.name?.[0]}
      />

      <SelectField
        id="businessType"
        label="Business type"
        defaultValue=""
        options={businessTypeOptions}
        placeholder="Choose your business type"
        error={state.fieldErrors?.businessType?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
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
