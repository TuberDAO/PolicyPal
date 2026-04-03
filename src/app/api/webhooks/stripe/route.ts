import { NextResponse } from "next/server";

/**
 * Stripe webhook endpoint — receives checkout.session.completed and other events.
 * Verifies signature, transitions case draft→submitted, triggers confirmation emails.
 * Implementation will be added in the Stripe phase.
 */
export async function POST() {
  // TODO: Verify Stripe webhook signature
  // TODO: Handle checkout.session.completed (idempotent)
  // TODO: Update case status and send emails
  return NextResponse.json({ received: true });
}
