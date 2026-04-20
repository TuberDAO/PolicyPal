-- PolicyPal — Atomic playbook publish function
-- Migration: 20260420000001_publish_playbook_atomic
--
-- Wraps the two writes that constitute a playbook publish into a single
-- PL/pgSQL function so they execute inside one implicit transaction.
-- Before this migration the application performed:
--   1. UPDATE/INSERT playbooks (sets sent_at)
--   2. UPDATE cases SET status = 'complete'
-- as separate round-trips. If step 1 succeeded and step 2 failed the
-- customer-visible playbook (gated on sent_at IS NOT NULL) would appear
-- while the case status remained in its previous state — a corrupted half-
-- published state that required manual correction.
--
-- The action (src/actions/playbook.ts) calls this via admin.rpc() so both
-- writes share the same Postgres transaction and either both commit or
-- both roll back.
--
-- search_path is fixed to 'public' to avoid ambient search_path injection
-- (required when SECURITY DEFINER is used).

CREATE OR REPLACE FUNCTION public.publish_playbook_atomic(
  p_case_id   uuid,
  p_author_id uuid,
  p_content   text,
  p_now       timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Upsert the playbook row. The playbooks table has UNIQUE (case_id) so
  -- ON CONFLICT targets that constraint. Re-publishing (editing after first
  -- publish) is supported — it simply overwrites content and refreshes sent_at.
  INSERT INTO public.playbooks (case_id, author_id, content, sent_at, updated_at)
  VALUES (p_case_id, p_author_id, p_content, p_now, p_now)
  ON CONFLICT (case_id) DO UPDATE
    SET content    = EXCLUDED.content,
        author_id  = EXCLUDED.author_id,
        sent_at    = EXCLUDED.sent_at,
        updated_at = EXCLUDED.updated_at;

  -- Transition the case to complete. Any case whose status is not 'draft'
  -- may be published to (the action enforces this guard before the RPC call,
  -- but re-asserting here keeps the function safe if called directly).
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
