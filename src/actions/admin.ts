"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { sendCaseUpdatedEmail, sendNeedMoreInfoEmail } from "@/actions/email";

type CaseStatus = Database["public"]["Enums"]["case_status"];

const ADMIN_STATUSES: CaseStatus[] = [
  "submitted",
  "under_review",
  "awaiting_info",
  "complete",
];

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
/*  Case list                                                          */
/* ------------------------------------------------------------------ */

export type AdminCaseListItem = {
  id: string;
  customerEmail: string;
  status: CaseStatus;
  issueTypes: string[];
  state: string;
  submittedAt: string | null;
  turnaround: string;
  assignedReviewerName: string | null;
  assignedReviewerId: string | null;
  updatedAt: string;
};

export async function getAdminCaseList(): Promise<AdminCaseListItem[]> {
  await requireStaff();
  const admin = createAdminClient();

  const { data: cases, error } = await admin
    .from("cases")
    .select(
      "id, customer_id, status, issue_types, state, submitted_at, turnaround, assigned_reviewer_id, updated_at",
    )
    .neq("status", "draft")
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (error || !cases) return [];

  const customerIds = [...new Set(cases.map((c) => c.customer_id))];
  const reviewerIds = [
    ...new Set(
      cases.map((c) => c.assigned_reviewer_id).filter(Boolean) as string[],
    ),
  ];

  const emailMap = new Map<string, string>();
  await Promise.all(
    customerIds.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      if (data?.user?.email) emailMap.set(id, data.user.email);
    }),
  );

  const reviewerMap = new Map<string, string>();
  if (reviewerIds.length > 0) {
    const { data: reviewers } = await admin
      .from("profiles")
      .select("id, full_name")
      .in("id", reviewerIds);
    reviewers?.forEach((r) => {
      reviewerMap.set(r.id, r.full_name ?? "Staff");
    });
  }

  return cases.map((c) => ({
    id: c.id,
    customerEmail: emailMap.get(c.customer_id) ?? "unknown",
    status: c.status,
    issueTypes: c.issue_types,
    state: c.state,
    submittedAt: c.submitted_at,
    turnaround: c.turnaround,
    assignedReviewerName: c.assigned_reviewer_id
      ? (reviewerMap.get(c.assigned_reviewer_id) ?? "Staff")
      : null,
    assignedReviewerId: c.assigned_reviewer_id,
    updatedAt: c.updated_at,
  }));
}

/* ------------------------------------------------------------------ */
/*  Case detail                                                        */
/* ------------------------------------------------------------------ */

export type AdminCaseDetail = {
  id: string;
  customerEmail: string;
  customerId: string;
  status: CaseStatus;
  issueTypes: string[];
  state: string;
  description: string;
  insurerName: string | null;
  providerName: string | null;
  urgency: string | null;
  desiredOutcome: string | null;
  alreadyTried: string | null;
  turnaround: string;
  amountCents: number | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  paidAt: string | null;
  assignedReviewerId: string | null;
  assignedReviewerName: string | null;
  files: {
    id: string;
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: string;
  }[];
  internalNotes: {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }[];
  customerUpdates: {
    id: string;
    authorId: string;
    authorLabel: string;
    isStaff: boolean;
    content: string;
    createdAt: string;
  }[];
};

