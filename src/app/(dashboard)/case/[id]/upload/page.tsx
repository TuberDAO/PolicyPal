import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "@/components/case/upload-form";

export const metadata: Metadata = { title: "Upload Documents" };

export default async function UploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", id)
    .single();

  if (!caseRow) notFound();

  if (caseRow.status !== "draft") {
    redirect(`/case/${id}/checkout`);
  }

  const { data: existingFiles } = await supabase
    .from("case_files")
    .select("id, original_filename, mime_type, size_bytes")
    .eq("case_id", id)
    .order("uploaded_at", { ascending: true });

  return <UploadForm caseId={id} existingFiles={existingFiles ?? []} />;
}
