"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  PlaybookContent,
  PlaybookBlock,
  PlaybookBlockType,
} from "@/types/playbook";
import { BLOCK_TYPE_LABELS } from "@/types/playbook";

const COMPLETION_LABELS: Record<
  PlaybookBlockType,
  { incomplete: string; complete: string }
> = {
  action_step: {
    incomplete: "Mark done",
    complete: "Done. Tap to undo",
  },
  phone_script: {
    incomplete: "Mark call complete",
    complete: "Call complete. Tap to undo",
  },
  email_script: {
    incomplete: "Mark email sent",
    complete: "Email sent. Tap to undo",
  },
  portal_message: {
    incomplete: "Mark message sent",
    complete: "Message sent. Tap to undo",
  },
  letter_wording: {
    incomplete: "Mark letter sent",
    complete: "Letter sent. Tap to undo",
  },
  guidance_note: {
    incomplete: "Mark as read",
    complete: "Read. Tap to undo",
  },
};

/* ------------------------------------------------------------------ */
/*  Completion tracking (localStorage)                                 */
/* ------------------------------------------------------------------ */

function useBlockCompletion(caseId: string, trackableIds: string[]) {
  const storageKey = `playbook-progress-${caseId}`;

  // Stable set reference so the hydration effect only fires when caseId changes.
  const trackableSet = useMemo(
    () => new Set(trackableIds),
    // Intentionally use a joined string as the dep so the memo only
    // re-computes when the actual IDs change, not when the array is recreated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackableIds.join(",")],
  );

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // Hydrate once per caseId. trackableSet is stable across re-renders as long
  // as the IDs do not change, so this effect will not loop.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setCompleted(new Set(arr.filter((id) => trackableSet.has(id))));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  // storageKey is derived from caseId which is stable; trackableSet is memoized.
  }, [storageKey, trackableSet]);

  const toggle = useCallback(
    (blockId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(blockId)) {
          next.delete(blockId);
        } else {
          next.add(blockId);
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey],
  );

  return { completed, toggle, loaded };
}

/* ------------------------------------------------------------------ */
/*  Completion control                                                 */
/* ------------------------------------------------------------------ */

function CompletionButton({
  blockType,
  isDone,
  onToggle,
}: {
  blockType: PlaybookBlockType;
  isDone: boolean;
  onToggle: () => void;
}) {
  const labels = COMPLETION_LABELS[blockType];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDone}
      className={`mt-3 w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
        isDone
          ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
          : "bg-accent-light text-accent border border-accent/20 hover:bg-accent/10"
      }`}
    >
      {isDone ? labels.complete : labels.incomplete}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Block renderers                                                    */
/* ------------------------------------------------------------------ */

