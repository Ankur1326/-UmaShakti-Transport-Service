"use client";

import { useFormContext } from "react-hook-form";
import type { FreightBillFormValues } from "@/lib/bill/validations";

export function BillMetaSection() {
  const { register, formState: { errors } } = useFormContext<FreightBillFormValues>();

  return (
    <div className="grid grid-cols-1 gap-2 border-b border-slate-300 py-2 sm:grid-cols-3">
      <label className="flex items-center gap-2 text-[12px]">
        <span className="w-20 shrink-0 font-semibold">BILL STN</span>
        <input
          {...register("billStn")}
          placeholder="e.g. WGH"
          className="focus-ring w-full rounded border border-slate-300 px-2 py-1 uppercase"
        />
      </label>
      {errors.billStn && <p className="col-span-3 -mt-1 text-[11px] text-red-600">{errors.billStn.message}</p>}

      <label className="flex items-center gap-2 text-[12px]">
        <span className="w-20 shrink-0 font-semibold">BILL NO</span>
        <input
          {...register("billNo")}
          className="focus-ring w-full rounded border border-slate-300 px-2 py-1"
        />
      </label>

      <label className="flex items-center gap-2 text-[12px]">
        <span className="w-20 shrink-0 font-semibold">DATE</span>
        <input
          type="date"
          {...register("billDate")}
          className="focus-ring w-full rounded border border-slate-300 px-2 py-1"
        />
      </label>
    </div>
  );
}