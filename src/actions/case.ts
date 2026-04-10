"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { intakeDraftSchema, ISSUE_TYPES, US_STATE_CODES } from "@/utils/validation";

const STORAGE_BUCKET = "case-files";

const touchSchema = z
  .object({
    utm_source: z.string().max(200).nullable(),
    utm_medium: z.string().max(200).nullable(),
    utm_campaign: z.string().max(200).nullable(),
    utm_content: z.string().max(200).nullable(),
    utm_term: z.string().max(200).nullable(),
    referrer: z.string().max(500).nullable(),
    captured_at: z.string().max(50),
  })
  .nullable();

const attributionSchema = z
  .object({
    first_touch: touchSchema,
    session_touch: touchSchema,
  })
  .nullable()
  .optional();

const createCaseInput = intakeDraftSchema
  .omit({ savedAt: true })
  .extend({ attribution: attributionSchema });

type CreateCaseResult =
  | { id: string; error?: never }
  | { id?: never; error: string };

export async function createCase(
  input: z.infer<typeof createCaseInput>,
): Promise<CreateCaseResult> {
  const parsed = createCaseInput.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid intake data. Please go back and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a case." };
  }

  const { issueTypes, state, description, attribution, ...optionalFields } =
    parsed.data;

  const { data, error } = await supabase
    .from("cases")
    .insert({
      customer_id: user.id,
      issue_types: issueTypes,
      state,
      description,
      turnaround: "standard",
      insurer_name: optionalFields.insurerName ?? null,
      provider_name: optionalFields.providerName ?? null,
      urgency: optionalFields.urgency ?? null,
      desired_outcome: optionalFields.desiredOutcome ?? null,
      already_tried: optionalFields.alreadyTried ?? null,
      attribution: attribution ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Failed to create case. Please try again." };
  }

  return { id: data.id };
}

/* ------------------------------------------------------------------ */
/*  updateCase                                                         */
/* ------------------------------------------------------------------ */

const updateCaseInput = z.object({
  caseId: z.string().uuid(),
  issueTypes: z.array(z.enum(ISSUE_TYPES)).min(1, "Select at least one issue type"),
  state: z.enum(US_STATE_CODES, { message: "Select your state" }),
  description: z.string().min(20, "Please describe your issue in more detail").max(8000),
  insurerName: z.string().max(200).optional(),
  providerName: z.string().max(200).optional(),
  urgency: z.string().max(500).optional(),
  desiredOutcome: z.string().max(1000).optional(),
  alreadyTried: z.string().max(1000).optional(),
});

type UpdateCaseResult = { error?: string };

export async function updateCase(
  input: z.infer<typeof updateCaseInput>,
): Promise<UpdateCaseResult> {
  const parsed = updateCaseInput.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid case data." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status, stripe_checkout_session_id")
    .eq("id", parsed.data.caseId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!caseRow) return { error: "Case not found." };
  if (caseRow.status !== "draft") return { error: "Only draft cases can be edited." };
  if (caseRow.stripe_checkout_session_id) {
    return { error: "This case is already being processed and cannot be edited." };
  }

  const { error } = await supabase
    .from("cases")
    .update({
      issue_types: parsed.data.issueTypes,
      state: parsed.data.state,
      description: parsed.data.description,
      insurer_name: parsed.data.insurerName ?? null,
      provider_name: parsed.data.providerName ?? null,
      urgency: parsed.data.urgency ?? null,
      desired_outcome: parsed.data.desiredOutcome ?? null,
      already_tried: parsed.data.alreadyTried ?? null,
    })
    .eq("id", parsed.data.caseId)
    .eq("customer_id", user.id)
    .eq("status", "draft");

  if (error) return { error: "Failed to update case. Please try again." };
  return {};
}

/* ------------------------------------------------------------------ */
/*  deleteFile                                                         */
/* ------------------------------------------------------------------ */

type DeleteFileResult = { error?: string };

export async function deleteFile(
  caseId: string,
  fileId: string,
): Promise<DeleteFileResult> {
  if (!caseId || !fileId) return { error: "Invalid request." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", caseId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!caseRow) return { error: "Case not found." };
  if (caseRow.status !== "draft") return { error: "Files can only be removed from draft cases." };

  const { data: fileRow } = await supabase
    .from("case_files")
    .select("id, storage_path")
    .eq("id", fileId)
    .eq("case_id", caseId)
    .maybeSingle();

  if (!fileRow) return { error: "File not found." };

  const admin = createAdminClient();
  await admin.storage.from(STORAGE_BUCKET).remove([fileRow.storage_path]);

  const { error: dbError } = await admin
    .from("case_files")
    .delete()
    .eq("id", fileId)
    .eq("case_id", caseId);

  if (dbError) return { error: "Failed to remove file. Please try again." };
  revalidatePath(`/case/${caseId}/upload`);
  return {};
}
