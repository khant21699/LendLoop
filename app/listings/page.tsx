"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ListingCard } from "@/components/tools/listing-card";
import { PageHeader } from "@/components/layout/page-header";
import { ToolForm } from "@/components/tools/tool-form";

export default function ListingsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  // "skip" avoids calling the query until Convex has the user's token.
  const tools = useQuery(api.tools.listMine, isAuthenticated ? {} : "skip");
  const createTool = useMutation(api.tools.create);
  // Changing the key remounts the form, which clears it after a successful post.
  const [formKey, setFormKey] = useState(0);
  const [listed, setListed] = useState<string | null>(null);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="My listings">
        The tools you&apos;re happy to lend. Hang one up, tweak it, or take it
        down.
      </PageHeader>

      {isLoading ? (
        <p className="data mt-6">Loading...</p>
      ) : !isAuthenticated ? (
        <div className="sheet mt-6 p-6">
          <p className="text-muted">Sign in to list and manage your tools.</p>
          <SignInButton mode="modal">
            <button className="btn btn-primary mt-4">Sign in</button>
          </SignInButton>
        </div>
      ) : (
        <>
          <section className="sheet mt-6 p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              List a tool
            </h2>
            <ToolForm
              key={formKey}
              submitLabel="List tool"
              onSubmit={async (values) => {
                await createTool(values);
                setListed(values.name.trim());
                setFormKey((k) => k + 1);
              }}
            />
            {listed && (
              <p role="status" className="mt-4 text-sm text-approved-fg">
                “{listed}” is on the board.{" "}
                <Link href="/tools" className="link-quiet">
                  See it in Browse
                </Link>
              </p>
            )}
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              Your tools
            </h2>
            {tools === undefined ? (
              <div className="sheet h-20 animate-pulse" aria-busy="true" />
            ) : tools.length === 0 ? (
              <p className="sheet p-8 text-center text-muted">
                Nothing hung up yet. That drill isn&apos;t going to lend itself.
              </p>
            ) : (
              <ul className="grid gap-px border border-border bg-border">
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
