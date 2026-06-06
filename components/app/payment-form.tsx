"use client";

import { useActionState } from "react";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/form-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

type PaymentFormProps = {
  action: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  projects: Array<{
    id: string;
    name: string;
    clientName: string;
    pendingAmount: string;
  }>;
  submitLabel: string;
  pendingLabel: string;
  payment?: {
    projectId: string;
    amount: string;
    paidDate: string;
    method: string | null;
    referenceNumber: string | null;
    notes: string | null;
  };
};

export function PaymentForm({
  action,
  projects,
  submitLabel,
  pendingLabel,
  payment,
}: PaymentFormProps) {
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

      <SelectField
        id="projectId"
        label="Project"
        defaultValue={payment?.projectId ?? ""}
        placeholder="Choose a project"
        options={projects.map((project) => ({
          value: project.id,
          label: `${project.clientName} - ${project.name} (${project.pendingAmount} pending)`,
        }))}
        error={state.fieldErrors?.projectId?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="amount"
          label="Received amount"
          inputMode="decimal"
          placeholder="25000"
          defaultValue={payment?.amount ?? ""}
          error={state.fieldErrors?.amount?.[0]}
        />
        <TextField
          id="paidDate"
          label="Received date"
          type="date"
          defaultValue={payment?.paidDate ?? ""}
          error={state.fieldErrors?.paidDate?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="method"
          label="Method"
          type="text"
          placeholder="UPI, bank transfer, cash"
          defaultValue={payment?.method ?? ""}
          error={state.fieldErrors?.method?.[0]}
        />
        <TextField
          id="referenceNumber"
          label="Reference"
          type="text"
          placeholder="Transaction or receipt reference"
          defaultValue={payment?.referenceNumber ?? ""}
          error={state.fieldErrors?.referenceNumber?.[0]}
        />
      </div>

      <TextareaField
        id="notes"
        label="Notes"
        placeholder="Any context for this received payment"
        defaultValue={payment?.notes ?? ""}
        error={state.fieldErrors?.notes?.[0]}
      />

      <SubmitButton pendingLabel={pendingLabel}>{submitLabel}</SubmitButton>
    </form>
  );
}
