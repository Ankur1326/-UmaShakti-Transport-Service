"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { BILLING_PARTIES } from "@/lib/validations/billing";
import type { FreightBillFormValues } from "@/lib/bill/validations";

/**
 * Consigner / Consignee / Third Party toggle.
 *
 * - Consignor / Consignee: fields are read-only here — they get populated
 *   automatically (in the parent page) from the first CNS added to the bill,
 *   based on that consignment's own consignor/consignee sub-document.
 * - Third Party: fields unlock for manual entry.
 */
export function BilledToSection() {
  const { register, control, formState: { errors } } = useFormContext<FreightBillFormValues>();
  const billedToType = useWatch({ control, name: "billedToType" });
  const isThirdParty = billedToType === "Third Party";

  return (
    <div className="border-b border-slate-300 py-2">
      <div className="mb-2 flex gap-4 text-[12px] font-semibold">
        {BILLING_PARTIES.map((option) => (
          <label key={option} className="flex items-center gap-1.5">
            <input type="radio" value={option} {...register("billedToType")} className="focus-ring" />
            {option}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-1 text-[12px] sm:grid-cols-2">
        <input
          {...register("billedTo.name")}
          disabled={!isThirdParty}
          placeholder="Party name"
          className="focus-ring col-span-2 rounded border border-slate-300 px-2 py-1 font-bold uppercase disabled:bg-slate-100"
        />
        <input
          {...register("billedTo.address")}
          disabled={!isThirdParty}
          placeholder="Address"
          className="focus-ring col-span-2 rounded border border-slate-300 px-2 py-1 disabled:bg-slate-100"
        />
        <input
          {...register("billedTo.gstin")}
          disabled={!isThirdParty}
          placeholder="GSTIN"
          className="focus-ring rounded border border-slate-300 px-2 py-1 disabled:bg-slate-100"
        />
        <input
          {...register("billedTo.mobile")}
          disabled={!isThirdParty}
          placeholder="Mobile"
          className="focus-ring rounded border border-slate-300 px-2 py-1 disabled:bg-slate-100"
        />
      </div>
      {errors.billedTo?.name && <p className="mt-1 text-[11px] text-red-600">{errors.billedTo.name.message}</p>}
    </div>
  );
}