function ActionStepBlock({
  block,
  index,
  isDone,
  loaded,
  onToggle,
}: {
  block: PlaybookBlock;
  index: number;
  isDone: boolean;
  loaded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isDone
          ? "border-green-200 bg-green-50/50"
          : "border-border bg-surface"
      }`}
    >
      <div className="space-y-2">
        <h3
          className={`text-sm font-semibold ${isDone ? "text-muted line-through" : "text-foreground"}`}
        >
          Step {index + 1}: {block.label}
        </h3>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {block.content}
        </p>
        {block.whoToContact && (
          <div className="rounded bg-accent-light/60 px-3 py-2">
            <p className="text-xs font-medium text-muted">Who to contact</p>
            <p className="text-sm text-foreground">{block.whoToContact}</p>
          </div>
        )}
        {block.whatToSay && (
          <div className="rounded bg-accent-light/60 px-3 py-2">
            <p className="text-xs font-medium text-muted">What to say</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {block.whatToSay}
            </p>
          </div>
        )}
        {block.whyItMatters && (
          <p className="text-xs text-muted italic">
            Why: {block.whyItMatters}
          </p>
        )}
        {block.timing && (
          <p className="text-xs font-medium text-orange-600">
            Timing: {block.timing}
          </p>
        )}
      </div>
      {block.trackCompletion && loaded && (
        <CompletionButton
          blockType={block.type}
          isDone={isDone}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

function ScriptBlock({
  block,
  isDone,
  loaded,
  onToggle,
}: {
  block: PlaybookBlock;
  isDone: boolean;
  loaded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-4 space-y-2 transition-colors ${
        isDone
          ? "border-green-200 bg-green-50/50"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>
        <span className="text-sm font-medium text-foreground">
          {block.label}
        </span>
      </div>
      {block.contactField && (
        <p className="text-xs text-muted">
          {block.type === "phone_script" ? "Call" : "To"}: {block.contactField}
        </p>
      )}
      <pre className="whitespace-pre-wrap rounded bg-background p-3 text-sm leading-relaxed text-foreground font-sans">
        {block.content}
      </pre>
      {block.trackCompletion && loaded && (
        <CompletionButton
          blockType={block.type}
          isDone={isDone}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

function GuidanceBlock({
  block,
  isDone,
  loaded,
  onToggle,
}: {
  block: PlaybookBlock;
  isDone: boolean;
  loaded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-lg border p-4 space-y-2 transition-colors ${
        isDone
          ? "border-green-200 bg-green-50/50"
          : "border-border bg-surface"
      }`}
    >
      <h3 className="text-sm font-semibold text-foreground">{block.label}</h3>
      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {block.content}
      </p>
      {block.trackCompletion && loaded && (
        <CompletionButton
          blockType={block.type}
          isDone={isDone}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                          */
/* ------------------------------------------------------------------ */

export function PlaybookView({
  caseId,
  content,
}: {
  caseId: string;
  content: PlaybookContent;
}) {
  const trackableIds = useMemo(
    () => content.blocks.filter((b) => b.trackCompletion).map((b) => b.id),
    // content.blocks is stable for a given server render; useMemo prevents
    // the array from being recreated as a new reference on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content.blocks.map((b) => b.id + String(b.trackCompletion)).join(",")],
  );
  const { completed, toggle, loaded } = useBlockCompletion(
    caseId,
    trackableIds,
  );
  const completedCount = completed.size;
  const totalTrackable = trackableIds.length;

  let actionIndex = 0;

  return (
    <div className="space-y-8">
      {/* Fixed: Summary of the issue */}
      {content.summary && (
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Summary of your issue
          </h2>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {content.summary}
          </p>
        </section>
      )}

      {/* Fixed: Summary of the plan */}
      {content.planSummary && (
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Your plan and why
          </h2>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {content.planSummary}
          </p>
        </section>
      )}

      {/* Mixed blocks in saved order */}
      {content.blocks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Your action plan
            </h2>
            {loaded && totalTrackable > 0 && (
              <p className="text-xs text-muted">
                {completedCount} of {totalTrackable} done
              </p>
            )}
          </div>

          <div className="space-y-3">
            {content.blocks.map((block) => {
              const isDone = loaded && completed.has(block.id);
              const onToggle = () => toggle(block.id);

              if (block.type === "action_step") {
                const idx = actionIndex++;
                return (
                  <ActionStepBlock
                    key={block.id}
                    block={block}
                    index={idx}
                    isDone={isDone}
                    loaded={loaded}
                    onToggle={onToggle}
                  />
                );
              }

              if (block.type === "guidance_note") {
                return (
                  <GuidanceBlock
                    key={block.id}
                    block={block}
                    isDone={isDone}
                    loaded={loaded}
                    onToggle={onToggle}
                  />
                );
              }

              return (
                <ScriptBlock
                  key={block.id}
                  block={block}
                  isDone={isDone}
                  loaded={loaded}
                  onToggle={onToggle}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Fixed: Source details */}
      {content.sources.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Source details
          </h2>
          <p className="text-xs text-muted">
            Official guidance and references that support your plan.
          </p>
          <ul className="space-y-2">
            {content.sources.map((source) => (
              <li
                key={source.id}
                className="rounded border border-border bg-surface px-4 py-3 space-y-1"
              >
                <p className="text-sm font-medium text-foreground">
                  {source.label}
                </p>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline break-all"
                  >
                    {source.url}
                  </a>
                )}
                {source.detail && (
                  <p className="text-xs text-muted">{source.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Fixed: Report back */}
      <section className="rounded-lg border border-border bg-surface p-5 space-y-2">
        <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
          Report back after you act
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          After you work through the steps above, let us know what happened. Use
          the Updates section below to tell us what worked, what did not, and
          whether the issue was resolved. This helps us follow up if needed.
        </p>
      </section>

      {/* Fixed: Need more help */}
      <section className="rounded-lg border border-border bg-surface p-5 space-y-2">
        <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
          Need more help?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          If you have follow-up questions about any step in your plan, use the
          Updates section below to ask. We are here to help.
        </p>
      </section>
    </div>
  );
}
