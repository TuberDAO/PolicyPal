import { z } from "zod";

/**
 * Environment Variable Validation
 *
 * Server-side secrets and public client vars are validated separately.
 * - getServerEnv() throws if called on the client or if vars are missing.
 * - getClientEnv() validates NEXT_PUBLIC_* vars available in any context.
 *
 * Usage:
 *   import { getServerEnv } from '@/env';
 *   const env = getServerEnv();
 *   env.STRIPE_SECRET_KEY
 */

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Missing SUPABASE_SERVICE_ROLE_KEY"),
  STRIPE_SECRET_KEY: z.string().min(1, "Missing STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "Missing STRIPE_WEBHOOK_SECRET"),
  STRIPE_PRICE_QUICK_QUESTION: z.string().min(1, "Missing STRIPE_PRICE_QUICK_QUESTION"),
  STRIPE_PRICE_STANDARD: z.string().min(1, "Missing STRIPE_PRICE_STANDARD"),
  STRIPE_PRICE_RUSH: z.string().min(1, "Missing STRIPE_PRICE_RUSH"),
  RESEND_API_KEY: z.string().min(1, "Missing RESEND_API_KEY"),
  RESEND_FROM_EMAIL: z.string().min(1, "Missing RESEND_FROM_EMAIL"),
  SENTRY_DSN: z.string().min(1, "Missing SENTRY_DSN"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  NEXT_PUBLIC_SITE_URL: z.string().url("Invalid NEXT_PUBLIC_SITE_URL"),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

let cachedServerEnv: ServerEnv | null = null;
let cachedClientEnv: ClientEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "getServerEnv() was called on the client. Server secrets must never be exposed to the browser.",
    );
  }
  if (!cachedServerEnv) {
    cachedServerEnv = serverSchema.parse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_PRICE_QUICK_QUESTION: process.env.STRIPE_PRICE_QUICK_QUESTION,
      STRIPE_PRICE_STANDARD: process.env.STRIPE_PRICE_STANDARD,
      STRIPE_PRICE_RUSH: process.env.STRIPE_PRICE_RUSH,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      SENTRY_DSN: process.env.SENTRY_DSN,
    });
  }
  return cachedServerEnv;
}

export function getClientEnv(): ClientEnv {
  if (!cachedClientEnv) {
    cachedClientEnv = clientSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
  }
  return cachedClientEnv;
}
