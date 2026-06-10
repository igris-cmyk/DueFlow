"use client";

import { useActionState, useMemo, useState } from "react";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/form-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";
import {
  channelOptions,
  promiseStatusOptions,
} from "@/lib/follow-up-options";

const initialState: FormActionState = {};

type PromiseFormProps = {
  action: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  projects: Array<{
    id: string;
    name: string;
    clientName: string;
    pendingLabel: string;
  }>;
  payments: Array<{
    id: string;
    projectId: string;
    label: string;
  }>;
  proofs: Array<{
    id: string;
    projectId: string;
    label: string;
  }>;
  promise?: {
    projectId: string;
    paymentRecordId: string | null;
    proofId: string | null;
    promisedAmount: string;
    promisedDate: string;
    channel: string | null;
    promiseText: string;
    status?: string;
  };
  submitLabel: string;
  pendingLabel: string;
  redirectTo?: "promise" | "project";
  showStatus?: boolean;
};

export function PromiseForm({
  action,
  projects,
  payments,
  proofs,
  promise,
  submitLabel,
  pendingLabel,
  redirectTo = "promise",
  showStatus = false,
}: PromiseFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [selectedProjectId, setSelectedProjectId] = useState(
    promise?.projectId ?? "",
  );
  const availablePayments = useMemo(
    () => payments.filter((payment) => payment.projectId === selectedProjectId),
    [payments, selectedProjectId],
  );
  const availableProofs = useMemo(
    () => proofs.filter((proof) => proof.projectId === selectedProjectId),
    [proofs, selectedProjectId],
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

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
        placeholder="Choose a project"
        value={selectedProjectId}
        onChange={(event) => setSelectedProjectId(event.target.value)}
        options={projects.map((project) => ({
          value: project.id,
          label: `${project.clientName} - ${project.name} (${project.pendingLabel} pending)`,
        }))}
        error={state.fieldErrors?.projectId?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          id="promisedAmount"
          label="Promised amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="12000"
          defaultValue={promise?.promisedAmount ?? ""}
          error={state.fieldErrors?.promisedAmount?.[0]}
        />
        <TextField
          id="promisedDate"
          label="Promised date"
          type="date"
          defaultValue={promise?.promisedDate ?? ""}
          error={state.fieldErrors?.promisedDate?.[0]}
        />
        <SelectField
          id="channel"
          label="Channel"
          options={channelOptions}
          defaultValue={promise?.channel ?? "WHATSAPP"}
          error={state.fieldErrors?.channel?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="paymentRecordId"
          label="Linked payment"
          options={[
            { value: "", label: "No payment link" },
            ...availablePayments.map((payment) => ({
              value: payment.id,
              label: payment.label,
            })),
          ]}
          defaultValue={promise?.paymentRecordId ?? ""}
          error={state.fieldErrors?.paymentRecordId?.[0]}
        />
        <SelectField
          id="proofId"
          label="Linked proof"
          options={[
            { value: "", label: "No proof link" },
            ...availableProofs.map((proof) => ({
              value: proof.id,
              label: proof.label,
            })),
          ]}
          defaultValue={promise?.proofId ?? ""}
          error={state.fieldErrors?.proofId?.[0]}
        />
      </div>

      {showStatus ? (
        <SelectField
          id="status"
          label="Promise status"
          options={promiseStatusOptions}
          defaultValue={promise?.status ?? "OPEN"}
          error={state.fieldErrors?.status?.[0]}
        />
      ) : null}

      <TextareaField
        id="promiseText"
        label="Promise note"
        placeholder="Client said they will clear the pending balance after approval."
        defaultValue={promise?.promiseText ?? ""}
        error={state.fieldErrors?.promiseText?.[0]}
      />

      <p className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
        Promises do not update payment totals. Record an actual payment to
        update project balances.
      </p>

      <SubmitButton pendingLabel={pendingLabel} immediateLock>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
