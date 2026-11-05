"use client";

import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Browse tools">
        Everything your neighbors are willing to lend. Pick one, pick dates, ask
        nicely.
      </PageHeader>

      <AuthGate message="Sign in to browse tools and request to borrow.">
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <label className="field-label sm:w-60">
            Category
            <select
              className="field mt-1"
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
          {tools !== undefined && (
            <p className="data">
              {tools.length} {tools.length === 1 ? "part" : "parts"} on the
              sheet
            </p>
          )}
        </div>

        <div className="mt-4">
          {tools === undefined ? (
            <div className="sheet h-24 animate-pulse" aria-busy="true" />
          ) : tools.length === 0 ? (
            <p className="sheet p-8 text-center text-muted">
              Nothing hanging here{category ? ` under ${category}` : ""}. Try
              another category, or list something yourself.
            </p>
          ) : (
            <ul className="grid gap-px border border-border bg-border">
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
