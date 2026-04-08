"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getServerEnv } from "@/env";
import { getClientEnv } from "@/env";
import { TURNAROUND_TYPES } from "@/utils/validation";
import type { TurnaroundType } from "@/types";

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
/*  createCheckoutSession                                             */
/* ------------------------------------------------------------------ */

function priceIdForTurnaround(turnaround: TurnaroundType): string {
  const env = getServerEnv();

  if (turnaround === "quick_question") {
    return env.STRIPE_PRICE_QUICK_QUESTION;
  }

  if (turnaround === "rush") {
    return env.STRIPE_PRICE_RUSH;
  }

  return env.STRIPE_PRICE_STANDARD;
}

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

  // RLS ensures only the case owner can see their own case
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

  const { NEXT_PUBLIC_SITE_URL } = getClientEnv();
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceIdForTurnaround(caseRow.turnaround), quantity: 1 }],
    customer_email: user.email ?? undefined,
    metadata: {
      case_id: caseRow.id,
      turnaround: caseRow.turnaround,
    },
    success_url: `${NEXT_PUBLIC_SITE_URL}/dashboard?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${NEXT_PUBLIC_SITE_URL}/case/${caseRow.id}/checkout`,
  });

  if (!session.url) {
    return { error: "Could not create payment session. Please try again." };
  }

  const { error: updateError } = await supabase
    .from("cases")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", caseRow.id);

  if (updateError) {
    return { error: "Failed to save checkout session. Please try again." };
  }

  return { url: session.url };
}
