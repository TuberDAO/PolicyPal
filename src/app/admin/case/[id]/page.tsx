import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Case Review" };

/**
 * Admin case detail — intake data, files, updates, status controls, reviewer assignment.
 * Shows turnaround type prominently.
 * Implementation will be added in the admin phase.
 */
export default function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Case Review</h1>
      <p className="text-sm text-muted">
        Admin case detail will appear here.
      </p>
    </div>
  );
}
