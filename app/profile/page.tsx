"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProfilePage() {
  const user = useQuery(api.users.me);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      {user === undefined ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : user === null ? (
        <p className="mt-6 text-muted">Sign in to see your profile.</p>
      ) : (
        <dl className="mt-6 grid grid-cols-[8rem_1fr] gap-y-2 rounded-lg border border-border bg-surface p-4 text-sm">
          <dt className="text-muted">Name</dt>
          <dd>{user.name}</dd>
          <dt className="text-muted">Email</dt>
          <dd>{user.email}</dd>
          <dt className="text-muted">Role</dt>
          <dd>{user.role}</dd>
          <dt className="text-muted">Trusted lender</dt>
          <dd>{user.isTrustedLender ? "Yes" : "No"}</dd>
        </dl>
      )}
    </main>
  );
}
