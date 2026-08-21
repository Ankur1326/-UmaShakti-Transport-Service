"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PACKING_TYPES, VOLUME_UNITS, WEIGHT_UNITS } from "@/lib/validations/billing";
import type { BillingFormValues } from "@/lib/validations/billing";

const toOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

export function ShipmentDetailsSection(){
  const {
    register,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const shipmentErrors = errors.shipment;

  return (
    <FormSection title="Shipment Details" description="What's being shipped, how it's packed, and its declared value.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            type="number"
            label="Packages"
            required
            min={1}
            error={shipmentErrors?.packages?.message}
            {...register("shipment.packages")}
          />
          <Select
            label="Packing"
            options={toOptions(PACKING_TYPES)}
            error={shipmentErrors?.packing?.message}
            {...register("shipment.packing")}
          />
          <Input
            label="Classification / Product Code"
            error={shipmentErrors?.classification?.message}
            {...register("shipment.classification")}
          />
        </div>

        <Textarea
          label="Description of Goods"
          placeholder="e.g. Activated Carbon"
          error={shipmentErrors?.description?.message}
          {...register("shipment.description")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="number"
            label="Declared Value (₹)"
            min={0}
            error={shipmentErrors?.declaredValue?.message}
            {...register("shipment.declaredValue")}
          />
          <Input label="Invoice Number" error={shipmentErrors?.invoiceNumber?.message} {...register("shipment.invoiceNumber")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            type="number"
            label="Volume"
            min={0}
            error={shipmentErrors?.volume?.message}
            {...register("shipment.volume")}
          />
          <Select
            label="Volume Unit"
            options={toOptions(VOLUME_UNITS)}
            error={shipmentErrors?.volumeUnit?.message}
            {...register("shipment.volumeUnit")}
          />
          <Input
            type="number"
            label="Actual Weight"
            required
            min={0}
            step="0.01"
            error={shipmentErrors?.actualWeight?.message}
            {...register("shipment.actualWeight")}
          />
          <Select
            label="Weight Unit"
            options={toOptions(WEIGHT_UNITS)}
            error={shipmentErrors?.weightUnit?.message}
            {...register("shipment.weightUnit")}
          />
        </div>
      </div>
    </FormSection>
  );
}
