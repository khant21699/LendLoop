"use client";

import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthGate } from "@/components/auth-gate";
import { ToolCard } from "@/components/tool-card";
import { CATEGORIES, Category } from "@/convex/lib/categories";

export default function ToolsPage() {
  const { isAuthenticated } = useConvexAuth();
  const [category, setCategory] = useState<Category | "">("");
  const tools = useQuery(
    api.tools.listAll,
    isAuthenticated ? { category: category || undefined } : "skip",
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Browse tools</h1>

      <AuthGate message="Sign in to browse tools and request to borrow.">
        <label className="mt-6 block text-sm font-medium">
          Category
          <select
            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm sm:w-56"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6">
          {tools === undefined ? (
            <div
              className="h-24 animate-pulse rounded-lg border border-border bg-surface"
              aria-busy="true"
            />
          ) : tools.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
              No tools found{category ? ` in ${category}` : ""}.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => (
                <ToolCard key={tool._id} tool={tool} />
              ))}
            </ul>
          )}
        </div>
      </AuthGate>
    </main>
  );
}
