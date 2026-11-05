import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { CATEGORIES, Category } from "@/convex/lib/categories";

const PAGE_SIZE = 12;

// GET /api/tools/search?q=&category=&availableOnly=&cursor=
// A thin, same-origin API in front of the Convex query. It exists so the
// browser can use fetch + AbortController (a cancelled request is dropped),
// and it keeps the contract small: every parameter is validated here, and the
// caller is identified by their Clerk session, never by a parameter.
export async function GET(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const text = (params.get("q") ?? "").slice(0, 80);
  const category = params.get("category");
  const cursor = params.get("cursor");

  if (category && !CATEGORIES.includes(category as Category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }
  if (cursor && cursor.length > 2000) {
    return NextResponse.json({ error: "Bad cursor" }, { status: 400 });
  }

  try {
    const token = (await getToken()) ?? undefined;
    const result = await fetchQuery(
      api.tools.search,
      {
        text,
        category: (category as Category) || undefined,
        availableOnly: params.get("availableOnly") === "true",
        paginationOpts: { numItems: PAGE_SIZE, cursor: cursor || null },
      },
      { token },
    );
    return NextResponse.json(
      {
        tools: result.page,
        nextCursor: result.isDone ? null : result.continueCursor,
        isDone: result.isDone,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
