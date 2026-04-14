"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addInternalNote } from "@/actions/admin";
import { formatDateTime } from "@/utils/format";

type Note = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export function InternalNotes({
  caseId,
  notes,
}: {
  caseId: string;
  notes: Note[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await addInternalNote(caseId, content.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add an internal note..."
          rows={3}
          disabled={isPending}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Add Note"}
          </button>
          {error && <p className="text-sm text-error">{error}</p>}
        </div>
      </form>

      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-md border border-border bg-background p-3 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">
                  {note.authorName}
                </p>
                <p className="text-xs text-muted">
                  {formatDateTime(note.createdAt)}
                </p>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
