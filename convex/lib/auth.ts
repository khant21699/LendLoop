import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "../_generated/server";

// Looks up the caller's row from the verified token. Returns null if the
// caller is signed out or has no users row yet.
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

// Call at the top of every protected function. The user comes from the
// verified token, never from an argument the client could fake.
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (user === null) throw new ConvexError("Not authenticated");
  return user;
}

// The role is read from the users table, so it can't be spoofed by the client.
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx);
  if (user.role !== "admin") throw new ConvexError("Admin only");
  return user;
}
