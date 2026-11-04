"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthGate } from "@/components/auth-gate";
import { LoanAction, LoanItem } from "@/components/loan-item";

export default function RequestsPage() {
  const { isAuthenticated } = useConvexAuth();
  const mine = useQuery(api.loans.listMine, isAuthenticated ? {} : "skip");
  const incoming = useQuery(
    api.loans.listIncoming,
    isAuthenticated ? {} : "skip",
  );
  const approve = useMutation(api.loans.approve);
  const decline = useMutation(api.loans.decline);
  const markReturned = useMutation(api.loans.markReturned);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Requests</h1>

      <AuthGate message="Sign in to see your requests.">
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Incoming requests</h2>
          {incoming === undefined ? (
            <Skeleton />
          ) : incoming.length === 0 ? (
            <Empty>No one has asked to borrow your tools yet.</Empty>
          ) : (
            <ul className="grid gap-3">
              {incoming.map((loan) => {
                const actions: LoanAction[] =
                  loan.status === "pending"
                    ? [
                        {
                          label: "Approve",
                          run: () => approve({ loanId: loan._id }),
                        },
                        {
                          label: "Decline",
                          run: () => decline({ loanId: loan._id }),
                        },
                      ]
                    : loan.status === "approved"
                      ? [
                          {
                            label: "Mark returned",
                            run: () => markReturned({ loanId: loan._id }),
                          },
                        ]
                      : [];
                return (
                  <LoanItem
                    key={loan._id}
                    loan={loan}
                    personLabel="Borrower"
                    actions={actions}
                  />
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">My requests</h2>
          {mine === undefined ? (
            <Skeleton />
          ) : mine.length === 0 ? (
            <Empty>
              You haven&apos;t requested anything yet. Browse tools to start.
            </Empty>
          ) : (
            <ul className="grid gap-3">
              {mine.map((loan) => (
                <LoanItem key={loan._id} loan={loan} personLabel="Owner" />
              ))}
            </ul>
          )}
        </section>
      </AuthGate>
    </main>
  );
}

function Skeleton() {
  return (
    <div
      className="h-20 animate-pulse rounded-lg border border-border bg-surface"
      aria-busy="true"
    />
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
      {children}
    </p>
  );
}
