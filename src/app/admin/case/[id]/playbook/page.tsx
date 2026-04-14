import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDraftPlaybook } from "@/actions/playbook";
import { PlaybookEditor } from "@/components/admin/playbook-editor";
import { emptyPlaybook } from "@/types/playbook";
import { formatDateTime } from "@/utils/format";

export const metadata: Metadata = { title: "Admin — Playbook Editor" };

export default async function PlaybookEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let draft;
  try {
    draft = await getDraftPlaybook(id);
  } catch {
    notFound();
  }

  const content = draft?.content ?? emptyPlaybook();
  const isPublished = !!draft?.sentAt;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-1">
        <Link
          href={`/admin/case/${id}`}
          className="text-sm text-accent hover:underline"
        >
          &larr; Back to case
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Playbook Editor
        </h1>
        {draft && (
          <p className="text-xs text-muted">
            Last saved {formatDateTime(draft.updatedAt)}
            {isPublished && ` · Published ${formatDateTime(draft.sentAt!)}`}
          </p>
        )}
      </div>

      <PlaybookEditor
        caseId={id}
        initial={content}
        isPublished={isPublished}
      />
    </div>
  );
}
