/**
 * Freight bill numbering.
 *
 * Format: "<seq>/<FYstart>-<FYend>", e.g. "104/26-27", "105/26-27", then "01/27-28"
 * once the fiscal year rolls over on 1 April.
 *
 * This mirrors your existing `generateConsignmentNumber.ts` local-cache pattern:
 * a synchronous local placeholder for instant UI, plus an async "fetch the real
 * next number from the backend" hook to wire up later. Since the backend isn't
 * built yet, `fetchNextBillNumber` falls back to the same local computation.
 */

const LAST_BILL_STORAGE_KEY = "uts:last-bill-number:v1";

/** e.g. for 27 Aug 2026 -> { startYY: "26", endYY: "27" }; for 5 Apr 2027 -> { startYY: "27", endYY: "28" } */
export function currentFiscalYearLabel(date: Date = new Date()): { startYY: string; endYY: string; label: string } {
  const year = date.getFullYear();
  const isBeforeApril = date.getMonth() < 3; // Jan(0)-Mar(2) still belongs to the FY that started last April
  const startYear = isBeforeApril ? year - 1 : year;
  const startYY = String(startYear).slice(-2);
  const endYY = String(startYear + 1).slice(-2);
  return { startYY, endYY, label: `${startYY}-${endYY}` };
}

function parseBillNumber(billNo: string): { seq: number; label: string } | null {
  const match = billNo.trim().match(/^(\d+)\/(\d{2}-\d{2})$/);
  if (!match) return null;
  return { seq: parseInt(match[1], 10), label: match[2] };
}

function formatBillNumber(seq: number, label: string): string {
  const padded = String(seq).padStart(2, "0"); // matches "01/27-28" style for the new FY
  return `${padded}/${label}`;
}

function readLastBillNumber(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_BILL_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLastBillNumber(billNo: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_BILL_STORAGE_KEY, billNo);
  } catch {
    // best-effort cache only
  }
}

/**
 * Synchronous placeholder — used only for the very first paint before the
 * (eventual) backend lookup resolves. `startingSeq`/`startingLabel` let you
 * seed it once from your last real bill (104/26-27) the first time this runs
 * with no cache yet.
 */
export function generateBillNumber(seedSeq = 104, seedLabel = currentFiscalYearLabel().label): string {
  const { label: nowLabel } = currentFiscalYearLabel();
  const last = readLastBillNumber();
  const parsed = last ? parseBillNumber(last) : null;

  if (!parsed) {
    // No cache yet — seed from the known last physical bill (104/26-27) if we're
    // still in that fiscal year, otherwise start the new year at 01.
    return nowLabel === seedLabel ? formatBillNumber(seedSeq + 1, seedLabel) : formatBillNumber(1, nowLabel);
  }

  if (parsed.label !== nowLabel) {
    // Fiscal year has rolled over since the last bill — reset to 01.
    return formatBillNumber(1, nowLabel);
  }

  return formatBillNumber(parsed.seq + 1, nowLabel);
}

/**
 * Authoritative source: GET /api/admin/bills/next-number (DB-backed, shared
 * across everyone). Falls back to the local per-browser calculation only if
 * that request fails, so the form still works offline / mid-outage.
 */
export async function fetchNextBillNumber(): Promise<string> {
  try {
    const { fetchNextBillNumberFromServer } = await import("@/lib/bill/api");
    return await fetchNextBillNumberFromServer();
  } catch (error) {
    console.warn("Falling back to locally-computed bill number:", error);
    return generateBillNumber();
  }
}