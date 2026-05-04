import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { classNames } from '@/utils/copy';

const baseField =
  'block w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:opacity-60';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={classNames(baseField, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={classNames(baseField, 'min-h-[88px] resize-y leading-6', className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export function FieldLabel({
  children,
  hint,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex flex-col gap-0.5">
      <span className="text-sm font-medium text-slate-800">
        {children}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function Field({
  label,
  hint,
  required,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <FieldLabel htmlFor={htmlFor} hint={hint} required={required}>
        {label}
      </FieldLabel>
      {children}
    </div>
  );
}
