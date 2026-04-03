import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

/**
 * Terms of service page — static legal content.
 * Final copy will be added in a later phase.
 */
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-4 text-muted">Content will be added before launch.</p>
    </div>
  );
}
