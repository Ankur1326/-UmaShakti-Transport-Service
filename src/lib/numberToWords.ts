/**
 * Converts a rupee amount into words using the Indian numbering system
 * (Lakh/Crore) — matches how amounts are written on Indian transport /
 * GST documents, e.g. 125000 -> "One Lakh Twenty Five Thousand Only".
 */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${TENS[t]}${o ? " " + ONES[o] : ""}`;
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} Hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(" ");
}

/** Converts an integer (0 – 999,99,99,999) into Indian-system words, no currency suffix. */
export function integerToIndianWords(value: number): string {
  if (value === 0) return "Zero";
  if (value < 0) return `Minus ${integerToIndianWords(-value)}`;

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const hundred = value % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/** Formats a rupee amount (with paise) as words, e.g. "Rupees One Lakh Twenty Five Thousand Only". */
export function amountToWords(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  const rupees = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - rupees) * 100);

  const rupeeWords = integerToIndianWords(rupees);
  const paiseWords = paise > 0 ? ` and ${integerToIndianWords(paise)} Paise` : "";

  return `Rupees: ${rupeeWords}${paiseWords} Only`;
}

/** Formats a number as Indian-grouped currency, e.g. 1000000 -> "₹10,00,000.00". */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}