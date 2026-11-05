import { useCallback, useEffect, useRef, useState } from "react";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { Category } from "@/convex/lib/categories";

export type SearchedTool = FunctionReturnType<
  typeof api.tools.search
>["page"][number];

type Params = { q: string; category: Category | ""; availableOnly: boolean };

type PageResponse = {
  tools: SearchedTool[];
  nextCursor: string | null;
  isDone: boolean;
};

type State = {
  key: string; // which search these results belong to
  tools: SearchedTool[];
  cursor: string | null;
  isDone: boolean;
  error: string | null;
  loadingMore: boolean;
};

async function fetchPage(
  { q, category, availableOnly }: Params,
  cursor: string | null,
  signal: AbortSignal,
): Promise<PageResponse> {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (category) search.set("category", category);
  if (availableOnly) search.set("availableOnly", "true");
  if (cursor) search.set("cursor", cursor);

  const response = await fetch(`/api/tools/search?${search}`, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

// Server-side search with pagination. When the inputs change, the previous
// request is aborted so a slow, stale response can never overwrite a newer one.
// Pass an already-debounced `q`.
export function useToolSearch({ q, category, availableOnly }: Params) {
  const key = JSON.stringify([q, category, availableOnly]);
  const [state, setState] = useState<State | null>(null);
  const [attempt, setAttempt] = useState(0); // bumped by retry()
  const moreController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchPage({ q, category, availableOnly }, null, controller.signal)
      .then((page) =>
        setState({
          key,
          tools: page.tools,
          cursor: page.nextCursor,
          isDone: page.isDone,
          error: null,
          loadingMore: false,
        }),
      )
      .catch(() => {
        if (controller.signal.aborted) return; // superseded, not a failure
        setState({
          key,
          tools: [],
          cursor: null,
          isDone: true,
          error: "Couldn't load tools. Check your connection and try again.",
          loadingMore: false,
        });
      });

    return () => {
      controller.abort();
      moreController.current?.abort();
    };
  }, [key, q, category, availableOnly, attempt]);

  const loadMore = useCallback(() => {
    if (!state || state.isDone || state.loadingMore || state.cursor === null) {
      return;
    }
    const controller = new AbortController();
    moreController.current = controller;
    setState({ ...state, loadingMore: true });

    fetchPage({ q, category, availableOnly }, state.cursor, controller.signal)
      .then((page) =>
        setState((prev) =>
          prev && prev.key === key
            ? {
                ...prev,
                tools: [...prev.tools, ...page.tools],
                cursor: page.nextCursor,
                isDone: page.isDone,
                loadingMore: false,
              }
            : prev,
        ),
      )
      .catch(() => {
        if (controller.signal.aborted) return;
        setState((prev) =>
          prev
            ? { ...prev, loadingMore: false, error: "Couldn't load more." }
            : prev,
        );
      });
  }, [state, q, category, availableOnly, key]);

  return {
    // Old results stay visible (dimmed by the page) while a new search loads.
    tools: state?.tools ?? [],
    isLoading: state === null || state.key !== key,
    loadingMore: state?.loadingMore ?? false,
    hasMore: state !== null && !state.isDone,
    error: state?.error ?? null,
    loadMore,
    retry: () => setAttempt((n) => n + 1),
  };
}
