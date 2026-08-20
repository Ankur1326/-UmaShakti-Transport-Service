import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, required, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-body-sm font-medium text-neutral-800">
            {label}
            {required && <span className="ml-0.5 text-error-600">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "focus-ring w-full resize-y rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-body text-neutral-900 placeholder:text-neutral-400",
            "transition-colors hover:border-neutral-400",
            error && "border-error-500 hover:border-error-500 focus-visible:ring-error-500",
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="mt-1.5 text-body-sm text-error-600">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-body-sm text-neutral-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";