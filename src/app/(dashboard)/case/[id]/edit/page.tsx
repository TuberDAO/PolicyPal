import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateCase } from "@/actions/case";
import { ISSUE_TYPE_LABELS } from "@/constants";
import { ISSUE_TYPES, US_STATE_CODES } from "@/utils/validation";

export const metadata: Metadata = { title: "Edit Case" };

export default async function EditCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: errorParam } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: c } = user
    ? await supabase
        .from("cases")
        .select(
          "id, status, stripe_checkout_session_id, issue_types, state, description, insurer_name, provider_name, urgency, desired_outcome, already_tried",
        )
        .eq("id", id)
        .eq("customer_id", user.id)
        .maybeSingle()
    : { data: null };

  if (!c) notFound();

  // Redirect away if not an editable draft
  if (c.status !== "draft" || c.stripe_checkout_session_id) {
    redirect(`/case/${id}`);
  }

  async function handleSave(formData: FormData) {
    "use server";

    const issueTypes = formData.getAll("issue_types") as string[];
    const state = (formData.get("state") as string) ?? "";
    const description = (formData.get("description") as string) ?? "";
    const insurerName = (formData.get("insurer_name") as string) || undefined;
    const providerName = (formData.get("provider_name") as string) || undefined;
    const urgency = (formData.get("urgency") as string) || undefined;
    const desiredOutcome = (formData.get("desired_outcome") as string) || undefined;
    const alreadyTried = (formData.get("already_tried") as string) || undefined;

    const result = await updateCase({
      caseId: id,
      issueTypes,
      state,
      description,
      insurerName,
      providerName,
      urgency,
      desiredOutcome,
      alreadyTried,
    });

    if (result.error) {
      redirect(`/case/${id}/edit?error=${encodeURIComponent(result.error)}`);
    }

    redirect(`/case/${id}/upload`);
  }

  const currentIssueTypes = c.issue_types as string[];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Case Details</h1>
        <Link
          href={`/case/${id}`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back
        </Link>
      </div>

      {errorParam && (
        <p className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          {errorParam}
        </p>
      )}

      <form action={handleSave} className="space-y-6">
        {/* Issue Types */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium uppercase tracking-wide text-muted">
            Issue Type(s) <span className="text-error">*</span>
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ISSUE_TYPES.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  name="issue_types"
                  value={type}
                  defaultChecked={currentIssueTypes.includes(type)}
                  className="h-4 w-4 rounded border-border text-accent"
                />
                {ISSUE_TYPE_LABELS[type] ?? type}
              </label>
            ))}
          </div>
        </fieldset>

        {/* State */}
        <div className="space-y-2">
          <label
            htmlFor="state"
            className="block text-xs font-medium uppercase tracking-wide text-muted"
          >
            State <span className="text-error">*</span>
          </label>
          <select
            id="state"
            name="state"
            defaultValue={c.state ?? ""}
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="" disabled>
              Select your state
            </option>
            {US_STATE_CODES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-xs font-medium uppercase tracking-wide text-muted"
          >
            Description <span className="text-error">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={c.description ?? ""}
            required
            minLength={20}
            maxLength={8000}
            rows={6}
            className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        {/* Optional fields */}
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Optional Details
          </p>

          <div className="space-y-2">
            <label htmlFor="insurer_name" className="block text-xs text-muted">
              Insurance company
            </label>
            <input
              id="insurer_name"
              name="insurer_name"
              type="text"
              defaultValue={c.insurer_name ?? ""}
              maxLength={200}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="provider_name" className="block text-xs text-muted">
              Provider / hospital
            </label>
            <input
              id="provider_name"
              name="provider_name"
              type="text"
              defaultValue={c.provider_name ?? ""}
              maxLength={200}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="urgency" className="block text-xs text-muted">
              Urgency / deadline
            </label>
            <input
              id="urgency"
              name="urgency"
              type="text"
              defaultValue={c.urgency ?? ""}
              maxLength={500}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="desired_outcome" className="block text-xs text-muted">
              Desired outcome
            </label>
            <textarea
              id="desired_outcome"
              name="desired_outcome"
              defaultValue={c.desired_outcome ?? ""}
              maxLength={1000}
              rows={3}
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="already_tried" className="block text-xs text-muted">
              What have you already tried?
            </label>
            <textarea
              id="already_tried"
              name="already_tried"
              defaultValue={c.already_tried ?? ""}
              maxLength={1000}
              rows={3}
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-cta px-6 py-2.5 text-sm font-semibold text-white hover:bg-cta-hover transition-colors"
          >
            Save and continue
          </button>
          <Link
            href={`/case/${id}`}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
