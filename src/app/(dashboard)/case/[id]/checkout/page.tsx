import type { Metadata } from "next";

export const metadata: Metadata = { title: "Review & Pay" };

/**
 * Checkout page — review summary (issue types, description, turnaround, price) and pay.
 * Uses Stripe Checkout. No file upload requirement — written description alone is valid.
 * Implementation will be added in the Stripe phase.
 */
export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void params;
  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Review & Pay</h1>
      <p className="text-sm text-muted">
        Case summary and payment button will appear here.
      </p>
    </div>
  );
}
