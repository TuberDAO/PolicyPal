/**
 * PolicyPal — Locked Business Constants
 *
 * Central source of truth for brand copy, pricing, and product configuration.
 * Changes here affect the entire app. Do not scatter these values into components.
 */

export const BRAND = {
  name: "PolicyPal",
  descriptor: "Bills, claims & coverage help",
} as const;

export const PRICING = {
  QUICK_QUESTION_PRICE_USD: 19,
  STANDARD_PROMO_PRICE_USD: 67,
  STANDARD_REGULAR_PRICE_USD: 99,
  RUSH_PRICE_USD: 149,
} as const;

export const TURNAROUND = {
  STANDARD_LABEL: "Delivered within 3 business days, often faster",
  RUSH_LABEL: "Delivered within 1 business day",
  STANDARD_DAYS: 3,
  RUSH_DAYS: 1,
} as const;

/** Advances a date by N weekdays (Mon–Fri), skipping Sat/Sun only. */
function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

/**
 * Returns a human-readable expected-by string based on business days from now.
 * Weekends are skipped; no holiday dataset is used — the copy notes this instead.
 * Example: "By Mon, Apr 14 at the latest — often sooner. Public holidays may add a day."
 */
export function formatExpectedBy(businessDays: number): string {
  const target = addBusinessDays(new Date(), businessDays);
  const formatted = target.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `By ${formatted} at the latest — often sooner. Public holidays may add a day.`;
}

export const UPLOAD_LIMITS = {
  MAX_FILES_PER_BATCH: 10,
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024, // 15 MB
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/heic",
    "application/pdf",
  ] as readonly string[],
} as const;

/**
 * Feature flags — toggled manually for launch control.
 * These are NOT dynamic runtime flags. Change and redeploy.
 */
export const FLAGS = {
  RUSH_ENABLED: true,
  QUICK_QUESTION_ENABLED: true,
} as const;

/**
 * Stripe Price IDs — set via env vars, referenced here for documentation.
 * Actual values come from env.ts at runtime.
 * Promo pricing is controlled manually: update the STRIPE_PRICE_STANDARD
 * env var to switch between promo and regular price IDs.
 */
export const STRIPE = {
  PRICE_ID_QUICK_QUESTION: process.env.STRIPE_PRICE_QUICK_QUESTION ?? "",
  PRICE_ID_STANDARD: process.env.STRIPE_PRICE_STANDARD ?? "",
  PRICE_ID_RUSH: process.env.STRIPE_PRICE_RUSH ?? "",
} as const;

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  denied_claim: "Denied Claim",
  medical_bill: "Medical Bill",
  eob_confusion: "EOB Confusion",
  prior_authorization: "Prior Authorization",
  eligibility: "Eligibility",
  coordination_of_benefits: "Coordination of Benefits",
  network_provider_billing: "Network / Provider Billing",
  employer_plan: "Employer Plan",
  collections: "Collections",
  not_sure: "Not Sure",
} as const;

/** User-facing labels for the intake issue-selection step. */
export const ISSUE_TYPE_INTAKE_LABELS: Record<string, string> = {
  denied_claim: "Claim denied",
  medical_bill: "Bill seems wrong or too high",
  eob_confusion: "EOB does not make sense",
  prior_authorization: "Prior authorization problem",
  eligibility: "Coverage ended or eligibility issue",
  coordination_of_benefits: "Coordination of benefits issue",
  network_provider_billing: "Network or provider billing problem",
  employer_plan: "Employer or HR benefits issue",
  collections: "Debt, collections, or payment pressure",
  not_sure: "Something else or not sure",
} as const;

export const CASE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  awaiting_info: "Awaiting Information",
  complete: "Complete",
} as const;
