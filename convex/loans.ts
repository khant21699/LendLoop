import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireUser } from "./lib/auth";
import { hasApprovedOverlap, isOverdue, isValidDate, today } from "./lib/loans";

export const requestLoan = mutation({
  args: {
    toolId: v.id("tools"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, { toolId, startDate, endDate }) => {
    const user = await requireUser(ctx);

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      throw new ConvexError("Dates must be valid");
    }
    if (startDate < today())
      throw new ConvexError("Start date can't be in the past");
    if (endDate < startDate)
      throw new ConvexError("End date must be on or after the start date");

    const tool = await ctx.db.get(toolId);
    if (tool === null) throw new ConvexError("Tool not found");
    if (tool.ownerId === user._id)
      throw new ConvexError("You can't borrow your own tool");

    // Fail early for the borrower; approve re-checks because requests can race.
    if (await hasApprovedOverlap(ctx, toolId, startDate, endDate)) {
      throw new ConvexError("That tool is already booked for those dates");
    }

    // borrowerId and ownerId come from the token and the tool, never the client.
    return await ctx.db.insert("loans", {
      toolId,
      borrowerId: user._id,
      ownerId: tool.ownerId,
      startDate,
      endDate,
      status: "pending",
    });
  },
});

export const approve = mutation({
  args: { loanId: v.id("loans") },
  handler: async (ctx, { loanId }) => {
    const user = await requireUser(ctx);
    const loan = await ctx.db.get(loanId);
    if (loan === null) throw new ConvexError("Request not found");
    if (loan.ownerId !== user._id) throw new ConvexError("Not allowed");
    if (loan.status !== "pending")
      throw new ConvexError("Only pending requests can be approved");

    if (
      await hasApprovedOverlap(
        ctx,
        loan.toolId,
        loan.startDate,
        loan.endDate,
        loanId,
      )
    ) {
      throw new ConvexError("Overlaps an approved loan for this tool");
    }
    await ctx.db.patch(loanId, { status: "approved" });
  },
});

export const decline = mutation({
  args: { loanId: v.id("loans") },
  handler: async (ctx, { loanId }) => {
    const user = await requireUser(ctx);
    const loan = await ctx.db.get(loanId);
    if (loan === null) throw new ConvexError("Request not found");
    if (loan.ownerId !== user._id) throw new ConvexError("Not allowed");
    if (loan.status !== "pending")
      throw new ConvexError("Only pending requests can be declined");

    await ctx.db.patch(loanId, { status: "declined" });
  },
});

// The lender (or an admin) marks it returned: they are the one holding the
// tool again, and a borrower shouldn't be able to close their own loan.
export const markReturned = mutation({
  args: { loanId: v.id("loans") },
  handler: async (ctx, { loanId }) => {
    const user = await requireUser(ctx);
    const loan = await ctx.db.get(loanId);
    if (loan === null) throw new ConvexError("Loan not found");
    if (loan.ownerId !== user._id && user.role !== "admin") {
      throw new ConvexError("Not allowed");
    }
    if (loan.status !== "approved")
      throw new ConvexError("Only approved loans can be returned");

    await ctx.db.patch(loanId, { status: "returned", returnedAt: Date.now() });
  },
});

// Requests the caller has made. Only the fields the page needs.
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];
    const loans = await ctx.db
      .query("loans")
      .withIndex("by_borrower", (q) => q.eq("borrowerId", user._id))
      .order("desc")
      .collect();
    return await Promise.all(
      loans.map(async (loan) => {
        const tool = await ctx.db.get(loan.toolId);
        const owner = await ctx.db.get(loan.ownerId);
        return {
          _id: loan._id,
          toolName: tool?.name ?? "Removed tool",
          personName: owner?.name ?? "Unknown",
          personTrusted: owner?.isTrustedLender ?? false,
          startDate: loan.startDate,
          endDate: loan.endDate,
          status: loan.status,
          overdue: isOverdue(loan),
        };
      }),
    );
  },
});

// Requests on the caller's own tools. Shows the borrower's name only.
export const listIncoming = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];
    const loans = await ctx.db
      .query("loans")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
    return await Promise.all(
      loans.map(async (loan) => {
        const tool = await ctx.db.get(loan.toolId);
        const borrower = await ctx.db.get(loan.borrowerId);
        return {
          _id: loan._id,
          toolName: tool?.name ?? "Removed tool",
          personName: borrower?.name ?? "Unknown",
          startDate: loan.startDate,
          endDate: loan.endDate,
          status: loan.status,
          overdue: isOverdue(loan),
        };
      }),
    );
  },
});
