"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { intakeDraftSchema } from "@/utils/validation";

const createCaseInput = intakeDraftSchema.omit({ savedAt: true });

type CreateCaseResult =
  | { id: string; error?: never }
  | { id?: never; error: string };

export async function createCase(
  input: z.infer<typeof createCaseInput>,
): Promise<CreateCaseResult> {
  const parsed = createCaseInput.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid intake data. Please go back and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a case." };
  }

  const { issueTypes, state, description, ...optionalFields } = parsed.data;

  const { data, error } = await supabase
    .from("cases")
    .insert({
      customer_id: user.id,
      issue_types: issueTypes,
      state,
      description,
      insurer_name: optionalFields.insurerName ?? null,
      provider_name: optionalFields.providerName ?? null,
      urgency: optionalFields.urgency ?? null,
      desired_outcome: optionalFields.desiredOutcome ?? null,
      already_tried: optionalFields.alreadyTried ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Failed to create case. Please try again." };
  }

  return { id: data.id };
}
