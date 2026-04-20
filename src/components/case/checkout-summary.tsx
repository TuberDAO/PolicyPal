"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { ISSUE_TYPE_LABELS, PRICING, TURNAROUND, FLAGS, formatExpectedBy } from "@/constants";
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

  const standardLabel = useMemo(() => formatExpectedBy(TURNAROUND.STANDARD_DAYS), []);
  const rushLabel = useMemo(() => formatExpectedBy(TURNAROUND.RUSH_DAYS), []);
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
              turnaroundCopy="One health insurance, billing, or benefits question"
              selected={turnaround === "quick_question"}
              disabled={isSaving}
              onClick={() => handleTurnaroundChange("quick_question")}
            />
          )}
          <TurnaroundOption
            label="Standard"
            price={PRICING.STANDARD_PROMO_PRICE_USD}
            regularPrice={PRICING.STANDARD_REGULAR_PRICE_USD}
            turnaroundCopy={standardLabel}
            selected={turnaround === "standard"}
            disabled={isSaving}
            onClick={() => handleTurnaroundChange("standard")}
          />
          {FLAGS.RUSH_ENABLED && (
            <TurnaroundOption
              label="Rush"
              price={PRICING.RUSH_PRICE_USD}
              turnaroundCopy={rushLabel}
              selected={turnaround === "rush"}
              disabled={isSaving}
              onClick={() => handleTurnaroundChange("rush")}
            />
          )}
        </div>

        {saveError && <p className="text-sm text-error">{saveError}</p>}
      </section>

      {/* Trust indicators */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          Clear pricing
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Z" clipRule="evenodd" />
          </svg>
          No subscription
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          One case manager
        </span>
      </div>

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
