import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const controlClassName =
  "min-h-12 w-full rounded-xl border border-[#d5d0c4] bg-[#fffefa] px-4 py-3 text-[0.95rem] text-[var(--ink)] shadow-[0_1px_2px_rgba(27,31,29,0.04)] transition placeholder:text-[#7b8780] hover:border-[#bdb7aa] focus:border-[var(--green)] focus:outline-none focus:ring-4 focus:ring-[var(--green)]/10";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
};

export function TextField({
  id,
  label,
  error,
  className,
  name,
  ...props
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[var(--ink)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={name ?? id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClassName, className)}
        {...props}
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 text-[0.8rem] font-semibold leading-5 text-[var(--red)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
};

export function SelectField({
  id,
  label,
  options,
  placeholder,
  error,
  className,
  name,
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[var(--ink)]"
      >
        {label}
      </label>
      <select
        id={id}
        name={name ?? id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClassName, className)}
        {...props}
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
          className="mt-2 text-[0.8rem] font-semibold leading-5 text-[var(--red)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextareaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> & {
  id: string;
  label: string;
  error?: string;
};

export function TextareaField({
  id,
  label,
  error,
  className,
  name,
  ...props
}: TextareaFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[var(--ink)]"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name ?? id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClassName, "min-h-32 resize-y", className)}
        {...props}
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 text-[0.8rem] font-semibold leading-5 text-[var(--red)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
