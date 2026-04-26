"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { saveDraftPlaybook, publishPlaybook } from "@/actions/playbook";
import type {
  PlaybookContent,
  PlaybookBlock,
  PlaybookBlockType,
  SourceItem,
} from "@/types/playbook";
import { BLOCK_TYPE_LABELS } from "@/types/playbook";

function genId() {
  return crypto.randomUUID().slice(0, 8);
}

const BLOCK_DEFAULTS: Record<PlaybookBlockType, Partial<PlaybookBlock>> = {
  action_step: { trackCompletion: true, label: "", content: "" },
  phone_script: { trackCompletion: true, label: "", content: "" },
  email_script: { trackCompletion: true, label: "", content: "" },
  portal_message: { trackCompletion: true, label: "", content: "" },
  letter_wording: { trackCompletion: true, label: "", content: "" },
  guidance_note: { trackCompletion: true, label: "", content: "" },
};

/* ------------------------------------------------------------------ */
/*  Block editor                                                       */
/* ------------------------------------------------------------------ */

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: PlaybookBlock;
  index: number;
  total: number;
  onChange: (b: PlaybookBlock) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const up = (field: string, value: string | boolean) =>
    onChange({ ...block, [field]: value });

  const isAction = block.type === "action_step";
  const isScript =
    block.type === "phone_script" ||
    block.type === "email_script" ||
    block.type === "portal_message" ||
    block.type === "letter_wording";

  return (
    <div className="space-y-2 rounded-md border border-border bg-background p-3">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <span className="rounded bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded border border-border px-1.5 py-0.5 text-xs text-muted hover:text-foreground disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded border border-border px-1.5 py-0.5 text-xs text-muted hover:text-foreground disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-error hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Label / title */}
      <input
        placeholder={isAction ? "Step title" : "Label"}
        value={block.label}
        onChange={(e) => up("label", e.target.value)}
        className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
      />

      {/* Main content */}
      <textarea
        placeholder={isAction ? "What to do" : "Content"}
        value={block.content}
        onChange={(e) => up("content", e.target.value)}
        rows={isAction ? 2 : 4}
        className={`w-full rounded border border-border bg-surface px-2 py-1 text-sm resize-y ${isScript ? "font-mono" : ""}`}
      />

      {/* Action step specific fields */}
      {isAction && (
        <>
          <input
            placeholder="Who to contact (optional)"
            value={block.whoToContact ?? ""}
            onChange={(e) => up("whoToContact", e.target.value)}
            className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
          />
          <textarea
            placeholder="What to ask for or say (optional)"
            value={block.whatToSay ?? ""}
            onChange={(e) => up("whatToSay", e.target.value)}
            rows={2}
            className="w-full rounded border border-border bg-surface px-2 py-1 text-sm resize-y"
          />
          <input
            placeholder="Why this step matters (optional)"
            value={block.whyItMatters ?? ""}
            onChange={(e) => up("whyItMatters", e.target.value)}
            className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
          />
          <input
            placeholder="Deadline or timing note (optional)"
            value={block.timing ?? ""}
            onChange={(e) => up("timing", e.target.value)}
            className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
          />
        </>
      )}

      {/* Script/wording contact field */}
      {isScript && (
        <input
          placeholder={
            block.type === "phone_script"
              ? "Who to call (optional)"
              : "Send to / destination (optional)"
          }
          value={block.contactField ?? ""}
          onChange={(e) => up("contactField", e.target.value)}
          className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
        />
      )}

      {/* Track completion toggle */}
      <label className="flex items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={block.trackCompletion}
          onChange={(e) => up("trackCompletion", e.target.checked)}
          className="rounded"
        />
        Customer can mark this done
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Source editor                                                       */
/* ------------------------------------------------------------------ */

function SourceEditor({
  source,
  onChange,
  onRemove,
}: {
  source: SourceItem;
  onChange: (s: SourceItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2 rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted">Source</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-error hover:underline"
        >
          Remove
        </button>
      </div>
      <input
        placeholder="Label (e.g. CMS Appeals Process)"
        value={source.label}
        onChange={(e) => onChange({ ...source, label: e.target.value })}
        className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
      />
      <input
        placeholder="URL (optional)"
        value={source.url ?? ""}
        onChange={(e) => onChange({ ...source, url: e.target.value })}
        className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
      />
      <input
        placeholder="Detail / note (optional)"
        value={source.detail ?? ""}
        onChange={(e) => onChange({ ...source, detail: e.target.value })}
        className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main editor                                                        */
/* ------------------------------------------------------------------ */

export function PlaybookEditor({
  caseId,
  initial,
  isPublished,
}: {
  caseId: string;
  initial: PlaybookContent;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState<PlaybookContent>(initial);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const serialize = useCallback(() => JSON.stringify(content), [content]);

  async function handleSave() {
    setMessage(null);
    setSaving(true);
    try {
      const result = await saveDraftPlaybook(caseId, serialize());
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Draft saved." });
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (
      !confirm(
        "Publish this playbook? This will mark the case as complete and email the customer.",
      )
    )
      return;

    setMessage(null);
    setPublishing(true);
    try {
      const result = await publishPlaybook(caseId, serialize());
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: "Playbook published. Case marked complete.",
        });
        router.refresh();
      }
    } finally {
      setPublishing(false);
    }
  }

  const busy = saving || publishing;

  /* Block helpers */
  function addBlock(type: PlaybookBlockType) {
    setContent((c) => ({
      ...c,
      blocks: [
        ...c.blocks,
        { id: genId(), type, ...BLOCK_DEFAULTS[type] } as PlaybookBlock,
      ],
    }));
  }

  function updateBlock(idx: number, block: PlaybookBlock) {
    setContent((c) => ({
      ...c,
      blocks: c.blocks.map((b, i) => (i === idx ? block : b)),
    }));
  }

  function removeBlock(idx: number) {
    setContent((c) => ({
      ...c,
      blocks: c.blocks.filter((_, i) => i !== idx),
    }));
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    setContent((c) => {
      const arr = [...c.blocks];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return c;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...c, blocks: arr };
    });
  }

  /* Source helpers */
  function addSource() {
    setContent((c) => ({
      ...c,
      sources: [...c.sources, { id: genId(), label: "" }],
    }));
  }

  function updateSource(idx: number, source: SourceItem) {
    setContent((c) => ({
      ...c,
      sources: c.sources.map((s, i) => (i === idx ? source : s)),
    }));
  }

  function removeSource(idx: number) {
    setContent((c) => ({
      ...c,
      sources: c.sources.filter((_, i) => i !== idx),
    }));
  }

  return (
    <div className="space-y-6">
      {isPublished && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-800">
            This playbook has been published. Edits here will update the
            published version when you save or re-publish.
          </p>
        </div>
      )}

      {/* Summary */}
      <section className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Summary of the issue
        </label>
        <textarea
          value={content.summary}
          onChange={(e) =>
            setContent((c) => ({ ...c, summary: e.target.value }))
          }
          rows={3}
          placeholder="A short opening block that explains the customer's issue clearly."
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm resize-y"
        />
      </section>

      {/* Plan summary */}
      <section className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Summary of the plan and why
        </label>
        <textarea
          value={content.planSummary}
          onChange={(e) =>
            setContent((c) => ({ ...c, planSummary: e.target.value }))
          }
          rows={3}
          placeholder="A short overview explaining the recommended path and why."
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm resize-y"
        />
      </section>

      {/* Mixed blocks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Playbook blocks
          </label>
        </div>

        {content.blocks.map((block, i) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={i}
            total={content.blocks.length}
            onChange={(b) => updateBlock(i, b)}
            onRemove={() => removeBlock(i)}
            onMoveUp={() => moveBlock(i, -1)}
            onMoveDown={() => moveBlock(i, 1)}
          />
        ))}

        {content.blocks.length === 0 && (
          <p className="text-sm text-muted">No blocks yet. Add one below.</p>
        )}

        <div className="flex flex-wrap gap-2">
          {(Object.keys(BLOCK_TYPE_LABELS) as PlaybookBlockType[]).map(
            (type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-accent-light transition-colors"
              >
                + {BLOCK_TYPE_LABELS[type]}
              </button>
            ),
          )}
        </div>
      </section>

      {/* Sources */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Source details
          </label>
          <button
            type="button"
            onClick={addSource}
            className="rounded bg-accent px-2 py-1 text-xs font-medium text-white hover:bg-accent/90"
          >
            + Add source
          </button>
        </div>
        {content.sources.map((source, i) => (
          <SourceEditor
            key={source.id}
            source={source}
            onChange={(s) => updateSource(i, s)}
            onRemove={() => removeSource(i)}
          />
        ))}
        {content.sources.length === 0 && (
          <p className="text-sm text-muted">No sources yet.</p>
        )}
      </section>

      {/* Actions: Save left, Publish right */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={busy}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save draft"}
          </button>
          {message && (
            <p
              className={`text-sm ${message.type === "error" ? "text-error" : "text-success"}`}
            >
              {message.text}
            </p>
          )}
        </div>
        <button
          onClick={handlePublish}
          disabled={busy}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {publishing ? "Publishing..." : "Publish playbook"}
        </button>
      </div>
    </div>
  );
}
