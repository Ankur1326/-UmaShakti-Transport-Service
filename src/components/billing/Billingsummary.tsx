"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { computeBillingTotals } from "@/lib/calculations/billing";
import { amountToWords, formatINR } from "@/lib/numberToWords";
import type { BillingFormValues } from "@/lib/validations/billing";

export function BillingSummary({ className }: { className?: string }) {
  const { control } = useFormContext<BillingFormValues>();
  const charges = useWatch({ control, name: "charges" });
  const tax = useWatch({ control, name: "tax" });

  const totals = computeBillingTotals(charges, tax);
  const nonZeroLines = totals.lineItems.filter((item) => item.amount > 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>

      <dl className="space-y-2">
        {nonZeroLines.length === 0 ? (
          <p className="text-body-sm text-neutral-500">Enter charges above to see the calculated total.</p>
        ) : (
          nonZeroLines.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-body-sm">
              <dt className="text-neutral-600">{item.label}</dt>
              <dd className="font-medium text-neutral-900">{formatINR(item.amount)}</dd>
            </div>
          ))
        )}
      </dl>

      <div className="my-4 h-px bg-neutral-200" />

      <div className="flex items-center justify-between text-body-sm">
        <span className="text-neutral-600">Subtotal</span>
        <span className="font-medium text-neutral-900">{formatINR(totals.subtotal)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-body-sm">
        <span className="text-neutral-600">GST ({totals.gstPercentage}%)</span>
        <span className="font-medium text-neutral-900">{formatINR(totals.gstAmount)}</span>
      </div>

      <div className="my-4 h-px bg-neutral-200" />

      <div className="flex items-center justify-between">
        <span className="text-h4 font-semibold text-neutral-900">Grand Total</span>
        <span className="text-h3 font-bold text-brand-700">{formatINR(totals.grandTotal)}</span>
      </div>

      <p className="mt-3 rounded-lg bg-neutral-50 p-3 text-caption leading-relaxed text-neutral-600">
        <span className="font-semibold text-neutral-700">Amount in Words: </span>
        {amountToWords(totals.grandTotal)}
      </p>
    </Card>
  );
}