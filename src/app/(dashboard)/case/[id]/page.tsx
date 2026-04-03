import type { Metadata } from "next";

export const metadata: Metadata = { title: "Case Detail" };

/**
 * Case detail — status, uploaded files, update thread, playbook.
 * Implementation will be added in the dashboard phase.
 */
export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Case Detail</h1>
      <p className="text-sm text-muted">
        Case information will appear here.
      </p>
    </div>
  );
}
