import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CASE_STATUS_LABELS, ISSUE_TYPE_LABELS } from "@/constants";

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

      <Link href="/dashboard" className="text-sm text-accent hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  );
}
