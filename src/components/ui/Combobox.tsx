"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxItem {
  id: string;
  label: string;
  subLabel?: string;
}

interface ComboboxProps {
  label?: string;
  placeholder?: string;
  items: ComboboxItem[];
  onSelect: (item: ComboboxItem) => void;
  /** Rendered as a trailing row in the results list, e.g. "+ Add New Customer". */
  onCreateNew?: () => void;
  createNewLabel?: string;
  className?: string;
}

export function Combobox({
  label,
  placeholder = "Search…",
  items,
  onSelect,
  onCreateNew,
  createNewLabel = "+ Add New",
  className,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const filtered =
    query.trim().length === 0
      ? items
      : items.filter((item) => `${item.label} ${item.subLabel ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-body-sm font-medium text-neutral-800">
          {label}
        </label>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="focus-ring h-11 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-9 text-body text-neutral-900 placeholder:text-neutral-400 transition-colors hover:border-neutral-400"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {open && (
        <div
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-card-hover"
        >
          {filtered.length === 0 && (
            <p className="px-3.5 py-2.5 text-body-sm text-neutral-500">No matches found.</p>
          )}
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item);
                setQuery("");
                setOpen(false);
              }}
              className="flex w-full flex-col items-start px-3.5 py-2.5 text-left hover:bg-neutral-50"
            >
              <span className="text-body-sm font-medium text-neutral-900">{item.label}</span>
              {item.subLabel && <span className="text-caption text-neutral-500">{item.subLabel}</span>}
            </button>
          ))}
          {onCreateNew && (
            <button
              type="button"
              onClick={() => {
                onCreateNew();
                setOpen(false);
              }}
              className="flex w-full items-center px-3.5 py-2.5 text-left text-body-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              {createNewLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}