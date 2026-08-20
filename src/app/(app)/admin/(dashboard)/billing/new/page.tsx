"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { CompanyHeader } from "@/components/billing/CompanyHeader";
import { ConsignmentInfoSection } from "@/components/billing/ConsignmentInfoSection";
import { RouteSection } from "@/components/billing/RouteSection";
import { PartyCard } from "@/components/billing/PartyCard";
import { ShipmentDetailsSection } from "@/components/billing/Shipmentdetailssection";
// import { ShipmentDetailsSection } from "@/components/billing/ShipmentDetailsSection";
import { LoadTypeSection } from "@/components/billing/Loadtypesection";
import { TransportDetailsSection } from "@/components/billing/Transportdetailssection";
import { ChargesSection } from "@/components/billing/Chargessection";
import { GstSection } from "@/components/billing/Gstsection";
import { BillingSummary } from "@/components/billing/Billingsummary";
import { PaymentSection } from "@/components/billing/Paymentsection";
import { InsuranceSection } from "@/components/billing/Insurancesection";
import { AdditionalInfoSection } from "@/components/billing/Additionalinfosection";
import { FormActionsBar } from "@/components/billing/Formactionsbar";
import { PrintPreview } from "@/components/billing/Printpreview";

import { billingFormSchema, buildDefaultValues, type BillingFormValues } from "@/lib/validations/billing";
import { generateConsignmentNumber, saveConsignmentNumber } from "@/lib/generateConsignmentNumber";

const DRAFT_STORAGE_KEY = "uts:billing-draft:v1";
const AUTOSAVE_DEBOUNCE_MS = 1200;

function readDraft(): BillingFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BillingFormValues) : null;
  } catch {
    return null;
  }
}

