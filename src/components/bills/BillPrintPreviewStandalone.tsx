"use client";

import { useForm, FormProvider } from "react-hook-form";
import { FreightBillPrintPreview } from "@/components/bills/Freightbillprintpreview";
import type { FreightBillFormValues } from "@/lib/bill/validations";
import type { FreightBillRecord } from "@/lib/bill/api";

interface BillPrintPreviewStandaloneProps {
  bill: FreightBillRecord;
  onClose: () => void;
}

/** Lets FreightBillPrintPreview (which reads from form context) be reused
 *  outside the live edit form — e.g. printing a saved bill straight from
 *  the bills list, with no form actually being edited. */
export function BillPrintPreviewStandalone({ bill, onClose }: BillPrintPreviewStandaloneProps) {
  const methods = useForm<FreightBillFormValues>({ defaultValues: bill });

  return (
    <FormProvider {...methods}>
      <FreightBillPrintPreview onClose={onClose} />
    </FormProvider>
  );
}