"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { sendCustomerUpdate, requestMoreInfo } from "@/actions/admin";
import { formatDateTime } from "@/utils/format";

type Message = {
  id: string;
  authorId: string;
  authorLabel: string;
  isStaff: boolean;
  content: string;
  createdAt: string;
};

export function CustomerUpdates({
  caseId,
  messages,
}: {
  caseId: string;
  messages: Message[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSendUpdate() {
    if (!content.trim()) return;
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await sendCustomerUpdate(caseId, content.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        setSuccess("Update sent to customer.");
        router.refresh();
      }
    });
  }

  function handleRequestInfo() {
    if (!content.trim()) return;
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await requestMoreInfo(caseId, content.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        setSuccess("Information requested. Status set to Awaiting Information.");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Thread */}
      {messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-md border p-3 space-y-1 ${
                msg.isStaff
                  ? "border-accent/30 bg-accent-light/50"
                  : "border-border bg-background"
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

      {/* Compose */}
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setSuccess(null);
          }}
          placeholder="Write a customer-visible message..."
          rows={3}
          maxLength={4000}
          disabled={isPending}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSendUpdate}
            disabled={isPending || !content.trim()}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : "Send update"}
          </button>
          <button
            onClick={handleRequestInfo}
            disabled={isPending || !content.trim()}
            className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : "Request more information"}
          </button>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}
      </div>
    </div>
  );
}
