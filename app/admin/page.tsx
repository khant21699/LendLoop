"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AdminLoans,
  AdminTools,
  AdminUsers,
} from "@/components/admin-sections";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";

export default function AdminPage() {
  const me = useQuery(api.users.me);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Admin">
        Moderation for the whole board: every loan, every listing, and who gets
        the trusted badge.
      </PageHeader>

      <AuthGate message="Sign in to continue.">
        {me === undefined ? (
          <p className="data mt-6">Loading...</p>
        ) : me?.role !== "admin" ? (
          // Only a courtesy: the admin queries below reject non-admins anyway,
          // and they are not even mounted for them.
          <p className="sheet mt-6 p-6 text-muted">
            Admins only. Nothing to see here, neighbor.
          </p>
        ) : (
          <>
            <AdminLoans />
            <AdminTools />
            <AdminUsers />
          </>
        )}
      </AuthGate>
    </main>
  );
}
