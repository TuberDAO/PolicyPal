-- Add a nullable JSONB column to capture traffic attribution at case creation.
-- Stores first-touch and session-touch UTM/referrer data written by the browser.
-- Existing rows default to NULL; case creation succeeds normally when absent.

ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS attribution jsonb DEFAULT NULL;
