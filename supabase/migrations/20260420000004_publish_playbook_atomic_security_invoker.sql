-- Fix: change publish_playbook_atomic from SECURITY DEFINER to SECURITY INVOKER.
--
-- The protect_case_status trigger (migration 20260406000000) allows a status
-- change only when current_user = 'service_role' OR is_staff() returns true.
-- With SECURITY DEFINER the function executed as its owner role, not as the
-- calling service_role, so current_user was never 'service_role' inside the
-- trigger and the UPDATE was rejected with "Only staff can change case status".
--
-- SECURITY INVOKER preserves the calling role (service_role, via the admin
-- client) all the way through the function body, so the trigger check passes
-- exactly as it did before the atomic RPC was introduced.
--
-- The explicit SET search_path = public is kept: it remains valid and
-- recommended regardless of security mode.
--
-- CREATE OR REPLACE preserves existing GRANT/REVOKE applied by migrations
-- 20260420000002 and 20260420000003.

CREATE OR REPLACE FUNCTION public.publish_playbook_atomic(
  p_case_id   uuid,
  p_author_id uuid,
  p_content   text,
  p_now       timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.playbooks (case_id, author_id, content, sent_at, updated_at)
  VALUES (p_case_id, p_author_id, p_content, p_now, p_now)
  ON CONFLICT (case_id) DO UPDATE
    SET content    = EXCLUDED.content,
        author_id  = EXCLUDED.author_id,
        sent_at    = EXCLUDED.sent_at,
        updated_at = EXCLUDED.updated_at;

  UPDATE public.cases
  SET
    status       = 'complete',
    completed_at = p_now,
    updated_at   = p_now
  WHERE id = p_case_id
    AND status <> 'draft';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'publish_playbook_atomic: case % not found or is still a draft', p_case_id;
  END IF;
END;
$$;
