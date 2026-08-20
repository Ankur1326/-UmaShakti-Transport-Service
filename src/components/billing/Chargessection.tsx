"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import type { BillingFormValues } from "@/lib/validations/billing";

const CHARGE_FIELDS: { name: keyof BillingFormValues["charges"]; label: string }[] = [
  { name: "freight", label: "Freight" },
  { name: "localGodownCharges", label: "Local Godown Charges" },
  { name: "unloadingCharge", label: "Unloading Charges" },
  { name: "loadingCharge", label: "Loading Charges" },
  { name: "statisticalCharges", label: "Statistical Charges" },
  { name: "localCollectionCharges", label: "Local Collection Charges" },
  { name: "codCharges", label: "COD Charges" },
];

export function ChargesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BillingFormValues>();

  return (
    <FormSection title="Freight & Charges" description="All charge lines feed the billing summary automatically — no manual totals needed.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHARGE_FIELDS.map(({ name, label }) => (
          <Input
            key={name}
            type="number"
            min={0}
            step="0.01"
            label={label}
            startIcon={<span className="text-body-sm">₹</span>}
            error={errors.charges?.[name]?.message}
            {...register(`charges.${name}`)}
          />
        ))}
      </div>
    </FormSection>
  );
}