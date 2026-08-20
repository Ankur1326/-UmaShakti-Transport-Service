"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { BillingFormValues } from "@/lib/validations/billing";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-ring relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-brand-700" : "bg-neutral-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

export function InsuranceSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const insuranceErrors = errors.insurance;
  const required = useWatch({ control, name: "insurance.required" });

  return (
    <FormSection
      title="Insurance"
      description="Optional — enable if this consignment is covered by insurance."
      headerAction={
        <Controller
          control={control}
          name="insurance.required"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-neutral-600">{field.value ? "Required" : "Not required"}</span>
              <Toggle checked={field.value} onChange={field.onChange} />
            </div>
          )}
        />
      }
    >
      {required && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Insurance Company" error={insuranceErrors?.company?.message} {...register("insurance.company")} />
          <Input label="Policy Number" error={insuranceErrors?.policyNumber?.message} {...register("insurance.policyNumber")} />
          <Input
            type="number"
            min={0}
            label="Insurance Amount (₹)"
            error={insuranceErrors?.amount?.message}
            {...register("insurance.amount")}
          />
          <Input type="date" label="Insurance Date" error={insuranceErrors?.date?.message} {...register("insurance.date")} />
          <Input label="Risk Type" error={insuranceErrors?.riskType?.message} {...register("insurance.riskType")} />
        </div>
      )}
    </FormSection>
  );
}