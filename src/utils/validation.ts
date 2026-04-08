import { z } from "zod";

/**
 * Shared Zod schemas — used on both client (intake form) and server (actions).
 * Keep validation logic here, not scattered across components.
 * Implementation will be expanded as features are built.
 */

export const ISSUE_TYPES = [
  "denied_claim",
  "medical_bill",
  "eob_confusion",
  "prior_authorization",
  "eligibility",
  "coordination_of_benefits",
  "network_provider_billing",
  "employer_plan",
  "collections",
  "not_sure",
] as const;

export const TURNAROUND_TYPES = ["quick_question", "standard", "rush"] as const;

export const US_STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
] as const;

/**
 * Validates the intake draft stored in localStorage before sign-in.
 * Turnaround type is NOT part of the draft — it is selected at checkout.
 */
export const intakeDraftSchema = z.object({
  issueTypes: z
    .array(z.enum(ISSUE_TYPES))
    .min(1, "Select at least one issue type"),
  state: z.enum(US_STATE_CODES, { message: "Select your state" }),
  description: z
    .string()
    .min(20, "Please describe your issue in more detail")
    .max(8000),
  insurerName: z.string().max(200).optional(),
  providerName: z.string().max(200).optional(),
  urgency: z.string().max(500).optional(),
  desiredOutcome: z.string().max(1000).optional(),
  alreadyTried: z.string().max(1000).optional(),
  savedAt: z.string(),
});
