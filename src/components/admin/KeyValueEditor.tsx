"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type KeyValuePair = { key: string; value: string; wasList: boolean };

function metaToRows(meta: Record<string, unknown>): KeyValuePair[] {
  return Object.entries(meta).map(([key, value]) => {
    if (Array.isArray(value)) {
      return { key, value: value.join(", "), wasList: true };
    }
    return {
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
      wasList: false,
    };
  });
}

function rowsToMeta(rows: KeyValuePair[]): Record<string, unknown> {
  const meta: Record<string, unknown> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) continue;
    const raw = row.value;
    if (row.wasList) {
      meta[key] = raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    } else if (raw === "true" || raw === "false") {
      // Numbers and booleans round-trip as their real type; everything else
      // (including plain text that happens to look empty) stays a string.
      meta[key] = raw === "true";
    } else if (raw !== "" && !Number.isNaN(Number(raw))) {
      meta[key] = Number(raw);
    } else {
      meta[key] = raw;
    }
  }
  return meta;
}

/**
 * A plain label/value list editor standing in for a raw JSON textarea —
 * admins add named fields ("value: 15", "suffix: +") without ever seeing
 * or writing JSON syntax.
 */
export function KeyValueEditor({
  meta,
  onChange,
  label = "Extra fields",
  keyPlaceholder = "field name",
  valuePlaceholder = "value",
}: {
  meta: Record<string, unknown>;
  onChange: (meta: Record<string, unknown>) => void;
  label?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  const [rows, setRows] = useState<KeyValuePair[]>(() => metaToRows(meta));

  function updateRows(next: KeyValuePair[]) {
    setRows(next);
    onChange(rowsToMeta(next));
  }

  function updateRow(index: number, patch: Partial<KeyValuePair>) {
    updateRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeRow(index: number) {
    updateRows(rows.filter((_, i) => i !== index));
  }

  function addRow() {
    updateRows([...rows, { key: "", value: "", wasList: false }]);
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</span>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={row.key}
              onChange={(event) => updateRow(index, { key: event.target.value })}
              placeholder={keyPlaceholder}
              dir="ltr"
              className="w-1/3 rounded-xl border border-brand-900/15 bg-white/70 px-3 py-2 text-xs text-brand-forest outline-none focus:border-brand-gold"
            />
            <input
              value={row.value}
              onChange={(event) => updateRow(index, { value: event.target.value })}
              placeholder={row.wasList ? "comma-separated list" : valuePlaceholder}
              className="flex-1 rounded-xl border border-brand-900/15 bg-white/70 px-3 py-2 text-xs text-brand-forest outline-none focus:border-brand-gold"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
              aria-label="Remove field"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-gold"
      >
        <Plus className="h-3.5 w-3.5" /> Add field
      </button>
    </div>
  );
}
