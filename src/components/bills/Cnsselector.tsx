"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { searchEligibleConsignments, type ConsignmentListItem } from "@/lib/bill/api";
import { getApiErrorMessage } from "@/lib/api/consignments";
import { useFormContext, useWatch } from "react-hook-form";

interface CnsSelectorProps {
  excludeIds: string[];
  onSelect: (consignment: ConsignmentListItem) => void;
  disabled?: boolean;
}

export function CnsSelector({ excludeIds, onSelect, disabled }: CnsSelectorProps) {
  const { control } = useFormContext() as any;
  const billedToType = useWatch({ control, name: "billedToType" }) as string | undefined;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ConsignmentListItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [partyQuery, setPartyQuery] = useState("");
  const [partySuggestions, setPartySuggestions] = useState<string[]>([]);
  const [partyLoading, setPartyLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [partyFocused, setPartyFocused] = useState(false);

  // Fetch CNS results. If a selectedParty exists and billing type is Consignor
  // or Consignee, pass those to the API so the server can filter by party and
  // exclude already-billed consignments.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const opts: any = { excludeBilled: true };
    if (billedToType === "Consignor" || billedToType === "Consignee") {
      if (selectedParty) {
        opts.partyType = billedToType;
        opts.partyName = selectedParty;
      } else {
        // No selected party: don't fetch CNS results yet — user must pick a party
        setResults([]);
        setLoading(false);
        return;
      }
    }

    searchEligibleConsignments(query, opts)
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
  }, [query, excludeIds, selectedParty, billedToType]);

  // Party-name suggestions: search consignments by name and extract distinct
  // party names to suggest to the user.
  useEffect(() => {
    if (!(billedToType === "Consignor" || billedToType === "Consignee")) return;
    // Fetch when user types or when the input is focused (to show all names)
    if (!partyQuery && !partyFocused) {
      setPartySuggestions([]);
      return;
    }

    let cancelled = false;
    setPartyLoading(true);
    const opts: any = { partyType: billedToType, excludeBilled: true, limit: 100 };
    if (partyQuery) opts.partyName = partyQuery;
    // Query for consignments (possibly unfiltered) and derive unique party names
    searchEligibleConsignments("", opts)
      .then((res) => {
        if (cancelled) return;
        const names = new Set<string>();
        res.forEach((c) => {
          const n = billedToType === "Consignor" ? c.consignor?.name : c.consignee?.name;
          if (n) names.add(n);
        });
        setPartySuggestions(Array.from(names));
      })
      .catch(() => setPartySuggestions([]))
      .finally(() => !cancelled && setPartyLoading(false));

    return () => {
      cancelled = true;
    };
  }, [partyQuery, billedToType, partyFocused]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mb-2 w-full max-w-xs print:hidden">
      {(billedToType === "Consignor" || billedToType === "Consignee") && (
        <div className="mb-2">
          <input
            value={selectedParty ?? partyQuery}
            onChange={(e) => {
              setSelectedParty(null);
              setPartyQuery(e.target.value);
              setOpen(false);
            }}
            onFocus={() => setPartyFocused(true)}
            onBlur={() => setTimeout(() => setPartyFocused(false), 150)}
            placeholder={`Search ${billedToType} name…`}
            className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-1.5 text-[12px]"
            disabled={disabled}
          />

          {partyLoading && <p className="text-[12px] text-slate-400">Searching parties…</p>}
          {!partyLoading && partySuggestions.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {partySuggestions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSelectedParty(p);
                    setPartyQuery("");
                    setOpen(false);
                  }}
                  className="rounded bg-slate-100 px-2 py-1 text-[12px]"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <input
        value={query}
        disabled={disabled || ((billedToType === "Consignor" || billedToType === "Consignee") && !selectedParty)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={
          (billedToType === "Consignor" || billedToType === "Consignee") && !selectedParty
            ? `Select ${billedToType} first…`
            : "Enter CNS No. to add…"
        }
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