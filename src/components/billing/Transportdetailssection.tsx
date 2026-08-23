"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { BillingFormValues } from "@/lib/validations/billing";

const TRANSPORT_MODES = [
  { value: "Road", label: "Road" },
  { value: "Rail", label: "Rail" },
  { value: "Air", label: "Air" },
  { value: "Multimodal", label: "Multimodal" },
];

export function TransportDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const vehicleErrors = errors.vehicle;

  return (
    <FormSection title="Booking & Transport Details" description="Driver, transport mode, and delivery route.">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        
        <Select size="compact" label="Transport Mode" options={TRANSPORT_MODES} error={vehicleErrors?.transportMode?.message} {...register("vehicle.transportMode")} />
        <Input size="compact" label="Route" placeholder="e.g. Baddi → Solan" error={vehicleErrors?.route?.message} {...register("vehicle.route")} />

        <Input size="compact" label="Booking Branch" error={vehicleErrors?.branch?.message} {...register("vehicle.branch")} />
        <Input size="compact" label="Delivery Branch" error={vehicleErrors?.deliveryBranch?.message} {...register("vehicle.deliveryBranch")} />
      </div>
    </FormSection>
  );
}