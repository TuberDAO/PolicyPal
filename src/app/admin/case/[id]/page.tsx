import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCaseDetail, getStaffMembers } from "@/actions/admin";
import { CASE_STATUS_LABELS, ISSUE_TYPE_LABELS } from "@/constants";
import { formatDate, formatDateTime, formatFileSize, formatCurrency } from "@/utils/format";
import { CaseStatusSelect } from "@/components/admin/case-status-select";
import { ReviewerSelect } from "@/components/admin/reviewer-select";
import { InternalNotes } from "@/components/admin/internal-notes";
import { CustomerUpdates } from "@/components/admin/customer-updates";

export const metadata: Metadata = { title: "Admin — Case Review" };

const TURNAROUND_LABELS: Record<string, string> = {
  quick_question: "Quick Question",
  standard: "Standard (within 3 business days)",
  rush: "Rush (within 1 business day)",
};

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  awaiting_info: "bg-orange-50 text-orange-700",
  complete: "bg-green-50 text-green-700",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
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
      <p className="w-36 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

export default async function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, staffMembers] = await Promise.all([
    getAdminCaseDetail(id),
    getStaffMembers(),
  ]);

  if (!detail) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="text-sm text-accent hover:underline"
          >
            &larr; Back to queue
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Case {detail.id.slice(0, 8)}
          </h1>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[detail.status] ?? "bg-gray-50 text-gray-700"}`}
        >
          {CASE_STATUS_LABELS[detail.status] ?? detail.status}
        </span>
      </div>

      {/* Customer summary */}
      <Section title="Customer Summary">
        <DetailRow label="Email">{detail.customerEmail}</DetailRow>
        <DetailRow label="Submitted">
          {detail.submittedAt ? formatDateTime(detail.submittedAt) : "—"}
        </DetailRow>
        <DetailRow label="Turnaround">
          <span className={detail.turnaround === "rush" ? "font-medium text-orange-600" : ""}>
            {TURNAROUND_LABELS[detail.turnaround] ?? detail.turnaround}
          </span>
        </DetailRow>
        {detail.amountCents != null && (
          <DetailRow label="Amount Paid">
            {formatCurrency(detail.amountCents)}
          </DetailRow>
        )}
        <DetailRow label="Last Updated">
          {formatDateTime(detail.updatedAt)}
        </DetailRow>
      </Section>

      {/* Intake details */}
      <Section title="Intake Details">
        <DetailRow label="Issue Type(s)">
          {detail.issueTypes
            .map((t) => ISSUE_TYPE_LABELS[t] ?? t)
            .join(", ")}
        </DetailRow>
        <DetailRow label="State">{detail.state}</DetailRow>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Description
          </p>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {detail.description}
          </p>
        </div>
        {detail.insurerName && (
          <DetailRow label="Insurer">{detail.insurerName}</DetailRow>
        )}
        {detail.providerName && (
          <DetailRow label="Provider">{detail.providerName}</DetailRow>
        )}
        {detail.urgency && (
          <DetailRow label="Urgency">{detail.urgency}</DetailRow>
        )}
        {detail.desiredOutcome && (
          <DetailRow label="Desired Outcome">{detail.desiredOutcome}</DetailRow>
        )}
        {detail.alreadyTried && (
          <DetailRow label="Already Tried">{detail.alreadyTried}</DetailRow>
        )}
      </Section>

      {/* Uploads */}
      <Section title={`Uploads (${detail.files.length})`}>
        {detail.files.length === 0 ? (
          <p className="text-sm text-muted">No files uploaded.</p>
        ) : (
          <ul className="divide-y divide-border">
            {detail.files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {f.originalFilename}
                  </p>
                  <p className="text-xs text-muted">
                    {f.mimeType} &middot; {formatFileSize(f.sizeBytes)}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted">
                  {formatDate(f.uploadedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Playbook link */}
      <section className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Playbook
        </h2>
        <Link
          href={`/admin/case/${detail.id}/playbook`}
          className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          Open playbook editor
        </Link>
      </section>

      {/* Customer updates — visible to customer */}
      <Section title="Customer Updates">
        <p className="text-xs text-muted">
          Messages here are visible to the customer. Use &ldquo;Request more information&rdquo; to set the case to Awaiting Information and email the customer.
        </p>
        <CustomerUpdates caseId={detail.id} messages={detail.customerUpdates} />
      </Section>

      {/* Status controls */}
      <Section title="Status">
        <CaseStatusSelect caseId={detail.id} currentStatus={detail.status} />
      </Section>

      {/* Reviewer assignment */}
      <Section title="Reviewer Assignment">
        {detail.assignedReviewerName && (
          <p className="text-sm text-foreground">
            Currently assigned to{" "}
            <span className="font-medium">{detail.assignedReviewerName}</span>
          </p>
        )}
        <ReviewerSelect
          caseId={detail.id}
          currentReviewerId={detail.assignedReviewerId}
          staffMembers={staffMembers}
        />
      </Section>

      {/* Internal work area */}
      <Section title="Internal Notes">
        <p className="text-xs text-muted">
          These notes are only visible to staff. Customers cannot see this area.
        </p>
        <InternalNotes caseId={detail.id} notes={detail.internalNotes} />
      </Section>
    </div>
  );
}
