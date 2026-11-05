"use client";

import { NavIcon } from "@/components/ui/icon/nav-icons";

export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <NavIcon name="search" />
      </span>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="field h-11 pl-10"
      />
    </div>
  );
}

// Every word typed must appear somewhere in the searchable text, so
// "power drill" finds "Cordless drill" under Power tools.
export function matchesSearch(query: string, ...fields: string[]) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fields.join(" ").toLowerCase();
  return words.every((word) => haystack.includes(word));
}
