"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthGate } from "@/components/auth-gate";
import { LoanAction, LoanItem } from "@/components/loan-item";
import { PageHeader } from "@/components/page-header";

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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title="Requests">
        Who wants your tools, and which tools you&apos;ve asked for.
      </PageHeader>

      <AuthGate message="Sign in to see your requests.">
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Incoming requests
          </h2>
          {incoming === undefined ? (
            <Skeleton />
          ) : incoming.length === 0 ? (
            <Empty>
              No one has asked to borrow your tools yet. Patience, the neighbors
              are warming up.
            </Empty>
          ) : (
            <ul className="grid gap-px border border-border bg-border">
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
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            My requests
          </h2>
          {mine === undefined ? (
            <Skeleton />
          ) : mine.length === 0 ? (
            <Empty>
              You haven&apos;t borrowed anything yet. Browse tools and make a
              neighbor&apos;s day.
            </Empty>
          ) : (
            <ul className="grid gap-px border border-border bg-border">
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
  return <div className="sheet h-20 animate-pulse" aria-busy="true" />;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="sheet p-8 text-center text-muted">{children}</p>;
}
