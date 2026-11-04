import { ConvexError } from "convex/values";

// Server functions throw ConvexError("message") for expected problems
// (validation, permissions). Show those; hide anything unexpected.
export function getErrorMessage(error: unknown) {
  if (error instanceof ConvexError && typeof error.data === "string") {
    return error.data;
  }
  return "Something went wrong. Please try again.";
}
