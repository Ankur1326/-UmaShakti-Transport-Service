import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Validation error message (e.g. from React Hook Form's formState.errors) */
  error?: string;
  helperText?: string;
  /** Optional icon rendered inside the input's left edge (lucide-react icon element) */
  startIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-body-sm font-medium text-neutral-800">
            {label}
            {required && <span className="ml-0.5 text-error-600">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "focus-ring h-11 w-full rounded-lg border border-neutral-300 bg-white px-3.5 text-body text-neutral-900 placeholder:text-neutral-400",
              "transition-colors hover:border-neutral-400",
              startIcon && "pl-10",
              error && "border-error-500 hover:border-error-500 focus-visible:ring-error-500",
              className
            )}
            {...props}
          />
        </div>

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

Input.displayName = "Input";