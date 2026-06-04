import { type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
}

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

export function Field({ label, htmlFor, hint, children }: FieldProps & { children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function TextInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return <input id={id} className={inputClassName} {...props} />;
}

export function NumberInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  return (
    <input
      id={id}
      type="number"
      min={0}
      step="any"
      className={inputClassName}
      {...props}
    />
  );
}

export function SelectInput({
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { id: string }) {
  return (
    <select id={id} className={inputClassName} {...props}>
      {children}
    </select>
  );
}
