"use client";

import { useState, useCallback } from "react";
import { useIntakeDraft } from "@/hooks/use-draft";
import { IssueSelector } from "./issue-selector";
import { IntakeForm } from "./intake-form";
import type { IssueType, IntakeDraft } from "@/types";

export function IntakeFlow() {
  const { draft, saveDraft } = useIntakeDraft();
  const [hasInteracted, setHasInteracted] = useState(false);

  // null = auto-detect from draft; 1 | 2 = user-chosen step
  const [userStep, setUserStep] = useState<1 | 2 | null>(null);

  const step = (() => {
    if (userStep !== null) return userStep;
    if (!hasInteracted && draft && draft.issueTypes.length > 0) return 2;
    return 1;
  })();

  const handleToggleIssue = useCallback(
    (issueType: IssueType) => {
      setHasInteracted(true);
      const current = draft?.issueTypes ?? [];
      const next = current.includes(issueType)
        ? current.filter((t) => t !== issueType)
        : [...current, issueType];
      saveDraft({ issueTypes: next });
    },
    [draft?.issueTypes, saveDraft],
  );

  const handleFieldChange = useCallback(
    (updated: Partial<IntakeDraft>) => {
      saveDraft(updated);
    },
    [saveDraft],
  );

  if (step === 1) {
    return (
      <IssueSelector
        selected={draft?.issueTypes ?? []}
        onToggle={handleToggleIssue}
        onContinue={() => setUserStep(2)}
      />
    );
  }

  const safeDraft: IntakeDraft = {
    issueTypes: draft?.issueTypes ?? [],
    state: draft?.state ?? "",
    description: draft?.description ?? "",
    insurerName: draft?.insurerName,
    providerName: draft?.providerName,
    urgency: draft?.urgency,
    desiredOutcome: draft?.desiredOutcome,
    alreadyTried: draft?.alreadyTried,
    savedAt: draft?.savedAt ?? new Date().toISOString(),
  };

  return (
    <IntakeForm
      draft={safeDraft}
      onFieldChange={handleFieldChange}
      onBack={() => setUserStep(1)}
    />
  );
}
