"use client";

import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ListingCard } from "@/components/listing-card";
import { ToolForm } from "@/components/tool-form";

export default function ListingsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  // "skip" avoids calling the query until Convex has the user's token.
  const tools = useQuery(api.tools.listMine, isAuthenticated ? {} : "skip");
  const createTool = useMutation(api.tools.create);
  // Changing the key remounts the form, which clears it after a successful post.
  const [formKey, setFormKey] = useState(0);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">My listings</h1>

      {isLoading ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : !isAuthenticated ? (
        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <p className="text-muted">Sign in to list and manage your tools.</p>
          <SignInButton mode="modal">
            <button className="mt-4 h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer">
              Sign in
            </button>
          </SignInButton>
        </div>
      ) : (
        <>
          <section className="mt-6 rounded-lg border border-border bg-surface p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">List a tool</h2>
            <ToolForm
              key={formKey}
              submitLabel="List tool"
              onSubmit={async (values) => {
                await createTool(values);
                setFormKey((k) => k + 1);
              }}
            />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">Your tools</h2>
            {tools === undefined ? (
              <div
                className="h-20 animate-pulse rounded-lg border border-border bg-surface"
                aria-busy="true"
              />
            ) : tools.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
                You haven&apos;t listed any tools yet.
              </p>
            ) : (
              <ul className="grid gap-3">
                {tools.map((tool) => (
                  <ListingCard key={tool._id} tool={tool} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
