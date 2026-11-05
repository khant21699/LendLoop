"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CategoryIcon } from "@/components/category-icon";
import { matchesSearch, SearchInput } from "@/components/search-input";

// Read-only. The query returns only { name, category }, so nothing about
// owners can reach this component.
export function PublicToolList() {
  const tools = useQuery(api.tools.listPublic);
  const [search, setSearch] = useState("");

  if (tools === undefined) {
    return (
      <div className="grid animate-pulse gap-3 sm:grid-cols-2" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="sheet h-[4.5rem]" />
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <p className="sheet p-8 text-center text-muted">
        The pegboard is empty. Sign in and be the first to hang something up.
      </p>
    );
  }

  const visible = tools.filter((tool) =>
    matchesSearch(search, tool.name, tool.category),
  );

  return (
    <div className="grid gap-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        label="Search available tools"
        placeholder="Search tools, e.g. drill, ladder, tent"
      />
      {visible.length === 0 ? (
        <p className="sheet p-8 text-center text-muted">
          Nothing matches “{search}”. Sign in to ask your neighbors, or try
          another word.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((tool, i) => (
            <li
              key={`${tool.name}-${i}`}
              className="flex items-center gap-4 border border-border bg-surface px-4 py-4"
            >
              <span className="text-link">
                <CategoryIcon category={tool.category} size={28} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{tool.name}</p>
                <p className="data mt-0.5">{tool.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
