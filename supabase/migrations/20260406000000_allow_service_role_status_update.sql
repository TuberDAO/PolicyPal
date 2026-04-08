-- Allow the service_role (used by webhook handlers and admin operations)
-- to update case status. The original trigger only checked is_staff(),
-- which relies on auth.uid() — unavailable in service_role context.

CREATE OR REPLACE FUNCTION public.protect_case_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status
     AND current_user <> 'service_role'
     AND NOT public.is_staff() THEN
    RAISE EXCEPTION 'Only staff can change case status';
  END IF;
  RETURN NEW;
END;
$$;