export async function getAdminCaseDetail(
  caseId: string,
): Promise<AdminCaseDetail | null> {
  await requireStaff();
  const admin = createAdminClient();

  const { data: c } = await admin
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .maybeSingle();

  if (!c) return null;

  const { data: authUser } = await admin.auth.admin.getUserById(c.customer_id);
  const customerEmail = authUser?.user?.email ?? "unknown";

  let assignedReviewerName: string | null = null;
  if (c.assigned_reviewer_id) {
    const { data: reviewer } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", c.assigned_reviewer_id)
      .maybeSingle();
    assignedReviewerName = reviewer?.full_name ?? "Staff";
  }

  const { data: files } = await admin
    .from("case_files")
    .select("id, original_filename, mime_type, size_bytes, uploaded_at")
    .eq("case_id", caseId)
    .order("uploaded_at", { ascending: true });

  const { data: notes } = await admin
    .from("case_updates")
    .select("id, author_id, content, created_at")
    .eq("case_id", caseId)
    .eq("is_internal", true)
    .order("created_at", { ascending: false });

  const { data: customerUpdates } = await admin
    .from("case_updates")
    .select("id, author_id, content, created_at")
    .eq("case_id", caseId)
    .eq("is_internal", false)
    .order("created_at", { ascending: true });

  const allAuthorIds = [
    ...new Set([
      ...(notes ?? []).map((n) => n.author_id),
      ...(customerUpdates ?? []).map((u) => u.author_id),
    ]),
  ];
  const authorMap = new Map<string, string>();
  const authorRoleMap = new Map<string, string>();
  if (allAuthorIds.length > 0) {
    const { data: authors } = await admin
      .from("profiles")
      .select("id, full_name, role")
      .in("id", allAuthorIds);
    authors?.forEach((a) => {
      authorMap.set(a.id, a.full_name ?? "Staff");
      authorRoleMap.set(a.id, a.role);
    });
  }

  return {
    id: c.id,
    customerEmail,
    customerId: c.customer_id,
    status: c.status,
    issueTypes: c.issue_types,
    state: c.state,
    description: c.description,
    insurerName: c.insurer_name,
    providerName: c.provider_name,
    urgency: c.urgency,
    desiredOutcome: c.desired_outcome,
    alreadyTried: c.already_tried,
    turnaround: c.turnaround,
    amountCents: c.amount_cents,
    submittedAt: c.submitted_at,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    completedAt: c.completed_at,
    paidAt: c.paid_at,
    assignedReviewerId: c.assigned_reviewer_id,
    assignedReviewerName,
    files: (files ?? []).map((f) => ({
      id: f.id,
      originalFilename: f.original_filename,
      mimeType: f.mime_type,
      sizeBytes: f.size_bytes,
      uploadedAt: f.uploaded_at,
    })),
    internalNotes: (notes ?? []).map((n) => ({
      id: n.id,
      authorName: authorMap.get(n.author_id) ?? "Staff",
      content: n.content,
      createdAt: n.created_at,
    })),
    customerUpdates: (customerUpdates ?? []).map((u) => {
      const role = authorRoleMap.get(u.author_id) ?? "customer";
      const isStaff = role === "admin" || role === "reviewer";
      return {
        id: u.id,
        authorId: u.author_id,
        authorLabel: isStaff ? "PolicyPal" : "Customer",
        isStaff,
        content: u.content,
        createdAt: u.created_at,
      };
    }),
  };
}

/* ------------------------------------------------------------------ */
/*  Update case status                                                 */
/* ------------------------------------------------------------------ */

const updateStatusInput = z.object({
  caseId: z.string().uuid(),
  status: z.enum(["submitted", "under_review", "awaiting_info", "complete"]),
});

export async function updateCaseStatus(
  caseId: string,
  newStatus: string,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = updateStatusInput.safeParse({ caseId, status: newStatus });
  if (!parsed.success) return { error: "Invalid status." };

  if (!ADMIN_STATUSES.includes(parsed.data.status)) {
    return { error: "Invalid status transition." };
  }

  const admin = createAdminClient();

  const updates: Record<string, unknown> = {
    status: parsed.data.status,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.status === "complete") {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await admin
    .from("cases")
    .update(updates)
    .eq("id", parsed.data.caseId)
    .neq("status", "draft");

  if (error) return { error: "Failed to update status." };

  await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: `Status changed to ${parsed.data.status}`,
    is_internal: true,
  });

  revalidatePath(`/admin/case/${caseId}`);
  revalidatePath("/admin");
  return {};
}

/* ------------------------------------------------------------------ */
/*  Assign reviewer                                                    */
/* ------------------------------------------------------------------ */

const assignReviewerInput = z.object({
  caseId: z.string().uuid(),
  reviewerId: z.string().uuid().nullable(),
});

export async function assignReviewer(
  caseId: string,
  reviewerId: string | null,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = assignReviewerInput.safeParse({ caseId, reviewerId });
  if (!parsed.success) return { error: "Invalid input." };

  const admin = createAdminClient();

  if (parsed.data.reviewerId) {
    const { data: reviewer } = await admin
      .from("profiles")
      .select("role")
      .eq("id", parsed.data.reviewerId)
      .maybeSingle();

    const r = reviewer as { role: string } | null;
    if (r?.role !== "admin" && r?.role !== "reviewer") {
      return { error: "Selected user is not a staff member." };
    }
  }

  const { error } = await admin
    .from("cases")
    .update({
      assigned_reviewer_id: parsed.data.reviewerId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.caseId)
    .neq("status", "draft");

  if (error) return { error: "Failed to assign reviewer." };

  const action = parsed.data.reviewerId ? "assigned" : "unassigned";
  await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: `Reviewer ${action}`,
    is_internal: true,
  });

  revalidatePath(`/admin/case/${caseId}`);
  revalidatePath("/admin");
  return {};
}

/* ------------------------------------------------------------------ */
/*  Add internal note                                                  */
/* ------------------------------------------------------------------ */

const addNoteInput = z.object({
  caseId: z.string().uuid(),
  content: z.string().min(1).max(10000),
});

