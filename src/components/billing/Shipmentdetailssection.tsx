"use client";

import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PACKING_TYPES } from "@/lib/validations/billing";
import type { BillingFormValues } from "@/lib/validations/billing";

const toOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

export function ShipmentDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  const shipmentErrors = errors.shipment;

  return (
    <FormSection title="Shipment Details" description="What's being shipped, how it's packed, and its declared value.">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Input
            size="compact"
            type="number"
            label="Packages"
            min={1}
            error={shipmentErrors?.packages?.message}
            {...register("shipment.packages")}
          />
          <Select
            size="compact"
            label="Packing"
            options={toOptions(PACKING_TYPES)}
            error={shipmentErrors?.packing?.message}
            {...register("shipment.packing")}
          />
          <Input
            size="compact"
            label="Classification / Product Code"
            error={shipmentErrors?.classification?.message}
            {...register("shipment.classification")}
          />
          <Input
            size="compact"
            type="number"
            min={0}
            step="0.01"
            label="Declared Value (₹)"
            error={shipmentErrors?.declaredValue?.message}
            {...register("shipment.declaredValue")}
          />
          <Input size="compact" label="Invoice Number" error={errors.invoiceNumber?.message} {...register("invoiceNumber")} />

          <Input size="compact" type="date" label="Invoice Date" error={errors.invoiceDate?.message} {...register("invoiceDate")} />
          <Input
            size="compact"
            type="number"
            label="Volume LxBXH = CFT"
            min={0}
            step="0.01"
            error={shipmentErrors?.volume?.message}
            {...register("shipment.volume")}
          />
          <Input
            size="compact"
            type="number"
            label="Actual Weight"
            min={0}
            step="0.01"
            error={shipmentErrors?.actualWeight?.message}
            {...register("shipment.actualWeight")}
          />

          <Input
            size="compact"
            type="number"
            label="Charged Wt. as agreed"
            min={0}
            step="0.01"
            error={shipmentErrors?.chargeWeight?.message}
            {...register("shipment.chargeWeight")}
          />
          <Input
            size="compact"
            type="date"
            label="Acknowledgement Date"
            error={errors.bookingDate?.message}
            {...register("bookingDate")}
          />
          <Input
            size="compact"
            type="date"
            label="Expected Delivery Date"
            {...register("vehicle.expectedDeliveryDate")}
          />
          <Textarea
            size="compact"
            rows={3}
            className="col-span-full w-full"
            label="Description of Goods"
            placeholder="e.g. Activated Carbon"
            error={shipmentErrors?.description?.message}
            {...register("shipment.description")}
          />
        </div>

      </div>
    </FormSection>
  );
}