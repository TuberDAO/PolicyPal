"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { IntakeDraft, IssueType } from "@/types";
import { ISSUE_TYPE_INTAKE_LABELS } from "@/constants";
import { intakeDraftSchema, US_STATE_CODES } from "@/utils/validation";

const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const DESC_MAX = 8000;

interface IntakeFormProps {
  draft: IntakeDraft;
  onFieldChange: (updated: Partial<IntakeDraft>) => void;
  onBack: () => void;
}

export function IntakeForm({ draft, onFieldChange, onBack }: IntakeFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleContinue() {
    setSubmitted(true);
    const result = intakeDraftSchema.safeParse(draft);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    router.push("/login?next=/case/new");
  }

  const descLength = draft.description?.length ?? 0;

  return (
    <div className="w-full max-w-lg animate-slide-up">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-semibold tracking-tight">
        Tell us about your issue
      </h1>

      {/* Selected issues */}
      <div className="mt-4 flex flex-wrap gap-2">
        {draft.issueTypes.map((type: IssueType) => (
          <span
            key={type}
            className="rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent"
          >
            {ISSUE_TYPE_INTAKE_LABELS[type] ?? type}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">
        Your draft is saved when you press Save and continue.
      </p>

      <div className="mt-8 space-y-6">
        {/* State — required */}
        <FieldGroup label="State" error={submitted ? errors.state : undefined}>
          <select
            value={draft.state}
            onChange={(e) => onFieldChange({ state: e.target.value })}
            className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm transition-colors ${
              submitted && errors.state
                ? "border-error"
                : "border-border focus:border-accent"
            } focus:outline-none focus:ring-2 focus:ring-accent/20`}
          >
            <option value="">Select your state</option>
            {US_STATE_CODES.map((code) => (
              <option key={code} value={code}>
                {US_STATE_NAMES[code]} ({code})
              </option>
            ))}
          </select>
        </FieldGroup>

        {/* Description — required */}
        <FieldGroup
          label="What happened?"
          error={submitted ? errors.description : undefined}
        >
          <textarea
            value={draft.description}
            onChange={(e) => onFieldChange({ description: e.target.value })}
            maxLength={DESC_MAX}
            rows={8}
            placeholder="Tell us what's going on in your own words. You can include the current problem, what happened, who said what, what you've already tried, and any deadlines."
            className={`w-full resize-y rounded-lg border bg-surface px-3 py-2.5 text-sm leading-relaxed transition-colors ${
              submitted && errors.description
                ? "border-error"
                : "border-border focus:border-accent"
            } focus:outline-none focus:ring-2 focus:ring-accent/20`}
          />
          <div className="mt-1 flex justify-end">
            <span
              className={`text-xs ${
                descLength > DESC_MAX * 0.9 ? "text-error" : "text-muted"
              }`}
            >
              {descLength.toLocaleString()} / {DESC_MAX.toLocaleString()}
            </span>
          </div>
        </FieldGroup>

        {/* Optional fields */}
        <div className="border-t border-border pt-6">
          <p className="text-sm font-medium text-muted">
            More context (optional)
          </p>

          <div className="mt-4 space-y-5">
            <FieldGroup label="Insurance company">
              <input
                type="text"
                value={draft.insurerName ?? ""}
                onChange={(e) =>
                  onFieldChange({ insurerName: e.target.value || undefined })
                }
                maxLength={200}
                placeholder="e.g. Blue Cross Blue Shield"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </FieldGroup>

            <FieldGroup label="Provider or hospital">
              <input
                type="text"
                value={draft.providerName ?? ""}
                onChange={(e) =>
                  onFieldChange({ providerName: e.target.value || undefined })
                }
                maxLength={200}
                placeholder="e.g. Memorial Hospital"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </FieldGroup>

            <FieldGroup label="Any deadline or urgency?">
              <input
                type="text"
                value={draft.urgency ?? ""}
                onChange={(e) =>
                  onFieldChange({ urgency: e.target.value || undefined })
                }
                maxLength={500}
                placeholder="e.g. Appeal deadline is April 30"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </FieldGroup>

            <FieldGroup label="What outcome are you hoping for?">
              <input
                type="text"
                value={draft.desiredOutcome ?? ""}
                onChange={(e) =>
                  onFieldChange({
                    desiredOutcome: e.target.value || undefined,
                  })
                }
                maxLength={1000}
                placeholder="e.g. Get the claim paid, reduce the bill"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </FieldGroup>

            <FieldGroup label="What have you already tried?">
              <textarea
                value={draft.alreadyTried ?? ""}
                onChange={(e) =>
                  onFieldChange({ alreadyTried: e.target.value || undefined })
                }
                maxLength={1000}
                rows={3}
                placeholder="e.g. Called insurance twice, filed a complaint"
                className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </FieldGroup>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-lg bg-cta px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
        >
          Save and continue
        </button>
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </label>
  );
}
