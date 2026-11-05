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

  if (isLoading) return <p className="data mt-6">Loading...</p>;

  if (!isAuthenticated) {
    return (
      <div className="sheet mt-6 p-6">
        <p className="text-muted">{message}</p>
        <SignInButton mode="modal">
          <button className="btn btn-primary mt-4">Sign in</button>
        </SignInButton>
      </div>
    );
  }

  return <>{children}</>;
}
