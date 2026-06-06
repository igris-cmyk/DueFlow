"use client";

import { useActionState } from "react";
import { TextareaField, TextField, SelectField } from "@/components/forms/form-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

const reliabilityOptions = [
  { value: "UNKNOWN", label: "Unknown" },
  { value: "A", label: "A - Reliable" },
  { value: "B", label: "B - Usually reliable" },
  { value: "C", label: "C - Needs attention" },
  { value: "D", label: "D - High risk" },
];

type ClientFormProps = {
  action: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  submitLabel: string;
  pendingLabel: string;
  client?: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    category: string | null;
    reliabilityGrade: string;
    notes: string | null;
  };
};

export function ClientForm({
  action,
  submitLabel,
  pendingLabel,
  client,
}: ClientFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
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
        label="Client name"
        type="text"
        placeholder="Mehta Interiors"
        autoComplete="organization"
        defaultValue={client?.name ?? ""}
        error={state.fieldErrors?.name?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          placeholder="+91 98765 43210"
          defaultValue={client?.phone ?? ""}
          error={state.fieldErrors?.phone?.[0]}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="client@example.com"
          defaultValue={client?.email ?? ""}
          error={state.fieldErrors?.email?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="category"
          label="Category"
          type="text"
          placeholder="Interior client"
          defaultValue={client?.category ?? ""}
          error={state.fieldErrors?.category?.[0]}
        />
        <SelectField
          id="reliabilityGrade"
          label="Client reliability"
          options={reliabilityOptions}
          defaultValue={client?.reliabilityGrade ?? "UNKNOWN"}
          error={state.fieldErrors?.reliabilityGrade?.[0]}
        />
      </div>

      <TextField
        id="address"
        label="Address"
        type="text"
        placeholder="Business address or project location"
        defaultValue={client?.address ?? ""}
        error={state.fieldErrors?.address?.[0]}
      />

      <TextareaField
        id="notes"
        label="Notes"
        placeholder="Payment behavior, internal context, or contact preferences"
        defaultValue={client?.notes ?? ""}
        error={state.fieldErrors?.notes?.[0]}
      />

      <SubmitButton pendingLabel={pendingLabel}>{submitLabel}</SubmitButton>
    </form>
  );
}
