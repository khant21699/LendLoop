"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { getErrorMessage } from "@/lib/errors";
import { CategoryIcon } from "@/components/category-icon";
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
      <li className="bg-surface px-4 py-4 sm:px-5">
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
    <li className="bg-surface px-4 py-4 sm:px-5">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 text-link">
          <CategoryIcon category={tool.category} size={30} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{tool.name}</p>
          <p className="data mt-1">
            {tool.category} / {tool.condition}
          </p>
          {tool.description && (
            <p className="mt-2 text-sm">{tool.description}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          {confirming ? (
            <>
              <button
                onClick={handleDelete}
                className="btn btn-outline btn-sm text-declined-fg"
              >
                Confirm delete
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-outline btn-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirming(true)}
                className="btn btn-outline btn-sm hover:text-declined-fg"
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
