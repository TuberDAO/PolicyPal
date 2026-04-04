"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { TURNAROUND_TYPES } from "@/utils/validation";

/* ------------------------------------------------------------------ */
/*  updateTurnaround                                                  */
/* ------------------------------------------------------------------ */

const updateTurnaroundInput = z.object({
  caseId: z.string().uuid(),
  turnaround: z.enum(TURNAROUND_TYPES),
});

type UpdateTurnaroundResult =
  | { success: true; error?: never }
  | { success?: never; error: string };

export async function updateTurnaround(
  input: z.infer<typeof updateTurnaroundInput>,
): Promise<UpdateTurnaroundResult> {
  const parsed = updateTurnaroundInput.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid turnaround selection." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", parsed.data.caseId)
    .single();

  if (!caseRow) {
    return { error: "Case not found." };
  }

  if (caseRow.status !== "draft") {
    return { error: "Turnaround can only be changed on draft cases." };
  }

  const { error } = await supabase
    .from("cases")
    .update({ turnaround: parsed.data.turnaround })
    .eq("id", parsed.data.caseId);

  if (error) {
    return { error: "Failed to update turnaround. Please try again." };
  }

  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  createCheckoutSession (placeholder for Stripe phase)              */
/* ------------------------------------------------------------------ */

const createCheckoutInput = z.object({
  caseId: z.string().uuid(),
});

type CreateCheckoutSessionResult =
  | { url: string; error?: never }
  | { url?: never; error: string };

export async function createCheckoutSession(
  input: z.infer<typeof createCheckoutInput>,
): Promise<CreateCheckoutSessionResult> {
  const parsed = createCheckoutInput.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid request." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status, turnaround")
    .eq("id", parsed.data.caseId)
    .single();

  if (!caseRow) {
    return { error: "Case not found." };
  }

  if (caseRow.status !== "draft") {
    return { error: "This case has already been submitted." };
  }

  // TODO: Create Stripe Checkout session here using caseRow.turnaround
  // to determine the correct price ID, then store the session ID on the
  // case row and return the session URL for redirect.
  return { error: "Payment processing is being set up. Please try again soon." };
}
