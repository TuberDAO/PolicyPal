import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Playbook Editor" };

/**
 * Playbook editor — write/edit Markdown playbook, save, and send to customer.
 * Sending triggers the "playbook ready" email.
 * Implementation will be added in the playbook phase.
 */
export default function PlaybookEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Playbook Editor
      </h1>
      <p className="text-sm text-muted">
        Playbook editor will appear here.
      </p>
    </div>
  );
}
