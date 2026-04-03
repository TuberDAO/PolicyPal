import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Customer dashboard — list of cases with status and unread indicators.
 * Implementation will be added in the dashboard phase.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Your Cases</h1>
      <p className="text-sm text-muted">
        Your submitted cases will appear here.
      </p>
    </div>
  );
}
