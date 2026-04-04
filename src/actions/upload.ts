"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UPLOAD_LIMITS } from "@/constants";

const STORAGE_BUCKET = "case-files";

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
}

type UploadUrlResult =
  | { fileId: string; token: string; path: string; error?: never }
  | { fileId?: never; token?: never; path?: never; error: string };

export async function getUploadUrl(input: {
  caseId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<UploadUrlResult> {
  if (!UPLOAD_LIMITS.ALLOWED_MIME_TYPES.includes(input.mimeType)) {
    return { error: "File type not allowed. Please upload JPG, PNG, HEIC, or PDF." };
  }

  if (input.sizeBytes > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
    return { error: "File exceeds 15 MB limit." };
  }

  if (input.sizeBytes <= 0) {
    return { error: "File is empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status, customer_id")
    .eq("id", input.caseId)
    .single();

  if (!caseRow) return { error: "Case not found." };
  if (caseRow.customer_id !== user.id) return { error: "Access denied." };
  if (caseRow.status !== "draft") {
    return { error: "Uploads are only allowed for draft cases." };
  }

  const fileId = crypto.randomUUID();
  const sanitized = sanitizeFilename(input.fileName);
  const storagePath = `${input.caseId}/${fileId}_${sanitized}`;

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    return { error: "Failed to prepare upload. Please try again." };
  }

  return { fileId, token: data.token, path: storagePath };
}

type ConfirmUploadResult =
  | { id: string; error?: never }
  | { id?: never; error: string };

export async function confirmUpload(input: {
  caseId: string;
  fileId: string;
  storagePath: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  batchId: string;
}): Promise<ConfirmUploadResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data, error } = await supabase
    .from("case_files")
    .insert({
      id: input.fileId,
      case_id: input.caseId,
      storage_path: input.storagePath,
      original_filename: input.originalFilename,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      batch_id: input.batchId,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { id: input.fileId };
    return { error: "Failed to save upload record." };
  }

  return { id: data.id };
}
