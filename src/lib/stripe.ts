/**
 * Stripe server client — for creating Checkout Sessions and verifying webhooks.
 * ONLY used in server actions and API routes.
 */

import Stripe from "stripe";
import { getServerEnv } from "@/env";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    const { STRIPE_SECRET_KEY } = getServerEnv();
    cached = new Stripe(STRIPE_SECRET_KEY);
  }
  return cached;
}
