"use client";

import { ReactNode } from "react";
import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

// Renders children only once Convex has the user's token. Page-level
// convenience only: the real protection is requireUser in the Convex functions.
export function AuthGate({
  message,
  children,
}: {
  message: string;
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <p className="mt-6 text-muted">Loading...</p>;

  if (!isAuthenticated) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-surface p-6">
        <p className="text-muted">{message}</p>
        <SignInButton mode="modal">
          <button className="mt-4 h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer">
            Sign in
          </button>
        </SignInButton>
      </div>
    );
  }

  return <>{children}</>;
}
