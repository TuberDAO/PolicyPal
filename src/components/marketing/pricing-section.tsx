import Link from "next/link";
import { PRICING, TURNAROUND, FLAGS } from "@/constants";

const FULL_CASE_INCLUDES = [
  "Full review of your situation",
  "Step-by-step action plan",
  "Who to contact and in what order",
  "Escalation targets when needed, including specific names, departments, and decision makers",
  "Draft wording for calls, letters, and emails",
  "A plan you can check off step by step",
];

const QUICK_QUESTION_INCLUDES = [
  "For a simple question only",
  "One clear answer to a specific insurance or billing question",
  "Usually a short written response, not a full case review or action plan",
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

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75V4h2.25a.75.75 0 0 1 0 1.5h-.464l-1.2 7.186A2 2 0 0 1 9.35 14.5H5a.75.75 0 0 1 0-1.5h4.35a.5.5 0 0 0 .492-.41L10.964 5.5H7.75a.75.75 0 0 1 0-1.5H10V2.75A.75.75 0 0 1 10 2Zm3.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" clipRule="evenodd" />
            </svg>
            Clear pricing
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.5 2A1.5 1.5 0 0 0 4 3.5v.75H3.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1H16V3.5A1.5 1.5 0 0 0 14.5 2h-9ZM5.5 4.25H14.5V4h-9v.25ZM9.25 9a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM6 9.75A.75.75 0 0 1 6.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 9.75Zm6.75 0a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
            No subscription
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Z" clipRule="evenodd" />
            </svg>
            Private case review
          </span>
        </div>
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
