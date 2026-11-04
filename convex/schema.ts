import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // One row per signed-in person. The role lives here (never in the client
  // or the Clerk token) so permission checks always read trusted data.
  users: defineTable({
    clerkId: v.string(), // the token's `subject`
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    isTrustedLender: v.boolean(),
  }).index("by_clerkId", ["clerkId"]),

  // Availability is derived from loans, not stored on the tool, so it can
  // never drift out of sync with the loans table.
  tools: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    category: v.string(),
    condition: v.string(),
    description: v.string(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_category", ["category"]),

  // Dates are "YYYY-MM-DD" strings, which sort correctly as text, so range
  // and overdue checks are plain string comparisons.
  // "Overdue" is not a status: it is approved + not returned + endDate < today.
  loans: defineTable({
    toolId: v.id("tools"),
    borrowerId: v.id("users"),
    ownerId: v.id("users"), // copied from the tool when requested, for cheap "incoming" queries
    startDate: v.string(),
    endDate: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("returned"),
    ),
    returnedAt: v.optional(v.number()),
  })
    .index("by_tool", ["toolId"])
    .index("by_borrower", ["borrowerId"])
    .index("by_owner", ["ownerId"])
    .index("by_status_and_endDate", ["status", "endDate"]),

  // Log of what n8n did for a loan. The unique idempotencyKey makes retried
  // write-backs a no-op instead of creating duplicates.
  automationEvents: defineTable({
    loanId: v.id("loans"),
    type: v.union(
      v.literal("request_notification"),
      v.literal("overdue_reminder"),
    ),
    status: v.union(v.literal("sent"), v.literal("failed")),
    idempotencyKey: v.string(),
    error: v.optional(v.string()),
  })
    .index("by_loan", ["loanId"])
    .index("by_idempotencyKey", ["idempotencyKey"]),
});
