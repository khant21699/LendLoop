import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

// Dates are "YYYY-MM-DD" (UTC) strings, so comparing them as text is correct.
export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

// True if [start, end] collides with an approved, not-yet-returned loan on the
// tool. An approved loan past its end date is overdue but the tool is still
// out, so its effective end is today, not its original end date.
export async function hasApprovedOverlap(
  ctx: QueryCtx | MutationCtx,
  toolId: Id<"tools">,
  start: string,
  end: string,
  excludeLoanId?: Id<"loans">,
) {
  const now = today();
  const loans = await ctx.db
    .query("loans")
    .withIndex("by_tool", (q) => q.eq("toolId", toolId))
    .collect();
  return loans.some((loan) => {
    if (loan._id === excludeLoanId || loan.status !== "approved") return false;
    const effectiveEnd = loan.endDate < now ? now : loan.endDate;
    return loan.startDate <= end && start <= effectiveEnd;
  });
}

// Overdue is derived, never stored: approved, not returned, end date passed.
export function isOverdue(loan: { status: string; endDate: string }) {
  return loan.status === "approved" && loan.endDate < today();
}
