import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CASE_STATUS_LABELS, ISSUE_TYPE_LABELS } from "@/constants";
import { getCustomerThread } from "@/actions/customer";
import { getPublishedPlaybook } from "@/actions/playbook";
import { CustomerThread } from "@/components/case/customer-thread";
import { PlaybookView } from "@/components/case/playbook-view";

export const metadata: Metadata = { title: "Case Detail" };

const TURNAROUND_LABELS: Record<string, string> = {
  quick_question: "Quick Question",
  standard: "Standard (within 3 business days)",
  rush: "Rush (within 1 business day)",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <p className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: c } = user
    ? await supabase
        .from("cases")
        .select(
          "id, status, issue_types, state, description, turnaround, created_at, submitted_at",
        )
        .eq("id", id)
        .eq("customer_id", user.id)
        .maybeSingle()
    : { data: null };

  if (!c) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Case Not Found
        </h1>
        <p className="text-sm text-muted">
          This case does not exist or you do not have access to it.
        </p>
        <Link href="/dashboard" className="text-sm text-accent hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isSubmitted = c.status !== "draft";
  const canReply = ["submitted", "under_review", "awaiting_info", "complete"].includes(c.status);
  const [thread, playbook] = await Promise.all([
    isSubmitted ? getCustomerThread(c.id) : Promise.resolve([]),
    c.status === "complete" ? getPublishedPlaybook(c.id) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Case Detail</h1>
        {c.status === "draft" ? (
          <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
            {CASE_STATUS_LABELS[c.status] ?? c.status}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
            {CASE_STATUS_LABELS[c.status] ?? c.status}
          </span>
        )}
      </div>

      {c.status === "awaiting_info" && (
        <div className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-3">
          <p className="text-sm font-medium text-orange-800">
            Action needed: we need a bit more information before we can finish your case.
          </p>
        </div>
      )}

      {c.status === "draft" && (
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <p className="text-sm text-muted">
            This case is saved as a draft. You can edit your details or continue to upload documents and pay.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/case/${c.id}/upload`}
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              Continue to upload →
            </Link>
            <Link
              href={`/case/${c.id}/edit`}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Edit details
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-border bg-surface p-5">
        <DetailRow label="Issue Type(s)">
          {c.issue_types.map((t: string) => ISSUE_TYPE_LABELS[t] ?? t).join(", ")}
        </DetailRow>
        <DetailRow label="State">{c.state}</DetailRow>
        <DetailRow label="Turnaround">
          {TURNAROUND_LABELS[c.turnaround] ?? c.turnaround}
        </DetailRow>
        <DetailRow label="Submitted">{formatDate(c.submitted_at)}</DetailRow>
        <DetailRow label="Opened">{formatDate(c.created_at)}</DetailRow>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Description
          </p>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {c.description}
          </p>
        </div>
      </div>

      {playbook && (
        <div className="rounded-lg border border-green-200 bg-green-50/30 p-5 sm:p-6 space-y-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Your Plan
          </h2>
          <PlaybookView caseId={c.id} content={playbook.content} />
        </div>
      )}

      {isSubmitted && (
        <div className="space-y-3 rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
              Updates
            </h2>
            <p className="text-xs text-muted">
              Refresh the page to check for new messages.
            </p>
          </div>
          <CustomerThread caseId={c.id} messages={thread} canReply={canReply} />
        </div>
      )}

      <Link href="/dashboard" className="text-sm text-accent hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  );
}
