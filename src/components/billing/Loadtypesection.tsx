"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { cn } from "@/lib/utils";
import { LOAD_TYPES, SEGMENTS } from "@/lib/validations/billing";
import type { BillingFormValues } from "@/lib/validations/billing";

function PillGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "focus-ring rounded-full border px-4 py-2 text-body-sm font-medium transition-colors",
              active
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-brand-400 hover:bg-brand-50"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function LoadTypeSection() {
  const { control } = useFormContext<BillingFormValues>();

  return (
    <FormSection title="Segment & Load Type" description="Classifies how this shipment is billed and moved.">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-body-sm font-medium text-neutral-800">Segment</p>
          <Controller
            control={control}
            name="segment"
            render={({ field }) => <PillGroup value={field.value} options={SEGMENTS} onChange={field.onChange} />}
          />
        </div>

        <div>
          <p className="mb-2 text-body-sm font-medium text-neutral-800">Load Type</p>
          <Controller
            control={control}
            name="loadType"
            render={({ field }) => <PillGroup value={field.value} options={LOAD_TYPES} onChange={field.onChange} />}
          />
        </div>
      </div>
    </FormSection>
  );
}