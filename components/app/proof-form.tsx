"use client";

import { useActionState, useMemo, useState } from "react";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/form-field";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormActionState } from "@/lib/action-state";
import { proofStatusOptions, proofTypeOptions } from "@/lib/proof";

const initialState: FormActionState = {};

type ProofFormProps = {
  action: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  projects: Array<{
    id: string;
    name: string;
    clientName: string;
  }>;
  payments: Array<{
    id: string;
    projectId: string;
    label: string;
  }>;
  submitLabel: string;
  pendingLabel: string;
  redirectTo?: "proof" | "project" | "payment";
  proof?: {
    title: string;
    type: string;
    status: string;
    projectId: string;
    paymentRecordId: string | null;
    description: string | null;
    sourceUrl: string | null;
    fileName: string | null;
    fileUrl: string | null;
  };
};

export function ProofForm({
  action,
  projects,
  payments,
  submitLabel,
  pendingLabel,
  redirectTo = "proof",
  proof,
}: ProofFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [selectedProjectId, setSelectedProjectId] = useState(
    proof?.projectId ?? "",
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    proof?.paymentRecordId ?? "",
  );
  const availablePayments = useMemo(
    () =>
      payments.filter((payment) => payment.projectId === selectedProjectId),
    [payments, selectedProjectId],
  );
  const paymentValue = availablePayments.some(
    (payment) => payment.id === selectedPaymentId,
  )
    ? selectedPaymentId
    : "";

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

      <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
        <TextField
          id="title"
          label="Proof title"
          type="text"
          placeholder="Final invoice approved by client"
          defaultValue={proof?.title ?? ""}
          error={state.fieldErrors?.title?.[0]}
        />
        <SelectField
          id="type"
          label="Proof type"
          options={proofTypeOptions}
          defaultValue={proof?.type ?? "INVOICE"}
          error={state.fieldErrors?.type?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
        <SelectField
          id="projectId"
          label="Project"
          placeholder="Choose a project"
          options={projects.map((project) => ({
            value: project.id,
            label: `${project.clientName} - ${project.name}`,
          }))}
          value={selectedProjectId}
          onChange={(event) => {
            setSelectedProjectId(event.target.value);
            setSelectedPaymentId("");
          }}
          error={state.fieldErrors?.projectId?.[0]}
        />
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
          value={paymentValue}
          onChange={(event) => setSelectedPaymentId(event.target.value)}
          error={state.fieldErrors?.paymentRecordId?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="sourceUrl"
          label="Source/reference URL"
          type="url"
          placeholder="https://..."
          defaultValue={proof?.sourceUrl ?? ""}
          error={state.fieldErrors?.sourceUrl?.[0]}
        />
        <SelectField
          id="status"
          label="Proof status"
          options={proofStatusOptions}
          defaultValue={proof?.status ?? "READY"}
          error={state.fieldErrors?.status?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="fileName"
          label="Reference file name"
          type="text"
          placeholder="invoice-approved.png"
          defaultValue={proof?.fileName ?? ""}
          error={state.fieldErrors?.fileName?.[0]}
        />
        <TextField
          id="fileUrl"
          label="Reference file URL"
          type="url"
          placeholder="https://..."
          defaultValue={proof?.fileUrl ?? ""}
          error={state.fieldErrors?.fileUrl?.[0]}
        />
      </div>

      <TextareaField
        id="description"
        label="Description"
        placeholder="What this proof shows and why it matters for the payment context"
        defaultValue={proof?.description ?? ""}
        error={state.fieldErrors?.description?.[0]}
      />

      <SubmitButton pendingLabel={pendingLabel} immediateLock>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
