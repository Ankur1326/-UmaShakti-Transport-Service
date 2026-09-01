// components/bills/PrintItemsTable.tsx
"use client";

import { CHARGE_KEYS, computeBillTotals, computeItemTotal, type BillItemValues } from "@/lib/bill/validations";

const CHARGE_LABELS: Record<(typeof CHARGE_KEYS)[number], string> = {
  freightAmt: "Freight Amt",
  lrCharges: "LR Charges",
  detentionCharges: "Detention Charges",
  unloadingCharges: "Unloading Charges",
  loadingCharges: "Loading Charges",
  gstinCharges: "GSTIN Charges",
};

export function PrintItemsTable({ items }: { items: BillItemValues[] }) {
  const totals = computeBillTotals(items);
  const columnCount = 5 + CHARGE_KEYS.length + 1; // SR/STN/STN/CNS/Date + charges + Total (no action col)

  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr className="bg-slate-100 text-left">
          <th className="border border-slate-300 px-1 py-1">SR NO</th>
          <th className="border border-slate-300 px-1 py-1">Booking STN</th>
          <th className="border border-slate-300 px-1 py-1">To STN</th>
          <th className="border border-slate-300 px-1 py-1">CNS No</th>
          <th className="border border-slate-300 px-1 py-1">Date</th>
          {CHARGE_KEYS.map((key) => (
            <th key={key} className="border border-slate-300 px-1 py-1">{CHARGE_LABELS[key]}</th>
          ))}
          <th className="border border-slate-300 px-1 py-1">Total Charges</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 && (
          <tr>
            <td colSpan={columnCount} className="border border-slate-300 px-2 py-4 text-center text-slate-400">
              No consignments added.
            </td>
          </tr>
        )}
        {items.map((item, index) => (
          <tr key={item.consignmentId ?? index}>
            <td className="border border-slate-300 px-1 py-1 text-center">{index + 1}</td>
            <td className="border border-slate-300 px-1 py-1">{item.bookingStn}</td>
            <td className="border border-slate-300 px-1 py-1">{item.toStn}</td>
            <td className="border border-slate-300 px-1 py-1 font-semibold">{item.cnsNo}</td>
            <td className="border border-slate-300 px-1 py-1">{item.date}</td>
            {CHARGE_KEYS.map((key) => (
              <td key={key} className="border border-slate-300 px-1 py-1 text-right">
                {Number(item[key] || 0).toFixed(2)}
              </td>
            ))}
            <td className="border border-slate-300 px-1 py-1 text-right font-semibold">
              {computeItemTotal(item).toFixed(2)}
            </td>
          </tr>
        ))}
        <tr className="bg-slate-100 font-semibold">
          <td className="border border-slate-300 px-1 py-1 text-right" colSpan={5}>Total</td>
          {CHARGE_KEYS.map((key) => (
            <td key={key} className="border border-slate-300 px-1 py-1 text-right">{totals[key].toFixed(2)}</td>
          ))}
          <td className="border border-slate-300 px-1 py-1 text-right">{totals.totalCharges.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
}