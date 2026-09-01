"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { searchEligibleConsignments, type ConsignmentListItem } from "@/lib/bill/api";
import { getApiErrorMessage } from "@/lib/api/consignments";

interface CnsSelectorProps {
  excludeIds: string[];
  onSelect: (consignment: ConsignmentListItem) => void;
  disabled?: boolean;
}

/**
 * Type-ahead for CNS No. Only shows consignments that are NOT already on the
 * bill and whose payment.status !== "Paid" (filtering for the latter happens
 * inside searchEligibleConsignments).
 */
export function CnsSelector({ excludeIds, onSelect, disabled }: CnsSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConsignmentListItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchEligibleConsignments(query)
      .then((res) => {
        if (cancelled) return;
        setResults(res.filter((c) => !excludeIds.includes(c._id)));
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error(getApiErrorMessage(error, "Couldn't load consignments."));
        setResults([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query, excludeIds]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mb-2 w-full max-w-xs print:hidden">
      <input
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Enter CNS No. to add…"
        className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12px] disabled:bg-slate-100"
      />

      {open && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {loading && <p className="px-3 py-2 text-[12px] text-slate-400">Searching…</p>}

          {!loading && results.length === 0 && (
            <p className="px-3 py-2 text-[12px] text-slate-400">No unpaid consignments match.</p>
          )}

          {!loading &&
            results.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => {
                  onSelect(c);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-[12px] hover:bg-brand-50"
              >
                <span className="font-semibold">CNS {c.consignmentNumber}</span>
                <span className="text-slate-500">
                  {c.from?.location} → {c.to?.location} · Bill to: {c.payment?.billingParty || "—"}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}