function timeAgoLabel(date: Date | null): string {
  if (!date) return "";
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 5) return "Draft saved just now";
  if (seconds < 60) return `Draft saved ${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  return `Draft saved ${minutes} min${minutes === 1 ? "" : "s"} ago`;
}

export default function TransportBillingFormPage() {
  const [draftBanner, setDraftBanner] = useState<BillingFormValues | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, forceTick] = useState(0);
  const initialNumberRef = useRef(generateConsignmentNumber());

  const methods = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: buildDefaultValues(initialNumberRef.current),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, isSubmitting },
  } = methods;

  // Offer to restore an existing draft rather than silently overwriting it.
  useEffect(() => {
    const existing = readDraft();
    if (existing) setDraftBanner(existing);
  }, []);

  // Re-render the "Draft saved Xs ago" label periodically.
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  // Autosave to localStorage, debounced.
  useEffect(() => {
    const subscription = watch((values) => {
      const handle = setTimeout(() => {
        try {
          window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
          setLastSavedAt(new Date());
        } catch {
          // Storage may be unavailable (private browsing, quota) — fail silently, autosave is a convenience.
        }
      }, AUTOSAVE_DEBOUNCE_MS);
      return () => clearTimeout(handle);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const persistNow = (values: BillingFormValues) => {
    saveConsignmentNumber(values.consignmentNumber);
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    setLastSavedAt(new Date());
  };

  const onSaveDraft = handleSubmit(
    (values) => {
      persistNow(values);
      toast.success(`Draft saved — Consignment No: ${values.consignmentNumber}`);
    },
    () => toast.error("Please fix the highlighted fields before saving.")
  );

  const onGenerateLR = handleSubmit(
    (values) => {
      persistNow(values);
      toast.success(`Consignment saved successfully\nConsignment No: ${values.consignmentNumber}`);
    },
    () => toast.error("Please fix the highlighted fields before generating the LR.")
  );

  const onSaveAndPrint = handleSubmit(
    (values) => {
      persistNow(values);
      setPreviewOpen(true);
    },
    () => toast.error("Please fix the highlighted fields before printing.")
  );

  const onReset = () => {
    const fresh = buildDefaultValues(generateConsignmentNumber());
    reset(fresh);
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    toast.success("Form reset.");
  };

  const values = watch();

  return (
    <FormProvider {...methods}>
      {/* ================================================================ */}
      {/* DRAFT BANNER                                                     */}
      {/* ================================================================ */}

      {draftBanner && (
        <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50/80 px-5 py-4 shadow-sm print:hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <span className="text-sm font-bold">!</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-brand-900">
                  Unsaved draft available
                </p>

                <p className="mt-0.5 text-sm text-brand-700">
                  You have an unsaved draft for Consignment No.{" "}
                  <span className="font-semibold">
                    {draftBanner.consignmentNumber}
                  </span>
                  . Would you like to restore it?
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  reset(draftBanner);
                  setDraftBanner(null);
                  toast.success("Draft restored.");
                }}
                className="focus-ring rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
              >
                Restore Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
                  setDraftBanner(null);
                }}
                aria-label="Dismiss and discard saved draft"
                className="focus-ring rounded-lg p-2 text-brand-700 transition hover:bg-brand-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {previewOpen ? (
        <PrintPreview
          values={values}
          onClose={() => setPreviewOpen(false)}
        />
      ) : (
        <form
          className="pb-32"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* ============================================================ */}
          {/* PAGE HEADER                                                   */}
          {/* ============================================================ */}


          {/* ============================================================ */}
          {/* BILLING SUMMARY                                                */}
          {/* ============================================================ */}

          <div className="mb-4">
            <BillingSummary />
          </div>

          {/* ============================================================ */}
          {/* MAIN FORM                                                      */}
          {/* ============================================================ */}

          <div className="flex flex-wrap items-start gap-3 xl:gap-3">
            {/* ========================================================== */}
            {/* CONSIGNMENT INFORMATION                                    */}
            {/* ========================================================== */}

            <section className="w-full">
              <ConsignmentInfoSection />
            </section>

            {/* ========================================================== */}
            {/* ROUTE                                                       */}
            {/* ========================================================== */}

            <section className="w-full">
              <RouteSection />
            </section>

            {/* ========================================================== */}
            {/* CONSIGNOR                                                   */}
            {/* ========================================================== */}

            <section className="w-full lg:w-[calc(50%-0.75rem)]">
              <PartyCard
                prefix="consignor"
                title="Consignor"
                description="Party sending the goods."
              />
            </section>

            {/* ========================================================== */}
            {/* CONSIGNEE                                                   */}
            {/* ========================================================== */}

            <section className="w-full lg:w-[calc(50%-0.75rem)]">
              <PartyCard
                prefix="consignee"
                title="Consignee"
                description="Party receiving the goods."
              />
            </section>

            {/* ========================================================== */}
            {/* SHIPMENT DETAILS                                            */}
            {/* ========================================================== */}

            <section className="w-full">
              <ShipmentDetailsSection />
            </section>

            {/* ========================================================== */}
            {/* LOAD TYPE                                                   */}
            {/* ========================================================== */}

            <section className="w-full lg:w-[calc(50%-0.75rem)]">
              <LoadTypeSection />
            </section>

            {/* ========================================================== */}
            {/* TRANSPORT DETAILS                                           */}
            {/* ========================================================== */}

            <section className="w-full lg:w-[calc(50%-0.75rem)]">
              <TransportDetailsSection />
            </section>

            {/* ========================================================== */}
            {/* CHARGES                                                     */}
            {/* ========================================================== */}

            <section className="w-full xl:w-[calc(66.666%-0.5rem)]">
              <ChargesSection />
            </section>

            {/* ========================================================== */}
            {/* GST                                                         */}
            {/* ========================================================== */}

            <section className="w-full xl:w-[calc(33.333%-1rem)]">
              <GstSection />
            </section>

            {/* ========================================================== */}
            {/* PAYMENT                                                     */}
            {/* ========================================================== */}

            <section className="w-full lg:w-[calc(50%-0.75rem)]">
              <PaymentSection />
            </section>

            {/* ========================================================== */}
            {/* INSURANCE                                                   */}
            {/* ========================================================== */}

            <section className="w-full lg:w-[calc(50%-0.75rem)]">
              <InsuranceSection />
            </section>

            {/* ========================================================== */}
            {/* ADDITIONAL INFORMATION                                      */}
            {/* ========================================================== */}

            <section className="w-full">
              <AdditionalInfoSection />
            </section>
          </div>

          {/* ============================================================ */}
          {/* VISUAL SPACER                                                 */}
          {/* ============================================================ */}

          <div className="hidden h-10 xl:block" />

          {/* ============================================================ */}
          {/* ACTION BAR                                                    */}
          {/* ============================================================ */}

          <FormActionsBar
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            draftSavedLabel={timeAgoLabel(lastSavedAt)}
            onSaveDraft={onSaveDraft}
            onGenerateLR={onGenerateLR}
            onSaveAndPrint={onSaveAndPrint}
            onPreview={() => setPreviewOpen(true)}
            onReset={onReset}
          />
        </form>
      )}
    </FormProvider>
  );
}