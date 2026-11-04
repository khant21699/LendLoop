import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./lib/auth";

// Called by the client once Convex reports the user as signed in. Creates
// the users row on first sign-in and does nothing afterwards. Identity
// fields come from the verified token; the role is always "user" here and
// is only ever changed by hand in the Convex dashboard.
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Not authenticated");

    const existing = await getCurrentUser(ctx);
    if (existing !== null) return existing._id;

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name ?? identity.email ?? "Neighbor",
      email: identity.email ?? "",
      role: "user",
      isTrustedLender: false,
    });
  },
});

// The signed-in user's own row, or null when signed out / not created yet.
export const me = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});
