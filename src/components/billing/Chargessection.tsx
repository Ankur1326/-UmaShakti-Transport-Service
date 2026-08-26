"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/Button";
import type { BillingFormValues } from "@/lib/validations/billing";

const CHARGE_FIELDS: { name: keyof BillingFormValues["charges"]; label: string }[] = [
  { name: "freight", label: "Freight" },
  { name: "localGodownCharges", label: "Local Godown Charges" },
  { name: "unloadingCharge", label: "Unloading Charges" },
  { name: "loadingCharge", label: "Loading Charges" },
  { name: "statisticalCharges", label: "Statistical Charges" },
  { name: "localCollectionCharges", label: "Local Collection Charges" },
  // { name: "codCharges", label: "COD Charges" },
];

export function ChargesSection() {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<BillingFormValues>();

  const printHidden = useWatch({ control, name: "charges.printHidden" });

  return (
    <FormSection title="Freight & Charges" description="All charge lines feed the billing summary automatically — no manual totals needed.">
      {/* Header action: toggle hide/show details (affects print output) */}
      <div className="absolute right-2 top-2 bg-gray-100 rounded-md">
        <Button
          variant={printHidden ? "outline" : "ghost"}
          size="sm"
          onClick={() => setValue("charges.printHidden", !printHidden)}
          type="button"
        >
          {printHidden ? "Show Details" : "Hide Details"}
        </Button>
      </div>

      <div className="mb-2">
        {printHidden && <div className="text-sm font-semibold">Freight: To be billed</div>}
      </div>

      <div className={`grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-4 ${printHidden ? 'blur-[1px] focus-within:blur-[0px]' : ''}`}>
        {CHARGE_FIELDS.map(({ name, label }) => (
          <Input
            key={name}
            size="compact"
            type="number"
            min={0}
            step="0.01"
            label={label}
            startIcon={<span className="text-[11px]">₹</span>}
            error={errors.charges?.[name]?.message}
            {...register(`charges.${name}`)}
          />
        ))}
      </div>
    </FormSection>
  );
}