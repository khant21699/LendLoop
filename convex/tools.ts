import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireUser } from "./lib/auth";
import { categoryValidator } from "./lib/categories";

const MAX_NAME = 80;
const MAX_CONDITION = 40;
const MAX_DESCRIPTION = 500;

// The client is untrusted, so every text field is trimmed and length-checked here.
function cleanText(value: string, label: string, max: number, required = true) {
  const text = value.trim();
  if (required && text.length === 0)
    throw new ConvexError(`${label} is required`);
  if (text.length > max)
    throw new ConvexError(`${label} must be at most ${max} characters`);
  return text;
}

export const create = mutation({
  args: {
    name: v.string(),
    category: categoryValidator,
    condition: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    // ownerId comes from the verified caller, never from an argument.
    return await ctx.db.insert("tools", {
      ownerId: user._id,
      name: cleanText(args.name, "Name", MAX_NAME),
      category: args.category,
      condition: cleanText(args.condition, "Condition", MAX_CONDITION),
      description: cleanText(
        args.description,
        "Description",
        MAX_DESCRIPTION,
        false,
      ),
    });
  },
});

// Only the owner can edit, including admins: admins moderate by removing, not rewriting.
export const update = mutation({
  args: {
    toolId: v.id("tools"),
    name: v.string(),
    category: categoryValidator,
    condition: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { toolId, ...fields }) => {
    const user = await requireUser(ctx);
    const tool = await ctx.db.get(toolId);
    if (tool === null) throw new ConvexError("Tool not found");
    if (tool.ownerId !== user._id) throw new ConvexError("Not allowed");

    await ctx.db.patch(toolId, {
      name: cleanText(fields.name, "Name", MAX_NAME),
      category: fields.category,
      condition: cleanText(fields.condition, "Condition", MAX_CONDITION),
      description: cleanText(
        fields.description,
        "Description",
        MAX_DESCRIPTION,
        false,
      ),
    });
  },
});

// The owner or an admin can remove a tool. Removal is blocked while a request
// is pending or a loan is approved, so nobody loses a tool mid-loan or has a
// request silently vanish.
export const remove = mutation({
  args: { toolId: v.id("tools") },
  handler: async (ctx, { toolId }) => {
    const user = await requireUser(ctx);
    const tool = await ctx.db.get(toolId);
    if (tool === null) throw new ConvexError("Tool not found");
    if (tool.ownerId !== user._id && user.role !== "admin") {
      throw new ConvexError("Not allowed");
    }

    const loans = await ctx.db
      .query("loans")
      .withIndex("by_tool", (q) => q.eq("toolId", toolId))
      .collect();
    if (loans.some((l) => l.status === "pending" || l.status === "approved")) {
      throw new ConvexError(
        "Resolve open requests and loans for this tool first",
      );
    }

    await ctx.db.delete(toolId);
  },
});

// Public, no auth. Returns ONLY name and category: no ids, no owner fields.
// A tool is hidden while it is out on an approved loan that has started
// (overdue loans stay approved until returned, so they stay hidden too).
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const tools = await ctx.db.query("tools").order("desc").take(200);

    const available = [];
    for (const tool of tools) {
      const loans = await ctx.db
        .query("loans")
        .withIndex("by_tool", (q) => q.eq("toolId", tool._id))
        .collect();
      const isOut = loans.some(
        (l) => l.status === "approved" && l.startDate <= today,
      );
      if (!isOut) available.push({ name: tool.name, category: tool.category });
    }
    return available;
  },
});

// The caller's own tools. Returns [] (not an error) until the users row exists,
// because this can run a moment before the first-sign-in row is created.
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];
    return await ctx.db
      .query("tools")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
  },
});

// Every tool, for signed-in users, with availability. Owner details are not
// included: only whether the tool is the caller's own.
export const listAll = query({
  args: { category: v.optional(categoryValidator) },
  handler: async (ctx, { category }) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];

    const tools =
      category === undefined
        ? await ctx.db.query("tools").order("desc").take(200)
        : await ctx.db
            .query("tools")
            .withIndex("by_category", (q) => q.eq("category", category))
            .order("desc")
            .take(200);

    const now = new Date().toISOString().slice(0, 10);
    return await Promise.all(
      tools.map(async (tool) => {
        const loans = await ctx.db
          .query("loans")
          .withIndex("by_tool", (q) => q.eq("toolId", tool._id))
          .collect();
        const current = loans.find(
          (l) => l.status === "approved" && l.startDate <= now,
        );
        return {
          _id: tool._id,
          name: tool.name,
          category: tool.category,
          condition: tool.condition,
          description: tool.description,
          isMine: tool.ownerId === user._id,
          onLoanUntil: current ? current.endDate : null,
        };
      }),
    );
  },
});
