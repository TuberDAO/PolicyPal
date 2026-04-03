/**
 * Case creation (transient) — reads localStorage draft, creates case in DB, redirects.
 * This page is only visited after sign-in with an active draft.
 * If no draft exists, redirects to /start.
 * Implementation will be added in the case-creation phase.
 */
export default function NewCasePage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-muted">Creating your case…</p>
    </div>
  );
}
