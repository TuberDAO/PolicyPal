"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/* ------------------------------------------------------------------ */
/*  Get customer-visible thread                                        */
/* ------------------------------------------------------------------ */

export type CustomerThreadMessage = {
  id: string;
  authorLabel: string;
  isStaff: boolean;
  content: string;
  createdAt: string;
};

export async function getCustomerThread(
  caseId: string,
): Promise<CustomerThreadMessage[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id")
    .eq("id", caseId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!caseRow) return [];

  const admin = createAdminClient();

  const { data: updates } = await admin
    .from("case_updates")
    .select("id, author_id, content, created_at")
    .eq("case_id", caseId)
    .eq("is_internal", false)
    .order("created_at", { ascending: true });

  if (!updates || updates.length === 0) return [];

  const authorIds = [...new Set(updates.map((u) => u.author_id))];
  const roleMap = new Map<string, string>();
  if (authorIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, role")
      .in("id", authorIds);
    profiles?.forEach((p) => roleMap.set(p.id, p.role));
  }

  return updates.map((u) => {
    const role = roleMap.get(u.author_id) ?? "customer";
    const isStaff = role === "admin" || role === "reviewer";
    return {
      id: u.id,
      authorLabel: isStaff ? "Your case manager" : "You",
      isStaff,
      content: u.content,
      createdAt: u.created_at,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Add customer reply                                                 */
/* ------------------------------------------------------------------ */

const replyInput = z.object({
  caseId: z.string().uuid(),
  content: z.string().min(1).max(4000),
});

export async function addCustomerReply(
  caseId: string,
  content: string,
): Promise<{ error?: string }> {
  const parsed = replyInput.safeParse({ caseId, content });
  if (!parsed.success) return { error: "Invalid message." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", parsed.data.caseId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!caseRow) return { error: "Case not found." };

  const allowedStatuses = ["submitted", "under_review", "awaiting_info", "complete"];
  if (!allowedStatuses.includes(caseRow.status)) {
    return { error: "You cannot reply to this case right now." };
  }

  const admin = createAdminClient();

  const { error } = await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: user.id,
    content: parsed.data.content.trim(),
    is_internal: false,
  });

  if (error) return { error: "Failed to send reply." };

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (caseRow.status === "awaiting_info") {
    updates.status = "under_review";
  }

  await admin
    .from("cases")
    .update(updates)
    .eq("id", parsed.data.caseId);

  revalidatePath(`/case/${caseId}`);
  revalidatePath(`/admin/case/${caseId}`);
  revalidatePath("/dashboard");
  return {};
}
