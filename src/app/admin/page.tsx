import type { Metadata } from "next";
import Link from "next/link";
import { getAdminCaseList } from "@/actions/admin";
import { CASE_STATUS_LABELS, ISSUE_TYPE_LABELS } from "@/constants";
import { formatDate, formatDateTime } from "@/utils/format";

export const metadata: Metadata = { title: "Admin — Case Queue" };

const TURNAROUND_SHORT: Record<string, string> = {
  quick_question: "Quick Q",
  standard: "Standard",
  rush: "Rush",
};

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700",
  under_review: "bg-amber-50 text-amber-700",
  awaiting_info: "bg-orange-50 text-orange-700",
  complete: "bg-green-50 text-green-700",
};

export default async function AdminDashboardPage() {
  const cases = await getAdminCaseList();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Case Queue</h1>
        <p className="text-sm text-muted">
          {cases.length} case{cases.length !== 1 ? "s" : ""}
        </p>
      </div>

      {cases.length === 0 ? (
        <p className="text-sm text-muted">
          No submitted cases yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="px-3 py-2.5 font-medium text-muted">Case</th>
                <th className="px-3 py-2.5 font-medium text-muted">Customer</th>
                <th className="px-3 py-2.5 font-medium text-muted">Status</th>
                <th className="px-3 py-2.5 font-medium text-muted">Issue Type(s)</th>
                <th className="px-3 py-2.5 font-medium text-muted">State</th>
                <th className="px-3 py-2.5 font-medium text-muted">Submitted</th>
                <th className="px-3 py-2.5 font-medium text-muted">Turnaround</th>
                <th className="px-3 py-2.5 font-medium text-muted">Reviewer</th>
                <th className="px-3 py-2.5 font-medium text-muted">Updated</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border last:border-b-0 hover:bg-accent-light/50 transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/admin/case/${c.id}`}
                      className="font-mono text-xs text-accent hover:underline"
                    >
                      {c.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-foreground">
                    {c.customerEmail}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[c.status] ?? "bg-gray-50 text-gray-700"}`}
                    >
                      {CASE_STATUS_LABELS[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-foreground max-w-48 truncate">
                    {c.issueTypes
                      .map((t) => ISSUE_TYPE_LABELS[t] ?? t)
                      .join(", ")}
                  </td>
                  <td className="px-3 py-2.5 text-foreground">{c.state}</td>
                  <td className="px-3 py-2.5 text-muted whitespace-nowrap">
                    {c.submittedAt ? formatDate(c.submittedAt) : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`text-xs font-medium ${c.turnaround === "rush" ? "text-orange-600" : "text-foreground"}`}
                    >
                      {TURNAROUND_SHORT[c.turnaround] ?? c.turnaround}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-muted">
                    {c.assignedReviewerName ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-muted whitespace-nowrap">
                    {formatDateTime(c.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
