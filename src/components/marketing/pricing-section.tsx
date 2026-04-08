import Link from "next/link";
import { PRICING, TURNAROUND, FLAGS } from "@/constants";

const FULL_CASE_INCLUDES = [
  "Full review of your situation",
  "Step-by-step action plan",
  "Who to contact and in what order",
  "Escalation targets when needed",
  "Draft wording for calls, letters, and emails",
  "A plan you can check off step by step",
];

const QUICK_QUESTION_INCLUDES = [
  "One specific question answered",
  "Clear, written response",
  "Tightly scoped guidance",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Simple, transparent pricing
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {/* Quick Question — secondary */}
          {FLAGS.QUICK_QUESTION_ENABLED && (
            <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold">
                Quick Question
              </h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">
                  ${PRICING.QUICK_QUESTION_PRICE_USD}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                One specific insurance, billing, or benefits question
              </p>
              <ul className="mt-5 space-y-2.5">
                {QUICK_QUESTION_INCLUDES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted"
                  >
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link
                  href="/start"
                  className="block rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-accent-light"
                >
                  Get started
                </Link>
              </div>
            </div>
          )}

          {/* Full Case Pack — primary */}
          <div className="relative flex flex-col rounded-2xl border-2 border-accent bg-surface p-6 shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white">
              Most popular
            </span>
            <h3 className="font-heading text-lg font-semibold">
              Full Case Pack
            </h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                ${PRICING.STANDARD_PROMO_PRICE_USD}
              </span>
              <span className="text-sm text-muted line-through">
                ${PRICING.STANDARD_REGULAR_PRICE_USD}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {TURNAROUND.STANDARD_LABEL}
            </p>
            <ul className="mt-5 space-y-2.5">
              {FULL_CASE_INCLUDES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <Link
                href="/start"
                className="block rounded-lg bg-cta px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
              >
                Start your review
              </Link>
            </div>
          </div>

          {/* Rush Review */}
          {FLAGS.RUSH_ENABLED && (
            <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold">
                Rush Review
              </h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">
                  ${PRICING.RUSH_PRICE_USD}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {TURNAROUND.RUSH_LABEL}
              </p>
              <p className="mt-4 text-sm text-muted">
                Same depth as the Full Case Pack, delivered faster.
              </p>
              <div className="mt-auto pt-6">
                <Link
                  href="/start"
                  className="block rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-accent-light"
                >
                  Start your review
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          No subscription. No surprise paywall. One price, one case.
        </p>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-success"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
