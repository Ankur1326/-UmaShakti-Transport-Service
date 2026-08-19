import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely (handles conflicting utility classes).
 * Usage: cn("px-2 py-1", condition && "bg-brand-700", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}