export async function addInternalNote(
  caseId: string,
  content: string,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = addNoteInput.safeParse({ caseId, content });
  if (!parsed.success) return { error: "Invalid note." };

  const admin = createAdminClient();

  const { error } = await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: parsed.data.content,
    is_internal: true,
  });

  if (error) return { error: "Failed to add note." };

  await admin
    .from("cases")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", parsed.data.caseId);

  revalidatePath(`/admin/case/${caseId}`);
  return {};
}

export type StaffMember = {
  id: string;
  fullName: string;
  email: string;
};

/* ------------------------------------------------------------------ */
/*  Send customer-visible update                                       */
/* ------------------------------------------------------------------ */

const customerMessageInput = z.object({
  caseId: z.string().uuid(),
  content: z.string().min(1).max(4000),
});

export async function sendCustomerUpdate(
  caseId: string,
  content: string,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = customerMessageInput.safeParse({ caseId, content });
  if (!parsed.success) return { error: "Invalid message." };

  const admin = createAdminClient();

  const { data: c } = await admin
    .from("cases")
    .select("customer_id")
    .eq("id", parsed.data.caseId)
    .neq("status", "draft")
    .maybeSingle();

  if (!c) return { error: "Case not found." };

  const { error } = await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: parsed.data.content.trim(),
    is_internal: false,
  });

  if (error) return { error: "Failed to send update." };

  await admin
    .from("cases")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", parsed.data.caseId);

  const { data: authUser } = await admin.auth.admin.getUserById(c.customer_id);
  if (authUser?.user?.email) {
    try {
      await sendCaseUpdatedEmail(authUser.user.email);
    } catch (err) {
      console.error("[email] Failed to send case_updated for case", parsed.data.caseId, err);
      await admin.from("case_updates").insert({
        case_id: parsed.data.caseId,
        author_id: userId,
        content: "Email notification (case update) failed to send. Staff should follow up manually.",
        is_internal: true,
      });
    }
  }

  revalidatePath(`/admin/case/${caseId}`);
  revalidatePath(`/case/${caseId}`);
  return {};
}

/* ------------------------------------------------------------------ */
/*  Request more information                                           */
/* ------------------------------------------------------------------ */

export async function requestMoreInfo(
  caseId: string,
  content: string,
): Promise<{ error?: string }> {
  const { userId } = await requireStaff();
  const parsed = customerMessageInput.safeParse({ caseId, content });
  if (!parsed.success) return { error: "Invalid message." };

  const admin = createAdminClient();

  const { data: c } = await admin
    .from("cases")
    .select("customer_id")
    .eq("id", parsed.data.caseId)
    .neq("status", "draft")
    .maybeSingle();

  if (!c) return { error: "Case not found." };

  const { error: msgError } = await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: parsed.data.content.trim(),
    is_internal: false,
  });

  if (msgError) return { error: "Failed to send request." };

  const { error: statusError } = await admin
    .from("cases")
    .update({
      status: "awaiting_info" as CaseStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.caseId);

  if (statusError) return { error: "Message sent but status update failed." };

  await admin.from("case_updates").insert({
    case_id: parsed.data.caseId,
    author_id: userId,
    content: "Status changed to awaiting_info",
    is_internal: true,
  });

  const { data: authUser } = await admin.auth.admin.getUserById(c.customer_id);
  if (authUser?.user?.email) {
    try {
      await sendNeedMoreInfoEmail(authUser.user.email);
    } catch (err) {
      console.error("[email] Failed to send need_more_info for case", parsed.data.caseId, err);
      await admin.from("case_updates").insert({
        case_id: parsed.data.caseId,
        author_id: userId,
        content: "Email notification (more info request) failed to send. Staff should follow up manually.",
        is_internal: true,
      });
    }
  }

  revalidatePath(`/admin/case/${caseId}`);
  revalidatePath(`/case/${caseId}`);
  revalidatePath("/admin");
  return {};
}

/* ------------------------------------------------------------------ */
/*  Staff list (for reviewer dropdown)                                 */
/* ------------------------------------------------------------------ */

export async function getStaffMembers(): Promise<StaffMember[]> {
  await requireStaff();
  const admin = createAdminClient();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, role")
    .or("role.eq.admin,role.eq.reviewer")
    .order("full_name", { ascending: true });

  if (!profiles) return [];

  const members: StaffMember[] = [];
  await Promise.all(
    profiles.map(async (p) => {
      const { data } = await admin.auth.admin.getUserById(p.id);
      members.push({
        id: p.id,
        fullName: p.full_name ?? data?.user?.email ?? "Staff",
        email: data?.user?.email ?? "",
      });
    }),
  );

  return members.sort((a, b) => a.fullName.localeCompare(b.fullName));
}
