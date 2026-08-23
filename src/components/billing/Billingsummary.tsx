"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { computeBillingTotals } from "@/lib/calculations/billing";
import { amountToWords, formatINR } from "@/lib/numberToWords";
import { cn } from "@/lib/utils";
import type { BillingFormValues } from "@/lib/validations/billing";

export function BillingSummary({ className }: { className?: string }) {
  const { control } = useFormContext<BillingFormValues>();
  const charges = useWatch({ control, name: "charges" });
  const tax = useWatch({ control, name: "tax" });

  const totals = computeBillingTotals(charges, tax);
  const nonZeroLines = totals.lineItems.filter((item) => item.amount > 0);

  return (
    <Card padding="xs" className={cn("rounded-lg", className)}>
      <CardHeader className="mb-1.5">
        <CardTitle className="text-[11.5px] font-bold uppercase tracking-[0.03em] text-brand-800">
          Billing Summary
        </CardTitle>
      </CardHeader>

      {nonZeroLines.length === 0 ? (
        <p className="text-[10.5px] text-neutral-500">Enter charges below to see the calculated total.</p>
      ) : (
        <dl className="flex flex-wrap gap-x-4 gap-y-0.5">
          {nonZeroLines.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[10.5px]">
              <dt className="text-neutral-500">{item.label}:</dt>
              <dd className="font-medium text-neutral-900">{formatINR(item.amount)}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="my-1.5 h-px bg-neutral-200" />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <div className="flex items-center gap-1.5 text-[10.5px]">
          <span className="text-neutral-500">Subtotal:</span>
          <span className="font-medium text-neutral-900">{formatINR(totals.subtotal)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px]">
          <span className="text-neutral-500">GST ({totals.gstPercentage}%):</span>
          <span className="font-medium text-neutral-900">{formatINR(totals.gstAmount)}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold text-neutral-900">Grand Total</span>
          <span className="text-[15px] font-bold text-brand-700">{formatINR(totals.grandTotal)}</span>
        </div>
      </div>

      <p className="mt-1.5 rounded-md bg-neutral-50 px-2 py-1 text-[10px] leading-snug text-neutral-600">
        <span className="font-semibold text-neutral-700">Amount in Words: </span>
        {amountToWords(totals.grandTotal)}
      </p>
    </Card>
  );
}