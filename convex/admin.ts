import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";
import { isOverdue } from "./lib/loans";

// Every function here starts with requireAdmin: the role is read from the
// users table, so a regular user calling these directly is rejected.

export const listAllLoans = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const loans = await ctx.db.query("loans").order("desc").take(200);
    return await Promise.all(
      loans.map(async (loan) => {
        const [tool, borrower, owner] = await Promise.all([
          ctx.db.get(loan.toolId),
          ctx.db.get(loan.borrowerId),
          ctx.db.get(loan.ownerId),
        ]);
        return {
          _id: loan._id,
          toolName: tool?.name ?? "Removed tool",
          borrowerName: borrower?.name ?? "Unknown",
          ownerName: owner?.name ?? "Unknown",
          startDate: loan.startDate,
          endDate: loan.endDate,
          status: loan.status,
          overdue: isOverdue(loan),
        };
      }),
    );
  },
});

export const listAllTools = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const tools = await ctx.db.query("tools").order("desc").take(200);
    return await Promise.all(
      tools.map(async (tool) => {
        const owner = await ctx.db.get(tool.ownerId);
        return {
          _id: tool._id,
          name: tool.name,
          category: tool.category,
          ownerName: owner?.name ?? "Unknown",
          ownerTrusted: owner?.isTrustedLender ?? false,
        };
      }),
    );
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").take(200);
    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isTrustedLender: user.isTrustedLender,
    }));
  },
});

// Only flips the trusted flag. It never touches `role`, so admins can't
// create other admins through the app (that stays a dashboard-only action).
export const setTrustedLender = mutation({
  args: { userId: v.id("users"), trusted: v.boolean() },
  handler: async (ctx, { userId, trusted }) => {
    await requireAdmin(ctx);
    const user = await ctx.db.get(userId);
    if (user === null) throw new ConvexError("User not found");
    await ctx.db.patch(userId, { isTrustedLender: trusted });
  },
});
