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
    <FormSection title="Vehicle & transport" description="Transport mode, vehicle route and operating branches.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select size="compact" label="Transport Mode" options={TRANSPORT_MODES} error={vehicleErrors?.transportMode?.message} {...register("vehicle.transportMode")} />
        <Input size="compact" label="Route" placeholder="e.g. Baddi → Solan" error={vehicleErrors?.route?.message} {...register("vehicle.route")} />

        <Input size="compact" label="Booking Branch" error={vehicleErrors?.branch?.message} {...register("vehicle.branch")} />
        <Input size="compact" label="Delivery Branch" error={vehicleErrors?.deliveryBranch?.message} {...register("vehicle.deliveryBranch")} />
        <Input size="compact" label="Driver Name" error={vehicleErrors?.driverName?.message} {...register("vehicle.driverName")} />
        <Input size="compact" type="tel" label="Driver Mobile" error={vehicleErrors?.driverMobile?.message} {...register("vehicle.driverMobile")} />
      </div>
    </FormSection>
  );
}