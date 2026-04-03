import { PRICING, TURNAROUND, FLAGS } from "@/constants";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Simple, transparent pricing
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
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
          </div>

          {FLAGS.RUSH_ENABLED && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
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
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          No subscription. No surprise paywall.
        </p>
      </div>
    </section>
  );
}
