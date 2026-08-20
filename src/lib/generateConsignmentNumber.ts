/**
 * Generates a sequential consignment number starting from 1725.
 * Example: UTS-2026-1725, UTS-2026-1726, UTS-2026-1727...
 *
 * The last-used value is stored in localStorage so each new form starts from the previous one.
 * Users can still overwrite the field manually before saving.
 */
const CONSIGNMENT_SEQUENCE_KEY = "uts:consignment-sequence:v1";
const START_NUMBER = 1725;

function readLastUsedNumber(): number {
  if (typeof window === "undefined") return START_NUMBER;

  try {
    const raw = window.localStorage.getItem(CONSIGNMENT_SEQUENCE_KEY);
    if (!raw) return START_NUMBER;

    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= START_NUMBER ? parsed : START_NUMBER;
  } catch {
    return START_NUMBER;
  }
}

export function saveConsignmentNumber(value: string): void {
  if (typeof window === "undefined") return;

  const trimmed = value?.trim();
  if (!trimmed) return;

  const matches = trimmed.match(/\d+/g);
  const parsed = matches ? Number(matches[matches.length - 1]) : NaN;

  if (Number.isFinite(parsed) && parsed >= START_NUMBER) {
    try {
      window.localStorage.setItem(CONSIGNMENT_SEQUENCE_KEY, String(parsed));
    } catch {
      // Ignore storage failures.
    }
  }
}

export function generateConsignmentNumber(): string {
  const hasExistingValue = typeof window !== "undefined" && window.localStorage.getItem(CONSIGNMENT_SEQUENCE_KEY) !== null;
  const lastUsedNumber = readLastUsedNumber();

  if (!hasExistingValue) {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(CONSIGNMENT_SEQUENCE_KEY, String(START_NUMBER));
      } catch {
        // Ignore storage failures.
      }
    }
    return String(START_NUMBER);
  }

  const nextNumber = lastUsedNumber + 1;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSIGNMENT_SEQUENCE_KEY, String(nextNumber));
    } catch {
      // Ignore storage failures.
    }
  }

  return String(nextNumber);
}