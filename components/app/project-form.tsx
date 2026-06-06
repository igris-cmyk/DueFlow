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

const statusOptions = [
  { value: "PLANNED", label: "Planned" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "CANCELLED", label: "Cancelled" },
];

const riskOptions = [
  { value: "HEALTHY", label: "Healthy" },
  { value: "ATTENTION", label: "Attention" },
  { value: "AT_RISK", label: "At risk" },
  { value: "DISPUTED", label: "Disputed" },
];

type ProjectFormProps = {
  action: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  clients: Array<{ id: string; name: string }>;
  submitLabel: string;
  pendingLabel: string;
  project?: {
    clientId: string;
    name: string;
    description: string | null;
    status: string;
    totalValue: string;
    startDate: string;
    dueDate: string;
    completionDate: string;
    paymentTerms: string | null;
    riskStatus: string;
  };
};

export function ProjectForm({
  action,
  clients,
  submitLabel,
  pendingLabel,
  project,
}: ProjectFormProps) {
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
        id="clientId"
        label="Client"
        defaultValue={project?.clientId ?? ""}
        placeholder="Choose a client"
        options={clients.map((client) => ({
          value: client.id,
          label: client.name,
        }))}
        error={state.fieldErrors?.clientId?.[0]}
      />

      <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
        <TextField
          id="name"
          label="Project name"
          type="text"
          placeholder="Kitchen renovation phase 2"
          defaultValue={project?.name ?? ""}
          error={state.fieldErrors?.name?.[0]}
        />
        <TextField
          id="totalValue"
          label="Total project value"
          inputMode="decimal"
          placeholder="125000"
          defaultValue={project?.totalValue ?? ""}
          error={state.fieldErrors?.totalValue?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="status"
          label="Project status"
          options={statusOptions}
          defaultValue={project?.status ?? "ACTIVE"}
          error={state.fieldErrors?.status?.[0]}
        />
        <SelectField
          id="riskStatus"
          label="Risk status"
          options={riskOptions}
          defaultValue={project?.riskStatus ?? "HEALTHY"}
          error={state.fieldErrors?.riskStatus?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          id="startDate"
          label="Start date"
          type="date"
          defaultValue={project?.startDate ?? ""}
          error={state.fieldErrors?.startDate?.[0]}
        />
        <TextField
          id="dueDate"
          label="Due date"
          type="date"
          defaultValue={project?.dueDate ?? ""}
          error={state.fieldErrors?.dueDate?.[0]}
        />
        <TextField
          id="completionDate"
          label="Completion date"
          type="date"
          defaultValue={project?.completionDate ?? ""}
          error={state.fieldErrors?.completionDate?.[0]}
        />
      </div>

      <TextareaField
        id="description"
        label="Description"
        placeholder="Scope, milestones, or client context"
        defaultValue={project?.description ?? ""}
        error={state.fieldErrors?.description?.[0]}
      />

      <TextareaField
        id="paymentTerms"
        label="Payment terms"
        placeholder="Example: 40% advance, balance due on handover"
        defaultValue={project?.paymentTerms ?? ""}
        error={state.fieldErrors?.paymentTerms?.[0]}
      />

      <SubmitButton pendingLabel={pendingLabel} immediateLock>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
