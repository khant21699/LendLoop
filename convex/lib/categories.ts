import { v } from "convex/values";

// Single source of truth for categories. The UI imports CATEGORIES for its
// dropdown and filter; the schema and functions use categoryValidator, so the
// server rejects anything outside the list.
export const CATEGORIES = [
  "Power tools",
  "Hand tools",
  "Garden",
  "Kitchen",
  "Camping",
  "Cleaning",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const categoryValidator = v.union(
  v.literal("Power tools"),
  v.literal("Hand tools"),
  v.literal("Garden"),
  v.literal("Kitchen"),
  v.literal("Camping"),
  v.literal("Cleaning"),
  v.literal("Other"),
);
