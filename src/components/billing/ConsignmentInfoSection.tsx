"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/billing/FormSection";
import { Input } from "@/components/ui/Input";
import type { BillingFormValues } from "@/lib/validations/billing";

export function ConsignmentInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BillingFormValues>();
  // const [numberLocked, setNumberLocked] = useState(true);

  return (
    <FormSection title="Consignment Information" description="Core details that identify this consignment note.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Input
            label="Consignment No."
            required
            // readOnly={numberLocked}
            className={"pr-10"}
            error={errors.consignmentNumber?.message}
            {...register("consignmentNumber")}
          />
          {/* <button
            type="button"
            onClick={() => setNumberLocked((v) => !v)}
            aria-label={numberLocked ? "Unlock to override consignment number" : "Lock consignment number"}
            title={numberLocked ? "Unlock to override" : "Lock"}
            className="absolute right-3 top-9 text-neutral-400 hover:text-brand-700"
          >
            {numberLocked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Unlock className="h-4 w-4" aria-hidden="true" />}
          </button> */}
        </div>

        <Input
          type="date"
          label="Booking Date"
          required
          error={errors.bookingDate?.message}
          {...register("bookingDate")}
        />

        <Input type="date" label="CNS Date" error={errors.cnsDate?.message} {...register("cnsDate")} />

        <Input
          label="Vehicle Number"
          required
          placeholder="RJ14 GA 3317"
          error={errors.vehicleNumber?.message}
          {...register("vehicleNumber")}
        />

        <Input
          label="E-Way Bill Number"
          placeholder="Optional"
          error={errors.eWayBillNumber?.message}
          {...register("eWayBillNumber")}
        />

        <Input type="datetime-local" label="Valid Up To" error={errors.validUpTo?.message} {...register("validUpTo")} />

        <Input label="Invoice Number" error={errors.invoiceNumber?.message} {...register("invoiceNumber")} />

        <Input type="date" label="Invoice Date" error={errors.invoiceDate?.message} {...register("invoiceDate")} />
      </div>
    </FormSection>
  );
}