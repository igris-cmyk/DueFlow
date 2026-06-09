"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Download, FileUp, LoaderCircle, Trash2 } from "lucide-react";
import type { FormActionState } from "@/lib/action-state";

const initialState: FormActionState = {};

type ProofFilePanelProps = {
  proofId: string;
  archived: boolean;
  maxFileSizeLabel: string;
  uploadAction: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  removeAction: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  file: {
    name: string;
    typeLabel: string;
    sizeLabel: string;
    uploadedAt: string;
    uploadedBy: string;
    href: string;
  } | null;
};

export function ProofFilePanel({
  proofId,
  archived,
  maxFileSizeLabel,
  uploadAction,
  removeAction,
  file,
}: ProofFilePanelProps) {
  const [uploadState, uploadFormAction] = useActionState(
    uploadAction,
    initialState,
  );
  const [removeState, removeFormAction] = useActionState(
    removeAction,
    initialState,
  );
  const hasFile = Boolean(file);

  return (
    <section className="rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow-soft)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-accent)]">
            Proof file
          </p>
          <h2 className="mt-2 text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
            {hasFile ? "File attached" : "No file attached yet"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--app-text-muted)]">
            {hasFile
              ? "This private file is opened through DueFlow after workspace access is checked."
              : "Upload an invoice, work photo, approval, bill, or payment screenshot for this proof record."}
          </p>
        </div>
        {file ? (
          <Link
            href={file.href}
            target="_blank"
            className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#2a352d]"
          >
            <Download aria-hidden="true" className="size-4" />
            Open file
          </Link>
        ) : null}
      </div>

      {file ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FileDetail label="Name" value={file.name} />
          <FileDetail label="Type" value={file.typeLabel} />
          <FileDetail label="Size" value={file.sizeLabel} />
          <FileDetail label="Uploaded" value={file.uploadedAt} />
          <FileDetail label="Uploaded by" value={file.uploadedBy} wide />
        </dl>
      ) : null}

      {archived ? (
        <p className="mt-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--app-text-muted)]">
          Archived proof records cannot receive file changes.
        </p>
      ) : (
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
          <form action={uploadFormAction} className="space-y-3">
            <input type="hidden" name="proofId" value={proofId} />
            <label
              htmlFor="proofFile"
              className="block text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]"
            >
              {hasFile ? "Replace file" : "Attach file"}
            </label>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                id="proofFile"
                name="proofFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
                className="block min-h-11 w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm font-semibold text-[var(--app-text-soft)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--app-accent-soft)] file:px-3 file:py-1.5 file:text-sm file:font-extrabold file:text-[var(--app-accent)]"
              />
              <UploadButton label={hasFile ? "Replace file" : "Attach file"} />
            </div>
            <p className="text-xs font-semibold leading-5 text-[var(--app-text-muted)]">
              PDF, PNG, JPG, and WebP only. {maxFileSizeLabel} maximum.
            </p>
            <StateMessage state={uploadState} field="proofFile" />
          </form>

          {hasFile ? (
            <form action={removeFormAction} className="lg:pt-6">
              <RemoveButton />
              <StateMessage state={removeState} />
            </form>
          ) : null}
        </div>
      )}
    </section>
  );
}

function FileDetail({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 sm:col-span-2"
          : "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4"
      }
    >
      <dt className="text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-black leading-6 text-[var(--app-text)]">
        {value}
      </dd>
    </div>
  );
}

function UploadButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--app-sidebar)] px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#2a352d] disabled:cursor-wait disabled:opacity-75"
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <FileUp aria-hidden="true" className="size-4" />
      )}
      {pending ? "Uploading..." : label}
    </button>
  );
}

function RemoveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Remove this proof file?")) {
          event.preventDefault();
        }
      }}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#edc7c1] bg-[var(--red-soft)] px-4 text-sm font-extrabold text-[var(--red)] transition hover:border-[var(--red)] disabled:cursor-wait disabled:opacity-75 lg:w-auto"
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <Trash2 aria-hidden="true" className="size-4" />
      )}
      {pending ? "Removing..." : "Remove file"}
    </button>
  );
}

function StateMessage({
  state,
  field,
}: {
  state: FormActionState;
  field?: string;
}) {
  const fieldError = field ? state.fieldErrors?.[field]?.[0] : null;
  const message = fieldError ?? state.error ?? state.success;

  if (!message) {
    return null;
  }

  return (
    <p
      role={state.success ? "status" : "alert"}
      className={
        state.success
          ? "rounded-xl border border-[#bfd8c6] bg-[var(--app-accent-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--app-accent)]"
          : "rounded-xl border border-[#e7c2bd] bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--red)]"
      }
    >
      {message}
    </p>
  );
}
