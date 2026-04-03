import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Case Queue" };

/**
 * Admin dashboard — case queue filterable by status, assignee, turnaround type.
 * Includes notification badge with unread update count.
 * Implementation will be added in the admin phase.
 */
export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Case Queue</h1>
      <p className="text-sm text-muted">
        Admin case list will appear here.
      </p>
    </div>
  );
}
