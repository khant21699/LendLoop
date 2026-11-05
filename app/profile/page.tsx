"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/page-header";

export default function ProfilePage() {
  const user = useQuery(api.users.me);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Profile">Who the board thinks you are.</PageHeader>
      {user === undefined ? (
        <p className="data mt-6">Loading...</p>
      ) : user === null ? (
        <p className="mt-6 text-muted">Sign in to see your profile.</p>
      ) : (
        <dl className="sheet mt-6 grid max-w-xl grid-cols-[9rem_1fr] text-sm">
          {[
            ["Name", user.name],
            ["Email", user.email],
            ["Role", user.role],
            ["Trusted lender", user.isTrustedLender ? "Yes" : "Not yet"],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="data border-b border-border px-4 py-3">{label}</dt>
              <dd className="border-b border-border px-4 py-3 last:border-b-0">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  );
}
