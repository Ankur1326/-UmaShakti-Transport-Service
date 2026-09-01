"use client";

import { FreightBillHeader } from "@/components/bills/Freightbillheader";
import { useFormContext, useWatch } from "react-hook-form";
import { amountInWords, BillItemValues, computeBillTotals, type FreightBillFormValues } from "@/lib/bill/validations";
import { PrintItemsTable } from "@/components/bills/PrintItemsTable";

const COMPANY_BANK_DETAILS = {
    companyName: "UMASHAKTI TRANSPORT SERVICE",
    bankName: "HDFC BANK",
    acNo: "50200083890449",
    ifsc: "HDFC0007181",
    branchAddress: "OPP APOLLO TYRES LIMDA WAGHODIA -391760",
};

interface FreightBillPrintPreviewProps {
    onClose: () => void;
}

export function FreightBillPrintPreview({ onClose }: FreightBillPrintPreviewProps) {
    const { control } = useFormContext<FreightBillFormValues>();
    const values = useWatch({ control });
    const items = values.items ?? [];
    const totals = computeBillTotals(items as never);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-2 print:static print:bg-transparent print:p-0">
            {/* Widened from max-w-3xl — an 11-column table needs real width, both on
          screen and (via the @media print block below) on the printed page. */}
            <div className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow-xl print:max-w-none print:rounded-none print:p-0 print:shadow-none">
                <div className="mb-4 flex justify-end gap-2 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="focus-ring rounded-lg bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-800"
                    >
                        Print
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="focus-ring rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>

                {/* Outer frame — the reference bill is a single bordered box top to
            bottom, not a set of loosely bottom-ruled sections. */}
                <div className="border border-slate-900 p-1">
                    <FreightBillHeader />

                    <div className="grid grid-cols-2 border-b border-slate-900 text-sm">
                        <div className="border-r border-slate-900 p-3">
                            <p className="text-base font-bold uppercase">{values.billedTo?.name}</p>
                            <p className="mt-0.5">{values.billedTo?.address}</p>
                            {values.billedTo?.gstin && (
                                <p className="mt-1.5 font-semibold">GSTIN:- {values.billedTo.gstin}</p>
                            )}
                        </div>
                        <div className="space-y-1 p-3">
                            <p>
                                <span className="inline-block w-24 font-bold">BILL STN</span> : {values.billStn}
                            </p>
                            <p>
                                <span className="inline-block w-24 font-bold">BILL NO</span> : {values.billNo}
                            </p>
                            <p>
                                <span className="inline-block w-24 font-bold">DATE</span> : {values.billDate}
                            </p>
                        </div>
                    </div>

                    <PrintItemsTable items={(items as BillItemValues[]) ?? []} />

                    <div className="border-t border-slate-900 px-3 py-2 text-sm">
                        <p>
                            GST on Reverse Charge To be paid by; {values.billedToType?.toUpperCase()}{" "}
                            {values.billedTo?.gstin ? `(${values.billedTo.gstin})` : ""}
                        </p>
                        <p className="mt-1 font-semibold">Amount in words :- {amountInWords(totals.totalCharges)}</p>
                    </div>

                    <div className="grid grid-cols-2 border-t border-slate-900 text-sm">
                        <div className="space-y-1 p-3">
                            <p><span className="inline-block w-32 font-bold">Company Name</span>{COMPANY_BANK_DETAILS.companyName}</p>
                            <p><span className="inline-block w-32 font-bold">Bank Name</span>{COMPANY_BANK_DETAILS.bankName}</p>
                            <p><span className="inline-block w-32 font-bold">A/c No</span>{COMPANY_BANK_DETAILS.acNo}</p>
                            <p><span className="inline-block w-32 font-bold">IFSC</span>{COMPANY_BANK_DETAILS.ifsc}</p>
                            <p><span className="inline-block w-32 font-bold">Branch Address</span>{COMPANY_BANK_DETAILS.branchAddress}</p>
                        </div>
                        <div className="flex items-end justify-end p-3 text-base font-bold">
                            For, Umashakti Transport Service
                        </div>
                    </div>

                    {values.vehicleNumber && (
                        <p className="border-t border-slate-900 px-3 py-2 text-sm">Vehicle Number :- {values.vehicleNumber}</p>
                    )}

                    {values.remark && (
                        <p className="border-t border-slate-900 px-3 py-2 text-sm">REMARK :- {values.remark}</p>
                    )}
                </div>
            </div>
        </div>
    );
}