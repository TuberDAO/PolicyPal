import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CheckoutSummary } from "@/components/case/checkout-summary";

export const metadata: Metadata = { title: "Review & Checkout" };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, status, issue_types, state, description, turnaround")
    .eq("id", id)
    .single();

  if (!caseRow) notFound();

  if (caseRow.status !== "draft") {
    redirect("/dashboard");
  }

  const { count: fileCount } = await supabase
    .from("case_files")
    .select("id", { count: "exact", head: true })
    .eq("case_id", id);

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Review &amp; Checkout
      </h1>
      <CheckoutSummary
        caseId={caseRow.id}
        issueTypes={caseRow.issue_types}
        state={caseRow.state}
        description={caseRow.description}
        fileCount={fileCount ?? 0}
        initialTurnaround={caseRow.turnaround}
      />
    </div>
  );
}
