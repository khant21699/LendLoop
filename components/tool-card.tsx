"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { getErrorMessage } from "@/lib/errors";
import { CategoryIcon } from "@/components/category-icon";
import { StatusBadge } from "@/components/status-badge";

type Tool = FunctionReturnType<typeof api.tools.listAll>[number];

// One line of the parts list. The request form opens inline under the row.
export function ToolCard({ tool }: { tool: Tool }) {
  const requestLoan = useMutation(api.loans.requestLoan);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  // Same UTC "today" the server uses, so the date picker and server agree.
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await requestLoan({ toolId: tool._id, startDate, endDate });
      setSent(true);
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="bg-surface px-4 py-4 sm:px-5">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 text-link">
          <CategoryIcon category={tool.category} size={30} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-medium">{tool.name}</p>
            <StatusBadge
              status={tool.onLoanUntil ? "onloan" : "available"}
              label={
                tool.onLoanUntil ? `Out until ${tool.onLoanUntil}` : "Available"
              }
            />
          </div>
          <p className="data mt-1">
            {tool.category} / {tool.condition}
          </p>
          {tool.description && (
            <p className="mt-2 max-w-prose text-sm">{tool.description}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          {tool.isMine ? (
            <span className="data">Your listing</span>
          ) : sent ? (
            <span className="text-sm text-approved-fg">Request sent</span>
          ) : (
            !open && (
              <button
                onClick={() => setOpen(true)}
                className="btn btn-outline btn-sm"
              >
                Request
              </button>
            )
          )}
        </div>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-3 border-t border-border pt-4 sm:ml-[46px]"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field-label">
              From
              <input
                type="date"
                className="field mt-1"
                value={startDate}
                min={today}
                required
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="field-label">
              To
              <input
                type="date"
                className="field mt-1"
                value={endDate}
                min={startDate || today}
                required
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-declined-fg">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm"
            >
              {saving ? "Sending..." : "Send request"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
