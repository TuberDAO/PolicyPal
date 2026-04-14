"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { assignReviewer } from "@/actions/admin";
import type { StaffMember } from "@/actions/admin";

export function ReviewerSelect({
  caseId,
  currentReviewerId,
  staffMembers,
}: {
  caseId: string;
  currentReviewerId: string | null;
  staffMembers: StaffMember[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentReviewerId ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const newId = selected || null;
    if (newId === currentReviewerId) return;
    setError(null);

    startTransition(async () => {
      const result = await assignReviewer(caseId, newId);
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
          <option value="">Unassigned</option>
          {staffMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName}{m.email ? ` (${m.email})` : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          disabled={isPending || (selected || null) === currentReviewerId}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Assign"}
        </button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
