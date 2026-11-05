"use client";

import { FormEvent, useState } from "react";
import { CATEGORIES, Category } from "@/convex/lib/categories";
import { getErrorMessage } from "@/lib/errors";

export type ToolValues = {
  name: string;
  category: Category;
  condition: string;
  description: string;
};

const EMPTY: ToolValues = {
  name: "",
  category: CATEGORIES[0],
  condition: "",
  description: "",
};

// Used for both "list a tool" and "edit a tool". The server re-validates
// everything, so the maxLength attributes here are only a convenience.
export function ToolForm({
  initial = EMPTY,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ToolValues;
  submitLabel: string;
  onSubmit: (values: ToolValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ToolValues>(key: K, value: ToolValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="field-label">
        Name
        <input
          className="field mt-1"
          value={values.name}
          maxLength={80}
          required
          onChange={(e) => set("name", e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">
          Category
          <select
            className="field mt-1"
            value={values.category}
            onChange={(e) => set("category", e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Condition
          <input
            className="field mt-1"
            value={values.condition}
            maxLength={40}
            required
            placeholder="e.g. Good"
            onChange={(e) => set("condition", e.target.value)}
          />
        </label>
      </div>
      <label className="field-label">
        Description
        <textarea
          className="field mt-1"
          rows={3}
          maxLength={500}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-declined-fg">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
