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
  followUpPriorityOptions,
  followUpStatusOptions,
} from "@/lib/follow-up-options";

const initialState: FormActionState = {};

type FollowUpFormProps = {
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
  promises: Array<{
    id: string;
    projectId: string;
    label: string;
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
  followUp?: {
    projectId: string;
    promiseId: string | null;
    paymentRecordId: string | null;
    proofId: string | null;
    title: string;
    dueDate: string;
    channel: string | null;
    priority: string;
    status?: string;
    message: string | null;
    notes: string | null;
  };
  submitLabel: string;
  pendingLabel: string;
  redirectTo?: "follow-up" | "project" | "promise";
  showStatus?: boolean;
};

export function FollowUpForm({
  action,
  projects,
  promises,
  payments,
  proofs,
  followUp,
  submitLabel,
  pendingLabel,
  redirectTo = "follow-up",
  showStatus = false,
}: FollowUpFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [selectedProjectId, setSelectedProjectId] = useState(
    followUp?.projectId ?? "",
  );
  const availablePromises = useMemo(
    () => promises.filter((promise) => promise.projectId === selectedProjectId),
    [promises, selectedProjectId],
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
          id="title"
          label="Follow-up title"
          type="text"
          placeholder="Follow up on pending balance"
          defaultValue={followUp?.title ?? ""}
          error={state.fieldErrors?.title?.[0]}
        />
        <TextField
          id="dueDate"
          label="Due date"
          type="date"
          defaultValue={followUp?.dueDate ?? ""}
          error={state.fieldErrors?.dueDate?.[0]}
        />
        <SelectField
          id="channel"
          label="Channel"
          options={channelOptions}
          defaultValue={followUp?.channel ?? "WHATSAPP"}
          error={state.fieldErrors?.channel?.[0]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="promiseId"
          label="Linked promise"
          options={[
            { value: "", label: "No promise link" },
            ...availablePromises.map((promise) => ({
              value: promise.id,
              label: promise.label,
            })),
          ]}
          defaultValue={followUp?.promiseId ?? ""}
          error={state.fieldErrors?.promiseId?.[0]}
        />
        <SelectField
          id="priority"
          label="Priority"
          options={followUpPriorityOptions}
          defaultValue={followUp?.priority ?? "NORMAL"}
          error={state.fieldErrors?.priority?.[0]}
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
          defaultValue={followUp?.paymentRecordId ?? ""}
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
          defaultValue={followUp?.proofId ?? ""}
          error={state.fieldErrors?.proofId?.[0]}
        />
      </div>

      {showStatus ? (
        <SelectField
          id="status"
          label="Follow-up status"
          options={followUpStatusOptions}
          defaultValue={followUp?.status ?? "OPEN"}
          error={state.fieldErrors?.status?.[0]}
        />
      ) : null}

      <TextareaField
        id="message"
        label="Manual message"
        placeholder="Write the respectful message you want to copy manually."
        defaultValue={followUp?.message ?? ""}
        error={state.fieldErrors?.message?.[0]}
      />

      <TextareaField
        id="notes"
        label="Internal note"
        placeholder="Any private context for this follow-up"
        defaultValue={followUp?.notes ?? ""}
        error={state.fieldErrors?.notes?.[0]}
      />

      <p className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
        DueFlow never sends this message. Copy it manually only after you review it.
      </p>

      <SubmitButton pendingLabel={pendingLabel} immediateLock>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
