"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Read-only. The query returns only { name, category }, so nothing about
// owners can reach this component.
export function PublicToolList() {
  const tools = useQuery(api.tools.listPublic);

  if (tools === undefined) {
    return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="h-20 animate-pulse rounded-lg border border-border bg-surface"
          />
        ))}
      </ul>
    );
  }

  if (tools.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
        No tools available right now. Check back soon, or sign in to list one.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => (
        <li
          key={`${tool.name}-${i}`}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <p className="font-medium">{tool.name}</p>
          <p className="mt-1 text-sm text-muted">{tool.category}</p>
        </li>
      ))}
    </ul>
  );
}
