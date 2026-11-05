"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CategoryIcon } from "@/components/category-icon";

// Read-only. The query returns only { name, category }, so nothing about
// owners can reach this component.
export function PublicToolList() {
  const tools = useQuery(api.tools.listPublic);

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

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {tools.map((tool, i) => (
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
  );
}
