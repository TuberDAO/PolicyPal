/**
 * App-level type definitions.
 * Enums and interfaces used across the application.
 */

export type UserRole = "customer" | "reviewer" | "admin";

export type IssueType =
  | "denied_claim"
  | "medical_bill"
  | "eob_confusion"
  | "prior_authorization"
  | "eligibility"
  | "coordination_of_benefits"
  | "network_provider_billing"
  | "employer_plan"
  | "collections"
  | "not_sure";

export type CaseStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "awaiting_info"
  | "complete";

export type TurnaroundType = "standard" | "rush";

/**
 * Shape of the intake draft stored in localStorage before sign-in.
 * Turnaround type is NOT part of the draft — it is selected at checkout.
 */
export interface IntakeDraft {
  issueTypes: IssueType[];
  state: string;
  description: string;
  insurerName?: string;
  providerName?: string;
  urgency?: string;
  desiredOutcome?: string;
  alreadyTried?: string;
  savedAt: string;
}
