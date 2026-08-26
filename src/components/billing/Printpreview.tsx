"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/Button"
import { computeBillingTotals } from "@/lib/calculations/billing";
import { amountToWords, formatINR } from "@/lib/numberToWords";
import { siteConfig } from "@/lib/site-config";
import type { BillingFormValues } from "@/lib/validations/billing";

interface PrintPreviewProps {
  values: any;
  onClose: () => void;
}

/* -------------------------------------------------------------------------- */
/* Copy selection                                                             */
/* -------------------------------------------------------------------------- */

const ALL_COPY_NAMES = ["LORRY COPY", "CONSIGNEE COPY", "CONSIGNOR COPY", "FILE COPY"] as const;
type CopyName = (typeof ALL_COPY_NAMES)[number];

const DEFAULT_SELECTED_COPIES: readonly CopyName[] = ["LORRY COPY", "CONSIGNEE COPY"];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function text(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  return String(value);
}

function formatDate(value?: string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB");
}

function rupees(value: unknown) {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* -------------------------------------------------------------------------- */
/* Small Components                                                           */
/* -------------------------------------------------------------------------- */

function SmallLabel({ children }: { children: ReactNode }) {
  return <span className="lr-label">{children}</span>;
}

function LRField({ label, value, className = "" }: { label: string; value?: ReactNode; className?: string }) {
  return (
    <div className={`lr-field ${className}`}>
      <SmallLabel>{label}</SmallLabel>
      <span className="lr-field-value">{value || ""}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Single Copy                                                                */
/* -------------------------------------------------------------------------- */

function LorryCopy({ values, copyName }: { values: BillingFormValues; copyName: CopyName }) {
  const totals = computeBillingTotals(values.charges, values.tax);
  const segment = String(values.segment);
  // console.log("values ", values)
  return (
    <div className="lr-page">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}
      <div className="lr-header">
        {/* COMPANY INFORMATION */}
        <div className="lr-company-section">
          <div className="lr-company-top">
            <div className="lr-logo">
              <Image
                src="/media/UTS-logo-ver.png"
                alt={siteConfig.name || "UMASHAKTI TRANSPORT SERVICE"}
                width={60}
                height={60}
                priority
              />
            </div>
            <div className="lr-company-details">
              <div className="lr-company-name !tracking-tight">{siteConfig.name || "UMASHAKTI TRANSPORT SERVICE"}</div>
              {/* <div className="lr-company-address">{text(siteConfig.address)}</div> */}
              <div className="text-[13.4px]">
                <div className="leading-tight tracking-tighter">
                  <span className="font-bold">H.O. : </span>
                  <span className="font-semibold">90, Shree Siddh Villa, Madhodar Road, Near New Post Office, Waghodia, Dist. Vadodara 391760 <span className="font-bold">Mob.:</span> 9662820706 / 9558008708</span>

                </div>
                <div className="leading-tight tracking-tighter">
                  <span className="font-bold">B.O.: </span>
                  <span className="font-semibold">Plot No. 104/A, Siddhi Industrial Park, Tal. Waghodia, Dist. Vadodara 391 760. E mail : umashakti.brd@gmail.com</span>
                </div>
              </div>
              {/* <div className="lr-company-contact">
                        {text(siteConfig.phone)}
                        {siteConfig.email ? ` • ${siteConfig.email}` : ""}
                      </div> */}
            </div>
          </div>
          <div className="lr-registration flex justify-between px-6  w-full">
            <div className="flex flex-col">
              <span>REG. NO. </span>
              <span>24AAHFU8816H1ZX</span>
            </div>
            <div className="flex flex-col">
              <span>PAN NO. </span>
              <span>AAHFU8816H</span>
            </div>
            {/* <div>PAN NO. AAHFU8816H</div> */}
            <div className="flex flex-col ">
              <span>MSME No.</span>
              <span>UDYAM-GJ-24-0106951</span>
            </div>
          </div>
        </div>

        {/* FROM / TO */}
        <div className="lr-route-section relative">
          <div className="lr-route-row">
            <div className="lr-route-title">FROM</div>
            <div className="lr-route-value">{text(values.from.location)}</div>
          </div>

          <div className="lr-route-row">
            <div className="lr-route-title">TO</div>
            <div className="lr-route-value">{text(values.to.location)}</div>
          </div>

          <div className="lr-delivery-office">
            <SmallLabel>Address of Delivery Office</SmallLabel>
            <div className="lr-handwriting">
              {text(values.to.branch || values.to.location)}
              {values.to.state ? `, ${text(values.to.state)}` : ""}
            </div>
            <div className="lr-mini-row absolute bottom-4 ">
              <span>State :</span>
              <span>{text(values.to.state)}</span>
            </div>
            <div className="lr-mini-row  absolute bottom-1">
              <span>GSTIN :</span>
              <span>{text(values.to.gstin)}</span>
            </div>
          </div>
        </div>

        {/* SEGMENTS */}
        <div className="lr-segment-section">
          <div className="lr-segment-title">SEGMENTS</div>
          {/* "FTL", "LTL", "SUN", "ODC", "MM", "SAARC", "Other" */}
          <div className="lr-segment-options">
            <span className={segment === "FTL" ? "active" : ""}>FTL</span>
            <span className={segment === "LTL" ? "active" : ""}>LTL</span>
            <span className={segment === "SUN" ? "active" : ""}>SUN</span>
            <span className={segment === "ODC" ? "active" : ""}>ODC</span>
            <span className={segment === "MM" ? "active" : ""}>MM</span>
            <span className={segment === "SAARC" ? "active" : ""}>SAARC</span>
            <span className={segment === "Other" ? "active" : ""}>Other</span>
          </div>

          <div className="lr-segment-info">
            <b>Load Type:</b> {text(values.loadType)}
          </div>
          <div className="lr-segment-info">
            <b>Risk:</b> Owner&apos;s Risk
          </div>
          {/* <div className="lr-segment-info">
            <b>Vehicle:</b> {text(values.vehicleNumber)}
          </div> */}
          {/* <div className="lr-segment-info">
            <b>Mode:</b> {text(values.vehicle.transportMode)}
          </div> */}
          <div className="leading-tighter">
            <div className="lr-bank-title lr-segment-title">BANK DETAILS</div>
            <div className="font-semibold tracking-tight text-[12px]  pl-1">{siteConfig.name || "UMASHAKTI TRANSPORT SERVICE"}</div>
            <div className="font-semibold tracking-tight text-[12px]  pl-1">HDFC BANK, Opp. Apollo Tyres, Limda, Waghodia.</div>
            <div className="font-semibold tracking-tight text-[12px]  pl-1">IFSC Code: HDFC0007181 - A/c. No.: 50200983890449</div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* MAIN CONTENT                                                       */}
      {/* ================================================================== */}
      <div className="lr-content ">
        {/* LEFT / MAIN AREA */}
        <div className="lr-main">
          {/* CONSIGNOR / CONSIGNEE */}
          <div className="lr-parties">
            <div className="lr-party">
              {/* <div className="lr-ack-banner">SPACE FOR ACKNOWLEDGEMENT</div> */}
              {/* <div className="lr-ack-footer"> */}
              {/* <div className="lr-copy-date">Date: {formatDate(values.bookingDate)}</div> */}
              {/* <div className="lr-copy-sign">Signature / Stamp</div> */}
              {/* </div> */}
              <div className="lr-ack-banner">CONSIGNOR</div>
              <div className="lr-party-content">
                <SmallLabel>Address</SmallLabel>
                <div className="lr-party-name">{text(values.consignor.name)}</div>
                <div className="lr-party-address">{text(values.consignor.address)}</div>
                <div className="lr-party-address">
                  {text(values.consignor.city)}
                  {values.consignor.state ? `, ${text(values.consignor.state)}` : ""}
                </div>
                <div className="lr-party-detail !text-[15px] !font-normal">GSTIN: {text(values.consignor.gstin)}</div>
                <div className="lr-party-detail">Mobile: {text(values.consignor.mobile)}</div>
              </div>
            </div>

            <div className="lr-party">
              <div className="lr-ack-banner">CONSIGNEE</div>
              <div className="lr-party-content">
                <SmallLabel>Address</SmallLabel>
                <div className="lr-party-name">{text(values.consignee.name)}</div>
                <div className="lr-party-address">{text(values.consignee.address)}</div>
                <div className="lr-party-address">
                  {text(values.consignee.city)}
                  {values.consignee.state ? `, ${text(values.consignee.state)}` : ""}
                </div>
                <div className="lr-party-detail !text-[15px] !font-normal">GSTIN: {text(values.consignee.gstin)}</div>
                <div className="lr-party-detail">Mobile: {text(values.consignee.mobile)}</div>
              </div>
            </div>
          </div>

          {/* SHIPMENT TABLE */}
          <div className="lr-shipment">
            <div className="lr-shipment-body">
              {/* LEFT COLUMN */}
              <div className="lr-shipment-left">
                {/* Row 1: Pkgs / Packing / Private Mark */}
                <div className="lr-row-one">
                  <div className="lr-row-one-cell">
                    <LRField label="Pkgs." value={text(values.shipment.packages)} />
                  </div>
                  <div className="lr-row-one-cell">
                    <LRField label="Packing" value={text(values.shipment.packing)} />
                  </div>
                  <div className="lr-row-one-cell">
                    <LRField label="Private Mark" value="" />
                  </div>
                </div>

                {/* Row 2: Declared Value / Invoice No. / Volume */}
                <div className="lr-shipment-row row-two">
                  <LRField label="Declared Value" value={text("₹" + values.shipment.declaredValue ? values.shipment.declaredValue : 0)} />
                  <LRField
                    label="Invoice No."
                    value={[text(values.invoiceNumber), values.invoiceDate ? formatDate(values.invoiceDate) : ""]
                      .filter(Boolean)
                      .join("  •  ")}
                  />
                  <LRField label="Volume LxBxH - CFT" value={text(values.shipment.volume)} />
                </div>

                {/* Row 3: E-Way Bill / Valid upto */}
                <div className="lr-shipment-row row-three">
                  <LRField label="E-Way Bill No." value={text(values.eWayBillNumber)} />
                  <LRField label="Valid upto" value={formatDate(values.validUpTo)} />
                </div>

                {/* Terms / Description / Classification */}
                <div className="lr-bottom-row-left">
                  <div className="lr-terms-cell relative">
                    <div className="lr-terms-text ">
                      We hereby confirm that particulars of goods packed &amp; declared in invoice are same. Packing of the
                      consignment was done under the supervision. We have read the terms &amp; conditions printed on the face
                      &amp; overleaf of the consignment note.
                    </div>
                    <div className="lr-terms-caption">Description of the goods as declared by Consignor</div>

                    <div className="absolute bottom-0 left-0 w-full flex justify-between items-center px-2 py-1">
                      <div className="lr-copy-sign absolute right-0 bottom-13 w-full text-end pt-32">Consignor's Signature &nbsp;</div>
                      <div className="lr-copy-date border-t border-black w-full pt-3 absolute bottom-3 left-0">&nbsp; Expected Delivery Date: {values.vehicle.expectedDeliveryDate ? formatDate(values.vehicle.expectedDeliveryDate) : "_____________"}</div>
                    </div>
                  </div>

                  <div className="lr-description-cell">
                    <div className="lr-description-inner">
                      <div className="lr-classification-block">
                        <SmallLabel>Classification of Goods</SmallLabel>
                        <div className="lr-goods-value">{text(values.shipment.classification)}</div>
                      </div>
                      <div className="lr-goods-block">
                        <SmallLabel>Description of Goods</SmallLabel>
                        <div className="lr-goods-value">{text(values.shipment.description)}</div>
                      </div>
                    </div>
                    <div className="lr-copy-name-row">
                      <div className="lr-copy-name">{copyName}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lr-shipment-right">
                <div className="lr-cns-vehicle-top">
                  {/* CNS No. and CNS Date now stacked together in a single column */}
                  <div className="lr-cns-cell">
                    <div className="lr-cns-top">
                      <div className="lr-vertical-title lr-cns-label">CNS NO.</div>
                      <strong className="lr-cns-number">{text(values.consignmentNumber)}</strong>
                    </div>
                    <div className="lr-cns-date-row">
                      <span className="lr-label">CNS Date</span>
                      <strong>{formatDate(values.cnsDate)}</strong>
                    </div>
                  </div>

                  <div className="lr-vehicle-cell">
                    <div className="lr-vertical-title lr-cns-label">VEHICLE NO.</div>
                    <strong className="lr-vehicle-number">{text(values.vehicleNumber)}</strong>
                  </div>
                </div>

                <div className="lr-actual-charged-row">
                  <LRField label="Actual Wt." value={`${text(values.shipment.actualWeight)}`} />
                  <LRField label="Charged Wt. as agreed" value={`${text(values.shipment.chargeWeight)}`} />
                </div>

                <div className="lr-ack-cell">
                  <div className="lr-insurance-row">
                    <div className="lr-field">
                      <SmallLabel>Insurance Company Name &amp; Place</SmallLabel>
                      <span className="lr-field-value">
                        {values.insurance.required
                          ? [text(values.insurance.company), text(values.from.location)].filter(Boolean).join(", ")
                          : "Not Insured"}
                      </span>
                    </div>
                    <div className="lr-field">
                      <SmallLabel>Policy No. &amp; Date</SmallLabel>
                      <span className="lr-field-value">
                        {values.insurance.required
                          ? [text(values.insurance.policyNumber), formatDate(values?.insurance?.date)].filter(Boolean).join("  •  ")
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="lr-ack-banner">SPACE FOR ACKNOWLEDGEMENT</div>
                  <div className="lr-ack-footer">
                    <div className="lr-copy-date">Date: {formatDate(values.bookingDate)}</div>
                    <div className="lr-copy-sign">Signature / Stamp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CHARGES */}
        <div className="lr-charges">
          {values.charges.printHidden ? (
            <div className="text-center text-[16px] py-22 border-b border-b-black">
              <span>Freight: To be billed</span>
              {/* <span /> */}
            </div>
          ) : (
            <>
              <div className="lr-charge-header">
                <span>Particulars</span>
                <span>Amount in Rs.</span>
              </div>
              <div className="lr-charge-row">
                <span>Freight</span>
                <span>{rupees(values.charges.freight)}</span>
              </div>
              <div className="lr-charge-row">
                <span>Local Godown Charges</span>
                <span>{rupees(values.charges.localGodownCharges)}</span>
              </div>
              <div className="lr-charge-row">
                <span>Unloading Charge</span>
                <span>{rupees(values.charges.unloadingCharge)}</span>
              </div>
              <div className="lr-charge-row">
                <span>Loading Charge</span>
                <span>{rupees(values.charges.loadingCharge)}</span>
              </div>
              <div className="lr-charge-row">
                <span>Statistical Charges</span>
                <span>{rupees(values.charges.statisticalCharges)}</span>
              </div>
              <div className="lr-charge-row">
                <span>Local Collection Charges</span>
                <span>{rupees(values.charges.localCollectionCharges)}</span>
              </div>
              <div className="lr-charge-row lr-subtotal">
                <strong>SUB TOTAL</strong>
                <strong>{rupees(totals.subtotal)}</strong>
              </div>
              <div className="lr-charge-row">
                <span>GST Charges @ {totals.gstPercentage}%</span>
                <span>{rupees(totals.gstAmount)}</span>
              </div>
              <div className="lr-grand-total">
                <strong>GRAND TOTAL</strong>
                <strong>{rupees(totals.grandTotal)}</strong>
              </div>

              <div className="lr-amount-words">
                <SmallLabel>Amt. in Words</SmallLabel>
                <div>{amountToWords(totals.grandTotal)}</div>
              </div>
            </>
          )}
          {/* <div className="lr-charge-row">
            <span>COD Charges</span>
            <span>{rupees(values.charges.codCharges)}</span>
          </div> */}

          <div className="lr-basis">
            <SmallLabel>Basis of Booking</SmallLabel>
            <div className="lr-checkbox-row">
              <span>{values.payment.type === "To Pay" ? "☑" : "☐"} 1. To Pay</span>
              <span>{values.payment.type === "TBB at" ? "☑" : "☐"} 2. TBB AT WGH</span>
            </div>
            <div className="lr-checkbox-row">
              <span>{values.payment.type === "Paid" ? "☑" : "☐"} 3. Paid</span>
              <span>MR No. ______</span>
            </div>
          </div>

          <div className="lr-gst-payable">
            <SmallLabel>GST Payable by</SmallLabel>
            <div className="lr-checkbox-row">
              <span>{values.payment.billingParty === "Consignor" ? "☑" : "☐"} Consignor</span>
              <span>{values.payment.billingParty === "Consignee" ? "☑" : "☐"} Consignee</span>
              <span>{values.payment.billingParty === "Third Party" ? "☑" : "☐"} UTS</span>
            </div>
          </div>

          <div className="lr-authorized relative">
            <div className="lr-terms-text ">
              Amount of GST are provisional actual amount shall be as per received
              money received to be issued UTS of consionmen
              freight payable by consignor or cons ghee at the time of delivery freicht pavable sbaation cf consignment
            </div>
            <div className="lr-authorized-space" />
            {/* <strong>For {siteConfig.name}</strong> */}
            {/* <div className="lr-authorized-line" /> */}
            <div className="lr-copy-sign absolute left-2 bottom-6 w-full text-start">Signature of Staff___________________</div>

            <div className="lr-copy-sign">Staff Identification No.__________________</div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* FOOTER                                                             */}
      {/* ================================================================== */}
      <div className="lr-footer">
        <div className="lr-footer-text">
          Subject to Vadodara Jurisdiction. Goods carried at owner&apos;s risk unless otherwise agreed. Claims must be made
          according to the terms and conditions of the company.
        </div>
        <strong>{copyName}</strong>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PRINT PREVIEW                                                              */
/* -------------------------------------------------------------------------- */

export function PrintPreview({ values, onClose }: PrintPreviewProps) {
  // Which copies the user wants printed — all four are selected by default.
  const [selectedCopies, setSelectedCopies] = useState<Set<CopyName>>(new Set(DEFAULT_SELECTED_COPIES));

  function toggleCopy(name: CopyName) {
    setSelectedCopies((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedCopies(new Set(ALL_COPY_NAMES));
  }

  function selectNone() {
    setSelectedCopies(new Set());
  }

  const copiesToRender = ALL_COPY_NAMES.filter((name) => selectedCopies.has(name));
  const hasSelection = copiesToRender.length > 0;

  return (
    <div className="lr-preview">
      {/* TOOLBAR — hidden on print */}
      <div className="lr-toolbar print:hidden">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Edit
        </Button>

        {/* COPY SELECTOR — choose which copies get printed */}
        <div className="lr-copy-selector">
          <span className="lr-copy-selector-label">Copies:</span>
          {ALL_COPY_NAMES.map((name) => (
            <label key={name} className="lr-copy-option">
              <input
                type="checkbox"
                checked={selectedCopies.has(name)}
                onChange={() => toggleCopy(name)}
              />
              <span>{name}</span>
            </label>
          ))}
          <button type="button" className="lr-copy-quick-action" onClick={selectAll}>
            All
          </button>
          <button type="button" className="lr-copy-quick-action" onClick={selectNone}>
            None
          </button>
        </div>

        <Button variant="primary" size="sm" onClick={() => window.print()} disabled={!hasSelection}>
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print / Save as PDF
        </Button>
      </div>

      {/* DOCUMENT — only the copies the user selected are rendered / printed */}
      <div className="lr-document">
        {hasSelection ? (
          copiesToRender.map((name) => (
            // <div key={name} className="lr-page-frame">
            <LorryCopy values={values} copyName={name} />
            // {/* </div> */}
          ))
        ) : (
          <div className="lr-no-selection print:hidden">
            Select at least one copy above to preview and print it.
          </div>
        )}
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        /* ============================================================= */
        /* PREVIEW SHELL                                                  */
        /* ============================================================= */

        .lr-preview {
          min-height: 100vh;
          background: #e5e7eb;
          color: #111;
          font-family: Arial, Helvetica, sans-serif;
        }

        .lr-toolbar {
          position: sticky;
          top: 0;
          z-index: 100;
          min-height: 60px;
          padding: 10px 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #fff;
          border-bottom: 1px solid #d1d5db;
        }

        /* ============================================================= */
        /* COPY SELECTOR                                                  */
        /* ============================================================= */

        .lr-copy-selector {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          font-size: 12px;
        }

        .lr-copy-selector-label {
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          font-size: 11px;
        }

        .lr-copy-option {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
          color: #26314a;
          cursor: pointer;
          user-select: none;
        }

        .lr-copy-option input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: #16213e;
          cursor: pointer;
        }

        .lr-copy-quick-action {
          border: 1px solid #d1d5db;
          background: #f9fafb;
          color: #374151;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 4px;
          cursor: pointer;
        }

        .lr-copy-quick-action:hover {
          background: #eef0f2;
        }

        .lr-no-selection {
          max-width: 13in;
          margin: 40px auto;
          padding: 24px;
          text-align: center;
          background: #fff;
          border: 1px dashed #9ca3af;
          border-radius: 6px;
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
        }

        .lr-document {
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        /* ============================================================= */
        /* PAGE                                                           */
        /* Sized to match the A4 landscape printable area (297mm x       */
        /* 210mm) minus a 5mm margin on every side: 287mm x 200mm.       */
        /* Kept identical on screen so the preview matches the printout. */
        /* ============================================================= */

        .lr-page {
  width: 287mm;
  height: 200mm;
  background: #fff;
  border: 1.5px solid #16213e;
  color: #1a1a2e;
  position: relative;
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
  font-size: 12.5px;
  line-height: 1.22;
  letter-spacing: 0.2px;
  display: flex;
  flex-direction: column;
}

        /* ============================================================= */
        /* HEADER                                                         */
        /* ============================================================= */

        .lr-header {
          display: grid;
          grid-template-columns: 38% 37% 25%;
          border-bottom: 1px solid #111;
        }

        .lr-company-section {
          padding: 5px 6px;
          border-right: 1px solid #111;
        }

        .lr-company-top {
          display: flex;
          gap: 7px;
          margin-bottom: 4px;
        }

        .lr-logo {
          width: 70px;
          height: 110px;
          min-width: 60px;
          // border-radius: 50%;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          // color: #172f57;
          // font-size: 15px;
          // font-weight: 900;
          overflow: hidden;
          background: #fff;
          // border: 1px solid #111;
        }

        .lr-logo img {
          width: 100%;
          height: 100%;
          // object-fit: cover;
          // border-radius: 50%;
        }

        .lr-company-name {
          color: #EF6711;
          font-size: 19px;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .lr-company-details {
          font-size: 12px;
          line-height: 1.4;
          color: #3f3f46;
        }

        .lr-company-address {
          margin-bottom: 2px;
        }

        .lr-company-contact {
          margin-bottom: 4px;
          color: #16213e;
          font-weight: 600;
        }

        .lr-registration {
          color: #EF6711;
          font-weight: 700;
          line-height: 1.4;
          font-size: 10.5px;
          margin-bottom: 4px;
          letter-spacing: 0.2px;
        }

        .lr-bank-details {
          font-size: 10.5px;
          line-height: 1.4;
          border-top: 1.5px solid #16213e;
          padding-top: 3px;
          letter-spacing: 0.2px;
          font-weight: 600;
          color: #26314a;
        }

        .lr-bank-title {
          font-weight: 900;
          letter-spacing: 0.5px;
          color: #16213e;
          margin-bottom: 1px;
          font-size: 10.5px;
        }

        /* ============================================================= */
        /* ROUTE                                                          */
        /* ============================================================= */

        .lr-route-section {
          border-right: 1px solid #111;
          font-weight: 600;
          font-size: 13px;
        }

        .lr-route-row {
          height: 30px;
          display: grid;
          grid-template-columns: 52px 1fr;
          border-bottom: 1px solid #111;
          font-weight: 600;
          font-size: 13px;
        }

        .lr-route-title {
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #111;
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.4px;
          color: #000;
        }

        .lr-route-value {
          display: flex;
          align-items: center;
          padding: 0 8px;
          font-size: 17px;
          font-weight: 700;
          color: #16213e;
        }

        .lr-delivery-office {
          padding: 4px 8px;
        }

        .lr-handwriting {
          margin-top: 4px;
          margin-bottom: 3px;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
        }

        .lr-mini-row {
          display: flex;
          gap: 5px;
          margin-top: 2px;
          font-size: 11.5px;
          color: #3f3f46;
        }

        .lr-mini-row span:first-child {
          font-weight: 700;
          color: #16213e;
        }

        /* ============================================================= */
        /* SEGMENTS                                                       */
        /* ============================================================= */

        .lr-segment-section {
          font-size: 11px;
          color: #26314a;
        }

        .lr-segment-title {
          text-align: center;
          font-weight: 900;
          padding: 4px;
          border-bottom: 1px solid #111;
          background: #16213e;
          color: #fff;
          letter-spacing: 0.7px;
          font-size: 11.5px;
        }

        .lr-segment-options {
          display: flex;
          justify-content: space-around;
          padding: 4px 2px;
          border-bottom: 1px solid #111;
          font-weight: 600;
          color: #6b7280;
        }

        .lr-segment-options .active {
          font-weight: 900;
          text-decoration: underline;
          color: #b91c1c;
        }

        .lr-segment-info {
          padding: 3px 6px;
          border-bottom: 1px solid #111;
        }

        .lr-segment-info b {
          color: #16213e;
        }

        /* ============================================================= */
        /* MAIN CONTENT                                                   */
        /* ============================================================= */

        .lr-content {
          flex: 1;
          display: grid;
          grid-template-columns: 75% 25%;
          border-bottom: 1px solid #111;
          min-height: 0;
        }

        .lr-main {
          border-right: 1px solid #111;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* ============================================================= */
        /* PARTIES                                                        */
        /* ============================================================= */

        .lr-parties {
          min-height: 1.95in;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .lr-party {
          // display: flex;
          border-bottom: 1px solid #111;
          border-right: 1px solid #111;
        }

        .lr-party:last-child {
          border-right: 0;
        }

        .lr-vertical-title {
          width: 24px;
          min-width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 10px;
          font-weight: 900;
          border-right: 1px solid #111;
          letter-spacing: 1px;
          background-color: #16213e;
          color: white;
        }

        .lr-party-content {
          padding: 2px 6px;
          flex: 1;
          min-width: 0;
        }

        .lr-label {
          display: block;
          font-size: 9.5px;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 2px;
        }

        .lr-party-name {
          font-size: 17px;
          font-weight: 800;
          color: #16213e;
          margin-bottom: 3px;
        }

        .lr-party-address {
          font-size: 15px;
          line-height: 1.35;
          color: #3f3f46;
          margin-bottom: 2px;
        }

        .lr-party-detail {
          font-size: 12px;
          margin-top: 3px;
          color: #26314a;
          font-weight: 600;
        }

        /* ============================================================= */
        /* SHIPMENT                                                       */
        /* ============================================================= */

        .lr-shipment {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .lr-shipment-body {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .lr-shipment-left {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #111;
        }

        .lr-shipment-right {
          width: 50%;
          min-width: 30%;
          display: flex;
          flex-direction: column;
        }

        .lr-shipment-row {
          display: grid;
          border-bottom: 1px solid #111;
        }

        .lr-shipment-row > * {
          border-right: 1px solid #111;
          padding: 3px 5px;
        }

        .lr-shipment-row > *:last-child {
          border-right: 0;
        }

        .row-two {
          grid-template-columns: 30% 40% 30%;
          min-height: 34px;
        }

        .row-three {
          grid-template-columns: 55% 45%;
          min-height: 34px;
        }

        .lr-field {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .lr-field-value {
          font-size: 13.5px;
          font-weight: 600;
          color: #16213e;
          word-break: break-word;
        }

        /* Row 1 (left column): Pkgs / Packing / Private Mark */
        .lr-row-one {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid #111;
          min-height: 42px;
        }

        .lr-row-one-cell {
          border-right: 1px solid #111;
          padding: 3px 5px;
          display: flex;
          align-items: center;
        }

        .lr-row-one-cell:last-child {
          border-right: 0;
        }

        /* ============================================================= */
        /* CNS NO. / CNS DATE / VEHICLE NO.                               */
        /* ============================================================= */

        .lr-cns-vehicle-top {
          min-height: 100px;
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid #111;
        }

        .lr-cns-cell {
          flex: 1;
          border-right: 1px solid #111;
          display: flex;
          flex-direction: column;
        }

        .lr-vehicle-cell {
          flex: 1;
          display: flex;
          align-items: stretch;
        }

        .lr-cns-label {
          width: 20px;
          min-width: 20px;
          font-size: 9px;
        }

        .lr-cns-top {
          flex: 1;
          min-height: 54px;
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid #111;
        }

        .lr-cns-number {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EF6711;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.4px;
        }

        .lr-vehicle-number {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 800;
          color: #16213e;
          letter-spacing: 0.4px;
        }

        .lr-cns-date-row {
          min-height: 28px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
        }

        .lr-cns-date-row .lr-label {
          margin-bottom: 0;
        }

        .lr-cns-date-row strong {
          font-size: 13px;
          color: #16213e;
          font-weight: 800;
        }

        /* Aligns with row-three on the left */
        .lr-actual-charged-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 34px;
          border-bottom: 1px solid #111;
        }

        .lr-actual-charged-row > * {
          padding: 3px 5px;
          border-right: 1px solid #111;
        }

        .lr-actual-charged-row > *:last-child {
          border-right: 0;
        }

        /* ============================================================= */
        /* BOTTOM ROW: TERMS / DESCRIPTION / CLASSIFICATION / ACK         */
        /* ============================================================= */

        .lr-bottom-row-left {
          display: flex;
          flex: 1;
          min-height: 92px;
        }

        .lr-terms-cell {
          width: 58%;
          padding: 4px;
          border-right: 1px solid #111;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lr-terms-text {
          font-size: 11px;
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: 0.4px;
          text-align: start;
          color: #3f3f46;
        }

        .lr-terms-caption {
          font-size: 12px;
          font-weight: 400;
          color: #16213e;
        }

        .lr-description-cell {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .lr-description-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4px 6px;
        }

        .lr-goods-block {
          padding-top: 5px;
          border-top: 1px dashed #a1a1aa;
        }

        .lr-classification-block {
          padding-bottom: 5px;
        }

        .lr-copy-name-row {
          border-top: 1px solid #111;
          padding: 3px 6px;
        }

        .lr-goods-value {
          margin-top: 5px;
          font-size: 13px;
          font-weight: 700;
          color: #16213e;
          line-height: 1.3;
          word-break: break-word;
        }

        .lr-goods-block .lr-goods-value {
          font-size: 16px;
        }

        .lr-classification-block .lr-goods-value {
          margin-top: 3px;
          font-size: 11px;
          font-weight: 600;
          color: #52525b;
        }

        .lr-ack-cell {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .lr-insurance-row {
          display: grid;
          grid-template-columns: 58% 42%;
          border-bottom: 1px solid #111;
        }

        .lr-insurance-row > * {
          padding: 3px 5px;
          border-right: 1px solid #111;
        }

        .lr-insurance-row > *:last-child {
          border-right: 0;
        }

        .lr-ack-banner {
          text-align: center;
          padding: 4px 4px;
          font-size: 11.5px;
          font-weight: 900;
          color: #fff;
          background: #16213e;
          letter-spacing: 0.5px;
        }

        .lr-ack-footer {
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 5px 7px;
          gap: 8px;
        }

        .lr-copy-name {
          text-align: center;
          color: #EF6711;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.4px;
        }

        .lr-copy-date,
        .lr-copy-sign {
          font-size: 12px;
          color: #52525b;
          font-weight: 600;
        }

        /* ============================================================= */
        /* CHARGES (RIGHT COLUMN)                                         */
        /* ============================================================= */

        .lr-charges {
          font-size: 12.5px;
          display: flex;
          flex-direction: column;
          color: #26314a;
        }

        .lr-charge-header {
          min-height: 22px;
          display: grid;
          grid-template-columns: 60% 40%;
          font-weight: 800;
          border-bottom: 1px solid #111;
          background: #16213e;
          color: #fff;
          letter-spacing: 0.3px;
        }

        .lr-charge-header span {
          display: flex;
          align-items: center;
          padding: 3px 6px;
          border-right: 1px solid rgba(255, 255, 255, 0.25);
        }

        .lr-charge-header span:last-child {
          border-right: 0;
          justify-content: flex-end;
        }

        .lr-charge-row {
          min-height: 19px;
          display: grid;
          grid-template-columns: 60% 40%;
          border-bottom: 1px solid #111;
        }

        .lr-charge-row > * {
          padding: 2.5px 6px;
          border-right: 1px solid #111;
          font-weight: 600;
        }

        .lr-charge-row > *:last-child {
          border-right: 0;
          text-align: right;
          font-weight: 700;
          color: #16213e;
        }

        .lr-subtotal {
          font-weight: 800;
          background: #f4f5f7;
        }

        .lr-subtotal strong {
          color: #16213e;
        }

        .lr-grand-total {
          min-height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 8px;
          border-bottom: 1px solid #111;
          font-size: 14px;
          color: #fff;
          background: #EF6711;
          letter-spacing: 0.3px;
        }

        .lr-amount-words {
          min-height: 50px;
          padding: 5px 6px;
          border-bottom: 1px solid #111;
        }

        .lr-amount-words > div:last-child {
          margin-top: 4px;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 700;
          color: #16213e;
        }

        /* ============================================================= */
        /* PAYMENT                                                        */
        /* ============================================================= */

        .lr-basis {
          min-height: 46px;
          padding: 5px 6px;
          border-bottom: 1px solid #111;
        }

        .lr-checkbox-row {
          display: flex;
          justify-content: space-between;
          gap: 4px;
          margin-top: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #26314a;
        }

        .lr-cod-row {
          min-height: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px;
          border-bottom: 1px solid #111;
          font-weight: 700;
        }

        .lr-gst-payable {
          min-height: 38px;
          padding: 5px 6px;
          border-bottom: 1px solid #111;
        }

        .lr-authorized {
          flex: 1;
          padding: 5px 6px;
          text-align: start;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .lr-authorized-space {
          flex: 1;
          min-height: 16px;
        }

        .lr-authorized strong {
          display: block;
          font-size: 10.5px;
          color: #16213e;
        }

        .lr-authorized-line {
          width: 80%;
          margin: 12px auto 3px;
          border-top: 1px solid #111;
        }

        .lr-authorized span {
          font-size: 10.5px;
          color: #6b7280;
        }

        /* ============================================================= */
        /* FOOTER                                                         */
        /* ============================================================= */

        .lr-footer {
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          font-size: 10px;
          background: #f7f7f8;
          border-top: 1px solid #111;
        }

        .lr-footer-text {
          max-width: 85%;
          color: #52525b;
          font-weight: 500;
        }

        .lr-footer strong {
          color: #b91c1c;
          white-space: nowrap;
          letter-spacing: 0.3px;
          font-size: 11px;
        }

        /* ============================================================= */
        /* SCREEN RESPONSIVE                                              */
        /* ============================================================= */

        // @media (max-width: 1200px) {
        //   .lr-document {
        //     overflow-x: auto;
        //   }
        // }

        /* ============================================================= */
        /* PRINT                                                          */
        /* A4 landscape with a 5mm margin on every side. The printable    */
        /* area is 287mm x 200mm, which .lr-page is sized to fill         */
        /* exactly — no larger, so nothing is cut off by the printer.     */
        /* ============================================================= */

        @media print {
            @page {
              size: A4 landscape;
              margin: 5mm;
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100%;
              background: white !important;
            }

            .lr-preview {
              min-height: 0 !important;
              background: white !important;
            }

            .lr-toolbar {
              display: none !important;
            }

            .lr-document {
              display: block !important;
              padding: 0 !important;
              gap: 0 !important;
            }

            /* .lr-page is already a fixed 287mm x 200mm — that alone fills exactly
              one printable page with no gap and no overflow, so there's no longer
              any need for a wrapping frame, vh sizing, or flex centering. Those
              were the actual source of the blank-page bug: vh is computed
              inconsistently across browsers/OSes in print contexts and can end up
              a fraction over one page, spilling an almost-empty page 2. */
            .lr-page {
              width: 287mm;
              height: 200mm;
              margin: 0 !important;
              border: 1px solid #111;
              box-shadow: none !important;
            }

            /* Break before every copy that has a preceding sibling — i.e. every
              page except the first. With only one copy selected, there is no
              earlier sibling, so this selector simply never matches — a
              single-copy print can never produce an extra page, guaranteed
              (unlike page-break-after + :last-child, which Chrome sometimes still
              fires even when :last-child should cancel it). */
            .lr-page + .lr-page {
              page-break-before: always;
              break-before: page;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        }
      `}</style>
    </div>
  );
}