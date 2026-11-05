"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";
import { ToolCard } from "@/components/tool-card";
import { CATEGORIES, Category } from "@/convex/lib/categories";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useToolSearch } from "@/lib/use-tool-search";

export function ToolBrowser() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // Typing is instant, but a request only goes out once typing pauses.
  const q = useDebouncedValue(search.trim(), 350);
  const { tools, isLoading, loadingMore, hasMore, error, loadMore, retry } =
    useToolSearch({ q, category, availableOnly });

  const filtered = search !== "" || category !== "" || availableOnly;
  const settling = isLoading || search.trim() !== q;

  function clearFilters() {
    setSearch("");
    setCategory("");
    setAvailableOnly(false);
  }

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_15rem]">
        <SearchInput
          value={search}
          onChange={setSearch}
          label="Search tools"
          placeholder="Search tools, e.g. drill, ladder, tent"
        />
        <label className="sr-only" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          className="field h-11"
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
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available now only
        </label>
        <div className="flex items-center gap-4" aria-live="polite">
          <p className="data">
            {settling
              ? "Searching..."
              : `${tools.length} shown${hasMore ? ", more available" : ""}`}
          </p>
          {filtered && (
            <button onClick={clearFilters} className="link-quiet text-sm">
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {error ? (
          <div role="alert" className="sheet p-8 text-center text-muted">
            <p>{error}</p>
            <button onClick={retry} className="btn btn-outline mt-4">
              Try again
            </button>
          </div>
        ) : isLoading && tools.length === 0 ? (
          <div className="sheet h-24 animate-pulse" aria-busy="true" />
        ) : tools.length === 0 ? (
          <div className="sheet p-8 text-center text-muted">
            {filtered ? (
              <p>
                Nothing matches{search ? ` “${search}”` : " those filters"}. Try
                fewer words or{" "}
                <button onClick={clearFilters} className="link-quiet">
                  clear the filters
                </button>
                .
              </p>
            ) : (
              <p>
                The board is bare.{" "}
                <Link href="/listings" className="link-quiet">
                  List the first tool
                </Link>
                .
              </p>
            )}
          </div>
        ) : (
          <>
            <ul
              className={`grid gap-px border border-border bg-border transition-opacity ${
                settling ? "opacity-60" : ""
              }`}
            >
              {tools.map((tool) => (
                <ToolCard key={tool._id} tool={tool} />
              ))}
            </ul>
            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn btn-outline"
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
