"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateCaseStatus } from "@/actions/admin";
import { CASE_STATUS_LABELS } from "@/constants";

const ALLOWED_STATUSES = [
  "submitted",
  "under_review",
  "awaiting_info",
  "complete",
] as const;

export function CaseStatusSelect({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    if (selected === currentStatus) return;
    setError(null);

    startTransition(async () => {
      const result = await updateCaseStatus(caseId, selected);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={isPending}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {ALLOWED_STATUSES.map((s) => (
            <option key={s} value={s}>
              {CASE_STATUS_LABELS[s] ?? s}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          disabled={isPending || selected === currentStatus}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Update Status"}
        </button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
