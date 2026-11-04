"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { BadgeStatus, StatusBadge } from "@/components/status-badge";

type Loan = {
  toolName: string;
  personName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "declined" | "returned";
  overdue: boolean;
};

export type LoanAction = { label: string; run: () => Promise<unknown> };

// One row for either view. `personLabel` says who personName is ("Owner" or
// "Borrower"); `actions` are the buttons this viewer is allowed to use.
export function LoanItem({
  loan,
  personLabel,
  actions = [],
}: {
  loan: Loan;
  personLabel: string;
  actions?: LoanAction[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const badge: BadgeStatus = loan.overdue ? "overdue" : loan.status;

  async function run(action: LoanAction) {
    setError(null);
    setBusy(true);
    try {
      await action.run();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{loan.toolName}</p>
          <p className="mt-1 text-sm text-muted">
            {loan.startDate} to {loan.endDate} · {personLabel}:{" "}
            {loan.personName}
          </p>
        </div>
        <StatusBadge status={badge} />
      </div>
      {actions.length > 0 && (
        <div className="mt-3 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              disabled={busy}
              onClick={() => run(action)}
              className="h-9 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-primary disabled:opacity-60 cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-declined-fg">
          {error}
        </p>
      )}
    </li>
  );
}
