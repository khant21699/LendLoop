"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { getErrorMessage } from "@/lib/errors";
import { ToolForm } from "@/components/tool-form";

export function ListingCard({ tool }: { tool: Doc<"tools"> }) {
  const updateTool = useMutation(api.tools.update);
  const removeTool = useMutation(api.tools.remove);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    try {
      await removeTool({ toolId: tool._id });
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirming(false);
    }
  }

  if (editing) {
    return (
      <li className="rounded-lg border border-border bg-surface p-4">
        <ToolForm
          initial={{
            name: tool.name,
            category: tool.category,
            condition: tool.condition,
            description: tool.description,
          }}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            await updateTool({ toolId: tool._id, ...values });
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{tool.name}</p>
          <p className="mt-1 text-sm text-muted">
            {tool.category} · {tool.condition}
          </p>
          {tool.description && (
            <p className="mt-2 text-sm">{tool.description}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2 text-sm">
          {confirming ? (
            <>
              <button
                onClick={handleDelete}
                className="font-medium text-declined-fg cursor-pointer"
              >
                Confirm delete
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-muted cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-link cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirming(true)}
                className="text-muted hover:text-declined-fg cursor-pointer"
              >
                Delete
              </button>
            </>
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
