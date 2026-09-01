"use client";

interface FreightBillFormActionsBarProps {
    isSubmitting: boolean;
    // onSaveDraft: () => void;
    onSaveAndPrint: () => void;
    onPreview: () => void;
    onReset: () => void;
}

export function FreightBillFormActionsBar({ isSubmitting, onSaveAndPrint, onPreview, onReset }: FreightBillFormActionsBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-end gap-2 border-t border-slate-200 bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] print:hidden">
            <button
                type="button"
                onClick={onReset}
                className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
                Reset
            </button>
            <button
                type="button"
                onClick={onPreview}
                disabled={isSubmitting}
                className="focus-ring rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
            >
                Print
            </button>
            <button
                type="button"
                onClick={onSaveAndPrint}
                disabled={isSubmitting}
                className="focus-ring rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
            >
                Save &amp; Print
            </button>
        </div>
    );
}