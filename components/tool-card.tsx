"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { getErrorMessage } from "@/lib/errors";

type Tool = FunctionReturnType<typeof api.tools.listAll>[number];

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

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
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{tool.name}</p>
          <p className="mt-1 text-sm text-muted">
            {tool.category} · {tool.condition}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            tool.onLoanUntil
              ? "bg-returned-bg text-returned-fg"
              : "bg-approved-bg text-approved-fg"
          }`}
        >
          {tool.onLoanUntil ? `On loan until ${tool.onLoanUntil}` : "Available"}
        </span>
      </div>
      {tool.description && <p className="mt-2 text-sm">{tool.description}</p>}

      <div className="mt-3">
        {tool.isMine ? (
          <p className="text-sm text-muted">Your listing</p>
        ) : sent ? (
          <p className="text-sm text-approved-fg">
            Request sent. Track it under Requests.
          </p>
        ) : open ? (
          <form onSubmit={handleSubmit} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">
                From
                <input
                  type="date"
                  className={inputClass}
                  value={startDate}
                  min={today}
                  required
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label className="text-sm font-medium">
                To
                <input
                  type="date"
                  className={inputClass}
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
                className="h-9 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Sending..." : "Send request"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-full border border-border px-4 text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="h-9 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer"
          >
            Request to borrow
          </button>
        )}
      </div>
    </li>
  );
}
