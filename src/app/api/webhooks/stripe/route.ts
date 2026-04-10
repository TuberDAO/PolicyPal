import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { getStripe } from "@/lib/stripe";
import { getServerEnv } from "@/env";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook endpoint — receives checkout.session.completed and other events.
 * Verifies signature and transitions case draft → submitted exactly once.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const { STRIPE_WEBHOOK_SECRET } = getServerEnv();

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const caseId = session.metadata?.case_id;

    if (!caseId) {
      return NextResponse.json(
        { error: "Missing case_id in session metadata" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: caseRow } = await supabase
      .from("cases")
      .select("id, status, stripe_checkout_session_id")
      .eq("id", caseId)
      .single();

    if (!caseRow) {
      return NextResponse.json({ error: "Case not found" }, { status: 400 });
    }

    // Idempotent: if already beyond draft, treat as already processed
    if (caseRow.status !== "draft") {
      return NextResponse.json({ received: true });
    }

    // Only the session recorded on the case may transition it. Stale or
    // abandoned sessions (superseded by a newer createCheckoutSession call)
    // are acknowledged without modifying the case.
    if (caseRow.stripe_checkout_session_id !== session.id) {
      return NextResponse.json({ received: true });
    }

    const now = new Date().toISOString();
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const { data: updated, error: updateError } = await supabase
      .from("cases")
      .update({
        status: "submitted",
        paid_at: now,
        submitted_at: now,
        stripe_payment_intent_id: paymentIntent,
        amount_cents: session.amount_total ?? null,
      })
      .eq("id", caseId)
      .eq("status", "draft") // belt-and-suspenders against concurrent replays
      .eq("stripe_checkout_session_id", session.id) // only the matching session
      .select("id");

    if (updateError) {
      console.error("[stripe-webhook] Failed to update case:", updateError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    if (!updated || updated.length === 0) {
      // Zero rows affected — a concurrent delivery may have already applied the update.
      // Re-read to distinguish "already submitted" (idempotent success) from a real failure.
      const { data: recheck } = await supabase
        .from("cases")
        .select("status")
        .eq("id", caseId)
        .single();

      if (recheck?.status !== "submitted") {
        console.error("[stripe-webhook] Update affected zero rows and case is not submitted:", recheck?.status);
        return NextResponse.json({ error: "Case update did not apply" }, { status: 500 });
      }

      // Case is already submitted by a concurrent delivery — treat as idempotent success.
      return NextResponse.json({ received: true });
    }

    revalidatePath("/dashboard");
  }

  return NextResponse.json({ received: true });
}
