import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  /** Text for a disabled placeholder option shown when no value is selected. */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, required, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-body-sm font-medium text-neutral-800">
            {label}
            {required && <span className="ml-0.5 text-error-600">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "focus-ring h-11 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3.5 pr-9 text-body text-neutral-900",
              "transition-colors hover:border-neutral-400",
              error && "border-error-500 hover:border-error-500 focus-visible:ring-error-500",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
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

Select.displayName = "Select";