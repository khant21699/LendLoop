"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { getErrorMessage } from "@/lib/errors";
import { CategoryIcon } from "@/components/ui/icon/category-icon";
import { StatusBadge } from "@/components/ui/status-badge";

type AdminTool = FunctionReturnType<typeof api.admin.listAllTools>[number];
type AdminUser = FunctionReturnType<typeof api.admin.listUsers>[number];

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {count !== undefined && <p className="data">{count} total</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="sheet p-8 text-center text-muted">{children}</p>;
}

function Skeleton() {
  return <div className="sheet h-20 animate-pulse" aria-busy="true" />;
}

export function AdminLoans() {
  const loans = useQuery(api.admin.listAllLoans);
  return (
    <Section title="All loans" count={loans?.length}>
      {loans === undefined ? (
        <Skeleton />
      ) : loans.length === 0 ? (
        <Empty>No loans yet. The neighborhood is still shy.</Empty>
      ) : (
        <ul className="grid gap-px border border-border bg-border">
          {loans.map((loan) => (
            <li
              key={loan._id}
              className="flex items-start justify-between gap-3 bg-surface px-4 py-4 sm:px-5"
            >
              <div>
                <p className="font-medium">{loan.toolName}</p>
                <p className="data mt-1">
                  {loan.startDate} to {loan.endDate}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {loan.ownerName} lends to {loan.borrowerName}
                </p>
              </div>
              <StatusBadge status={loan.overdue ? "overdue" : loan.status} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function ToolRow({ tool }: { tool: AdminTool }) {
  const removeTool = useMutation(api.tools.remove);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove() {
    setError(null);
    try {
      await removeTool({ toolId: tool._id });
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirming(false);
    }
  }

  return (
    <li className="bg-surface px-4 py-4 sm:px-5">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 text-link">
          <CategoryIcon category={tool.category} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{tool.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="data">{tool.category}</span>
            <span>Owner: {tool.ownerName}</span>
            {tool.ownerTrusted && (
              <StatusBadge status="trusted" label="Trusted lender" />
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {confirming ? (
            <>
              <button
                onClick={handleRemove}
                className="btn btn-outline btn-sm text-declined-fg"
              >
                Confirm remove
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="btn btn-outline btn-sm hover:text-declined-fg"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-declined-fg">
          {error}
        </p>
      )}
    </li>
  );
}

export function AdminTools() {
  const tools = useQuery(api.admin.listAllTools);
  return (
    <Section title="All listings" count={tools?.length}>
      {tools === undefined ? (
        <Skeleton />
      ) : tools.length === 0 ? (
        <Empty>No listings yet.</Empty>
      ) : (
        <ul className="grid gap-px border border-border bg-border">
          {tools.map((tool) => (
            <ToolRow key={tool._id} tool={tool} />
          ))}
        </ul>
      )}
    </Section>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const setTrusted = useMutation(api.admin.setTrustedLender);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setError(null);
    setBusy(true);
    try {
      await setTrusted({ userId: user._id, trusted: !user.isTrustedLender });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="bg-surface px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-medium">
            {user.name}
            {user.role === "admin" && (
              <span className="data uppercase">admin</span>
            )}
            {user.isTrustedLender && (
              <StatusBadge status="trusted" label="Trusted lender" />
            )}
          </p>
          <p className="data mt-1 truncate">{user.email}</p>
        </div>
        <button
          disabled={busy}
          onClick={toggle}
          className="btn btn-outline btn-sm shrink-0"
        >
          {user.isTrustedLender ? "Remove trusted" : "Mark trusted"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-declined-fg">
          {error}
        </p>
      )}
    </li>
  );
}

export function AdminUsers() {
  const users = useQuery(api.admin.listUsers);
  return (
    <Section title="Lenders and users" count={users?.length}>
      {users === undefined ? (
        <Skeleton />
      ) : users.length === 0 ? (
        <Empty>No users yet.</Empty>
      ) : (
        <ul className="grid gap-px border border-border bg-border">
          {users.map((user) => (
            <UserRow key={user._id} user={user} />
          ))}
        </ul>
      )}
    </Section>
  );
}
