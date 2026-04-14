"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addCustomerReply } from "@/actions/customer";
import type { CustomerThreadMessage } from "@/actions/customer";
import { formatDateTime } from "@/utils/format";

export function CustomerThread({
  caseId,
  messages,
  canReply,
}: {
  caseId: string;
  messages: CustomerThreadMessage[];
  canReply: boolean;
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
      const result = await addCustomerReply(caseId, content.trim());
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
      {messages.length === 0 ? (
        <p className="text-sm text-muted">
          No messages yet. Updates from your case manager will appear here.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-md border p-3 space-y-1 ${
                msg.isStaff
                  ? "border-accent/30 bg-accent-light/50"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">
                  {msg.authorLabel}
                </p>
                <p className="text-xs text-muted">
                  {formatDateTime(msg.createdAt)}
                </p>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {canReply && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            maxLength={4000}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Sending..." : "Send reply"}
            </button>
            {error && <p className="text-sm text-error">{error}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
