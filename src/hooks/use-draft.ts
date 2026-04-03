"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { IntakeDraft } from "@/types";

export const DRAFT_STORAGE_KEY = "policypal_draft";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

export function useIntakeDraft() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const draft = useMemo<IntakeDraft | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IntakeDraft;
    } catch {
      return null;
    }
  }, [raw]);

  const saveDraft = useCallback((updated: Partial<IntakeDraft>) => {
    let current: IntakeDraft | null = null;
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (stored) current = JSON.parse(stored) as IntakeDraft;
    } catch {
      /* ignore */
    }

    const next: IntakeDraft = {
      issueTypes: current?.issueTypes ?? [],
      state: current?.state ?? "",
      description: current?.description ?? "",
      insurerName: current?.insurerName,
      providerName: current?.providerName,
      urgency: current?.urgency,
      desiredOutcome: current?.desiredOutcome,
      alreadyTried: current?.alreadyTried,
      ...updated,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage full */
    }
    notify();
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    notify();
  }, []);

  return { draft, saveDraft, clearDraft } as const;
}
