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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input type="date" label="Expected Delivery Date" error={vehicleErrors?.expectedDeliveryDate?.message} {...register("vehicle.expectedDeliveryDate")} />
        <Select label="Transport Mode" options={TRANSPORT_MODES} error={vehicleErrors?.transportMode?.message} {...register("vehicle.transportMode")} />
        <Input label="Route" placeholder="e.g. Baddi → Solan" error={vehicleErrors?.route?.message} {...register("vehicle.route")} />

        <Input label="Booking Branch" error={vehicleErrors?.branch?.message} {...register("vehicle.branch")} />
        <Input label="Delivery Branch" error={vehicleErrors?.deliveryBranch?.message} {...register("vehicle.deliveryBranch")} />
      </div>
    </FormSection>
  );
}