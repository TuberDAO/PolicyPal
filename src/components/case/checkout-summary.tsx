"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ISSUE_TYPE_LABELS, PRICING, TURNAROUND, FLAGS } from "@/constants";
import { updateTurnaround, createCheckoutSession } from "@/actions/checkout";
import type { TurnaroundType, IssueType } from "@/types";

const DESCRIPTION_PREVIEW_LENGTH = 200;

interface CheckoutSummaryProps {
  caseId: string;
  issueTypes: IssueType[];
  state: string;
  description: string;
  fileCount: number;
  initialTurnaround: TurnaroundType;
}

export function CheckoutSummary({
  caseId,
  issueTypes,
  state,
  description,
  fileCount,
  initialTurnaround,
}: CheckoutSummaryProps) {
  const [turnaround, setTurnaround] =
    useState<TurnaroundType>(initialTurnaround);
  const [isSaving, startSaving] = useTransition();
  const [saveError, setSaveError] = useState("");
  const [isSubmitting, startSubmitting] = useTransition();
  const [submitError, setSubmitError] = useState("");

  function handleTurnaroundChange(value: TurnaroundType) {
    if (value === turnaround) return;
    setSaveError("");
    const previous = turnaround;
    setTurnaround(value);
    startSaving(async () => {
      const result = await updateTurnaround({ caseId, turnaround: value });
      if (result.error) {
        setTurnaround(previous);
        setSaveError(result.error);
      }
    });
  }

  function handleContinueToPayment() {
    setSubmitError("");
    startSubmitting(async () => {
      const result = await createCheckoutSession({ caseId });
      if (result.error) {
        setSubmitError(result.error);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  const descriptionPreview =
    description.length > DESCRIPTION_PREVIEW_LENGTH
      ? description.slice(0, DESCRIPTION_PREVIEW_LENGTH) + "\u2026"
      : description;

  const currentPrice =
    turnaround === "quick_question"
      ? PRICING.QUICK_QUESTION_PRICE_USD
      : turnaround === "rush"
        ? PRICING.RUSH_PRICE_USD
        : PRICING.STANDARD_PROMO_PRICE_USD;

  return (
    <div className="space-y-6">
      {/* Case summary */}
      <section className="space-y-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Your case summary</h2>

        <div className="space-y-3 text-sm">
          <SummaryRow label="Issues">
            <div className="flex flex-wrap gap-2">
              {issueTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent"
                >
                  {ISSUE_TYPE_LABELS[type] ?? type}
                </span>
              ))}
            </div>
          </SummaryRow>

          <SummaryRow label="State">
            <p className="text-foreground">{state}</p>
          </SummaryRow>

          <SummaryRow label="Description">
            <p className="leading-relaxed text-foreground">
              {descriptionPreview}
            </p>
          </SummaryRow>

          <SummaryRow label="Uploaded files">
            <p className="text-foreground">
              {fileCount === 0
                ? "None \u2014 you can add documents later"
                : `${fileCount} file${fileCount === 1 ? "" : "s"}`}
            </p>
          </SummaryRow>
        </div>
      </section>

      {/* Pre-payment edit links */}
      <div className="flex gap-4 text-sm">
        <Link
          href={`/case/${caseId}/edit`}
          className="text-accent underline-offset-2 hover:underline"
        >
          Edit details
        </Link>
        <Link
          href={`/case/${caseId}/upload`}
          className="text-accent underline-offset-2 hover:underline"
        >
          Manage documents
        </Link>
      </div>

      {/* Reassurance */}
      <p className="flex items-start gap-2 rounded-lg bg-accent-light px-4 py-3 text-xs leading-relaxed text-muted">
        <SavedIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        Your work is saved. You can still add updates later from your dashboard.
      </p>

      {/* Turnaround selection */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Choose your turnaround</h2>

        <div className="grid gap-3">
          {FLAGS.QUICK_QUESTION_ENABLED && (
            <TurnaroundOption
              label="Quick Question"
              price={PRICING.QUICK_QUESTION_PRICE_USD}
              turnaroundCopy="One specific question answered"
              selected={turnaround === "quick_question"}
              disabled={isSaving}
              onClick={() => handleTurnaroundChange("quick_question")}
            />
          )}
          <TurnaroundOption
            label="Standard"
            price={PRICING.STANDARD_PROMO_PRICE_USD}
            regularPrice={PRICING.STANDARD_REGULAR_PRICE_USD}
            turnaroundCopy={TURNAROUND.STANDARD_LABEL}
            selected={turnaround === "standard"}
            disabled={isSaving}
            onClick={() => handleTurnaroundChange("standard")}
          />
          {FLAGS.RUSH_ENABLED && (
            <TurnaroundOption
              label="Rush"
              price={PRICING.RUSH_PRICE_USD}
              turnaroundCopy={TURNAROUND.RUSH_LABEL}
              selected={turnaround === "rush"}
              disabled={isSaving}
              onClick={() => handleTurnaroundChange("rush")}
            />
          )}
        </div>

        {saveError && <p className="text-sm text-error">{saveError}</p>}
      </section>

      {/* Payment CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleContinueToPayment}
          disabled={isSaving || isSubmitting}
          className="block w-full rounded-lg bg-cta px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-cta-hover disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting
            ? "Processing\u2026"
            : `Continue to payment \u2014 $${currentPrice}`}
        </button>
        {submitError && (
          <p className="mt-2 text-center text-sm text-error">{submitError}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-muted">{label}</span>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

interface TurnaroundOptionProps {
  label: string;
  price: number;
  regularPrice?: number;
  turnaroundCopy: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function TurnaroundOption({
  label,
  price,
  regularPrice,
  turnaroundCopy,
  selected,
  disabled,
  onClick,
}: TurnaroundOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
        selected
          ? "border-accent bg-accent-light"
          : "border-border bg-surface hover:border-accent/50"
      } disabled:pointer-events-none disabled:opacity-50`}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-accent" : "border-border"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
      </span>

      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-sm font-semibold text-foreground">
            ${price}
            {regularPrice != null && regularPrice !== price && (
              <span className="ml-1.5 text-xs font-normal text-muted line-through">
                ${regularPrice}
              </span>
            )}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">{turnaroundCopy}</p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                  */
/* ------------------------------------------------------------------ */

function SavedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
