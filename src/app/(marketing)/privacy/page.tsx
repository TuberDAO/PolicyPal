import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

/**
 * Privacy policy page — static legal content.
 * Final copy will be added in a later phase.
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-muted">Content will be added before launch.</p>
    </div>
  );
}
