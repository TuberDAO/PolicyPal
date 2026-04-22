"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIntakeDraft } from "@/hooks/use-draft";
import { intakeDraftSchema } from "@/utils/validation";
import { createCase } from "@/actions/case";

function readStorage(store: Storage, key: string): object | null {
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

type Status = "creating" | "error" | "redirecting";

export function CreateCaseHandler() {
  const router = useRouter();
  const { draft, clearDraft } = useIntakeDraft();
  const [status, setStatus] = useState<Status>("creating");
  const [errorMessage, setErrorMessage] = useState("");
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;

    if (draft === null) {
      router.replace("/start");
      return;
    }

    const result = intakeDraftSchema.safeParse(draft);
    if (!result.success) {
      router.replace("/start");
      return;
    }

    attemptedRef.current = true;

    const { savedAt: _savedAt, ...input } = result.data;
    void _savedAt;

    let attribution: {
      first_touch: ReturnType<typeof readStorage> | null;
      session_touch: ReturnType<typeof readStorage> | null;
    } | null = null;

    try {
      const first = readStorage(localStorage, "pp_first_touch");
      const session = readStorage(sessionStorage, "pp_session_touch");
      if (first !== null || session !== null) {
        attribution = { first_touch: first, session_touch: session };
      }
    } catch {
      // Storage unavailable — proceed without attribution.
    }

    createCase({ ...input, attribution: attribution as Parameters<typeof createCase>[0]["attribution"] }).then((res) => {
      if (res.error) {
        setStatus("error");
        setErrorMessage(res.error);
        return;
      }

      clearDraft();
      setStatus("redirecting");
      router.replace(`/case/${res.id}/upload`);
    });
  }, [draft, clearDraft, router]);

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <p className="text-sm text-foreground">{errorMessage}</p>
        <a
          href="/start"
          className="text-sm font-medium text-accent underline underline-offset-4 hover:text-accent/80"
        >
          Back to start
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-muted">Creating your case&hellip;</p>
    </div>
  );
}
