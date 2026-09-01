import { cn } from "@/lib/utils";

/** Shared circular icon button used in the admin top toolbar. */
export const adminToolbarButtonClass = cn(
  "flex h-9 w-9 items-center justify-center rounded-lg",
  "border border-neutral-200 bg-white text-brand-700",
  "transition-colors hover:border-accent-300 hover:bg-accent-50 hover:text-accent-600",
  "dark:border-brand-800 dark:bg-brand-900 dark:text-brand-200",
  "dark:hover:border-accent-500/40 dark:hover:bg-brand-800 dark:hover:text-accent-400",
  "outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40 focus-visible:ring-offset-2",
  "dark:focus-visible:ring-offset-brand-950"
);

export const adminDropdownClass = cn(
  "absolute right-0 mt-2 overflow-hidden rounded-xl border border-neutral-200",
  "bg-white shadow-lg ring-1 ring-black/5",
  "dark:border-brand-800 dark:bg-brand-900 dark:ring-white/5"
);
