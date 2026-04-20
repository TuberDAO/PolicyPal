/**
 * Stripe server client — for creating Checkout Sessions and verifying webhooks.
 * ONLY used in server actions and API routes.
 */

import Stripe from "stripe";
import { getServerEnv } from "@/env";

let cached: Stripe | null = null;

// Pin the Stripe API version explicitly. Without this, Stripe uses the
// account's default version, which can shift silently and break the webhook
// event contract. Bump this value intentionally after reviewing changelogs.
const STRIPE_API_VERSION = "2026-03-25.dahlia" as const;

export function getStripe(): Stripe {
  if (!cached) {
    const { STRIPE_SECRET_KEY } = getServerEnv();
    cached = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_API_VERSION,
    });
  }
  return cached;
}
