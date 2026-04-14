"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCaseReadyEmail } from "@/actions/email";
import type { PlaybookContent } from "@/types/playbook";
import { parsePlaybookContent } from "@/types/playbook";

/* ------------------------------------------------------------------ */
/*  Auth helper                                                        */
/* ------------------------------------------------------------------ */

async function requireStaff(): Promise<{ userId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: string } | null;
  if (profile?.role !== "admin" && profile?.role !== "reviewer") {
    throw new Error("Forbidden");
  }

  return { userId: user.id };
}

/* ------------------------------------------------------------------ */
/*  Get draft playbook (admin only)                                    */
/* ------------------------------------------------------------------ */

export type PlaybookDraft = {
  content: PlaybookContent;
  updatedAt: string;
  sentAt: string | null;
};

export async function getDraftPlaybook(
  caseId: string,
): Promise<PlaybookDraft | null> {
  await requireStaff();
  const admin = createAdminClient();

  const { data } = await admin
    .from("playbooks")
    .select("content, updated_at, sent_at")
    .eq("case_id", caseId)
    .maybeSingle();

  if (!data) return null;

  return {
    content: parsePlaybookContent(data.content),
    updatedAt: data.updated_at,
    sentAt: data.sent_at,
  };
}

/* ------------------------------------------------------------------ */
/*  Save draft                                                         */
/* ------------------------------------------------------------------ */

const saveInput = z.object({
  caseId: z.string().uuid(),
  content: z.string().min(2).max(500_000),
});

export async function saveDraftPlaybook(
  caseId: string,
  content: string,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = saveInput.safeParse({ caseId, content });
  if (!parsed.success) return { error: "Invalid playbook data." };

  // Validate JSON parses correctly
  try {
    JSON.parse(parsed.data.content);
  } catch {
    return { error: "Invalid JSON content." };
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("playbooks")
    .select("id")
    .eq("case_id", parsed.data.caseId)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("playbooks")
      .update({
        content: parsed.data.content,
        author_id: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    if (error) return { error: "Failed to save draft." };
  } else {
    const { error } = await admin.from("playbooks").insert({
      case_id: parsed.data.caseId,
      author_id: userId,
      content: parsed.data.content,
    });
    if (error) return { error: "Failed to create draft." };
  }

  revalidatePath(`/admin/case/${caseId}/playbook`);
  return {};
}

/* ------------------------------------------------------------------ */
/*  Publish playbook                                                   */
/* ------------------------------------------------------------------ */

export async function publishPlaybook(
  caseId: string,
  content: string,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = saveInput.safeParse({ caseId, content });
  if (!parsed.success) return { error: "Invalid playbook data." };

  try {
    JSON.parse(parsed.data.content);
  } catch {
    return { error: "Invalid JSON content." };
  }

  const admin = createAdminClient();

  const { data: caseRow } = await admin
    .from("cases")
    .select("customer_id, status")
    .eq("id", parsed.data.caseId)
    .neq("status", "draft")
    .maybeSingle();

  if (!caseRow) return { error: "Case not found." };

  const now = new Date().toISOString();

  const { data: existing } = await admin
    .from("playbooks")
    .select("id")
    .eq("case_id", parsed.data.caseId)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("playbooks")
      .update({
        content: parsed.data.content,
        author_id: userId,
        sent_at: now,
        updated_at: now,
      })
      .eq("id", existing.id);
    if (error) return { error: "Failed to publish playbook." };
  } else {
    const { error } = await admin.from("playbooks").insert({
      case_id: parsed.data.caseId,
      author_id: userId,
      content: parsed.data.content,
      sent_at: now,
    });
    if (error) return { error: "Failed to publish playbook." };
  }

  const { error: statusError } = await admin
    .from("cases")
    .update({
      status: "complete",
      completed_at: now,
      updated_at: now,
    })
    .eq("id", parsed.data.caseId);

  if (statusError) return { error: "Playbook saved but status update failed." };

  await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: "Status changed to complete",
    is_internal: true,
  });

  const { data: authUser } = await admin.auth.admin.getUserById(
    caseRow.customer_id,
  );
  if (authUser?.user?.email) {
    try {
      await sendCaseReadyEmail(authUser.user.email);
    } catch {
      // Email failure should not block publish
    }
  }

  revalidatePath(`/admin/case/${caseId}/playbook`);
  revalidatePath(`/admin/case/${caseId}`);
  revalidatePath(`/case/${caseId}`);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return {};
}

/* ------------------------------------------------------------------ */
/*  Get published playbook (customer)                                  */
/* ------------------------------------------------------------------ */

export type PublishedPlaybook = {
  content: PlaybookContent;
  publishedAt: string;
};

export async function getPublishedPlaybook(
  caseId: string,
): Promise<PublishedPlaybook | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id")
    .eq("id", caseId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!caseRow) return null;

  const admin = createAdminClient();

  const { data } = await admin
    .from("playbooks")
    .select("content, sent_at")
    .eq("case_id", caseId)
    .not("sent_at", "is", null)
    .maybeSingle();

  if (!data || !data.sent_at) return null;

  return {
    content: parsePlaybookContent(data.content),
    publishedAt: data.sent_at,
  };
}
