"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProfilePage() {
  const identity = useQuery(api.debug.whoami);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-muted">
        Your identity as seen by the Convex backend.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
        {identity === undefined
          ? "Loading..."
          : identity === null
            ? "Not authenticated"
            : JSON.stringify(identity, null, 2)}
      </pre>
    </main>
  );
}
