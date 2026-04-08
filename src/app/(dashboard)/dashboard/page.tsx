import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CASE_STATUS_LABELS, ISSUE_TYPE_LABELS } from "@/constants";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string }>;
}) {
  const { paid } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submittedCases } = user
    ? await supabase
        .from("cases")
        .select("id, status, issue_types, submitted_at")
        .eq("customer_id", user.id)
        .neq("status", "draft")
        .order("submitted_at", { ascending: false })
    : { data: [] };

  // Editable drafts: status=draft and not mid-payment (no stripe session yet)
  const { data: draftCases } = user
    ? await supabase
        .from("cases")
        .select("id, status, issue_types, created_at")
        .eq("customer_id", user.id)
        .eq("status", "draft")
        .is("stripe_checkout_session_id", null)
        .order("created_at", { ascending: false })
    : { data: [] };

  // When the webhook hasn't fired yet, the just-paid case is still draft.
  // Bridge that window by looking it up via the checkout session ID that
  // Stripe appended to the success_url. Ownership is enforced via customer_id.
  let pendingCase: {
    id: string;
    status: string;
    issue_types: string[];
    submitted_at: string | null;
  } | null = null;

  if (paid && user) {
    const { data } = await supabase
      .from("cases")
      .select("id, status, issue_types, submitted_at")
      .eq("customer_id", user.id)
      .eq("stripe_checkout_session_id", paid)
      .eq("status", "draft")
      .maybeSingle();
    pendingCase = data ?? null;
  }

  // Merge: pending case at top, then submitted cases. Overlap is impossible
  // since the pending query requires draft status, but the id filter is a
  // belt-and-suspenders guard for safety.
  const allSubmitted = [
    ...(pendingCase ? [pendingCase] : []),
    ...(submittedCases ?? []).filter((c) => c.id !== pendingCase?.id),
  ];

  const drafts = draftCases ?? [];
  const hasAnything = allSubmitted.length > 0 || drafts.length > 0;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your Cases</h1>
        <Link
          href="/start"
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          Start a new case
        </Link>
      </div>

      {!hasAnything ? (
        <p className="text-sm text-muted">
          Your cases will appear here. Start a new case or resume a saved draft.
        </p>
      ) : (
        <>
          {/* Drafts section */}
          {drafts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
                Drafts
              </h2>
              <ul className="space-y-3">
                {drafts.map((c) => (
                  <li key={c.id}>
                    <div className="rounded-lg border border-border bg-surface p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {c.issue_types
                              .map((t: string) => ISSUE_TYPE_LABELS[t] ?? t)
                              .join(", ")}
                          </p>
                          <p className="text-xs text-muted">
                            Started{" "}
                            {new Date(c.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                          Draft
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Link
                          href={`/case/${c.id}/upload`}
                          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 transition-colors"
                        >
                          Resume →
                        </Link>
                        <Link
                          href={`/case/${c.id}/edit`}
                          className="text-xs text-muted hover:text-foreground transition-colors"
                        >
                          Edit details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Submitted / current cases section */}
          {allSubmitted.length > 0 && (
            <section className="space-y-3">
              {drafts.length > 0 && (
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
                  Submitted Cases
                </h2>
              )}
              <ul className="space-y-3">
                {allSubmitted.map((c) => {
                  const isPending = pendingCase?.id === c.id;
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/case/${c.id}`}
                        className="block rounded-lg border border-border bg-surface p-4 hover:bg-accent-light transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                              {c.issue_types
                                .map((t: string) => ISSUE_TYPE_LABELS[t] ?? t)
                                .join(", ")}
                            </p>
                            <p className="text-xs text-muted">
                              {c.submitted_at
                                ? new Date(c.submitted_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </p>
                          </div>
                          {isPending ? (
                            <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                              Payment received — processing
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                              {CASE_STATUS_LABELS[c.status] ?? c.status}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
