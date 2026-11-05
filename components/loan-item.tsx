"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { BadgeStatus, StatusBadge } from "@/components/status-badge";

type Loan = {
  toolName: string;
  personName: string;
  personTrusted?: boolean;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "declined" | "returned" | "cancelled";
  overdue: boolean;
};

export type LoanAction = {
  label: string;
  run: () => Promise<unknown>;
  primary?: boolean;
  // Ask "are you sure?" inline before running (for actions that can't be undone).
  confirm?: { label: string; keepLabel: string };
};

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
  const [confirming, setConfirming] = useState<string | null>(null);
  const badge: BadgeStatus = loan.overdue ? "overdue" : loan.status;

  async function run(action: LoanAction) {
    if (action.confirm && confirming !== action.label) {
      setConfirming(action.label);
      return;
    }
    setConfirming(null);
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
    <li className="bg-surface px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{loan.toolName}</p>
          <p className="data mt-1">
            {loan.startDate} to {loan.endDate}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
            {personLabel}: {loan.personName}
            {loan.personTrusted && (
              <StatusBadge status="trusted" label="Trusted lender" />
            )}
          </p>
        </div>
        <StatusBadge status={badge} />
      </div>
      {actions.length > 0 && (
        <div className="mt-3 flex gap-2">
          {actions.map((action) => {
            const asking = confirming === action.label;
            return (
              <span key={action.label} className="flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => run(action)}
                  className={`btn btn-sm ${
                    action.primary ? "btn-primary" : "btn-outline"
                  } ${asking ? "text-declined-fg" : ""}`}
                >
                  {asking ? action.confirm?.label : action.label}
                </button>
                {asking && (
                  <button
                    onClick={() => setConfirming(null)}
                    className="btn btn-outline btn-sm"
                  >
                    {action.confirm?.keepLabel}
                  </button>
                )}
              </span>
            );
          })}
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
