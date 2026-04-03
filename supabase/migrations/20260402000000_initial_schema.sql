-- PolicyPal — Initial Database Schema
-- Migration: 20260402000000_initial_schema
--
-- Creates enums, helper functions, tables, indexes, triggers, and RLS policies
-- for the core application data model.

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE public.user_role AS ENUM ('customer', 'reviewer', 'admin');

CREATE TYPE public.issue_type AS ENUM (
  'denied_claim',
  'medical_bill',
  'eob_confusion',
  'prior_authorization',
  'eligibility',
  'coordination_of_benefits',
  'network_provider_billing',
  'employer_plan',
  'collections',
  'not_sure'
);

CREATE TYPE public.case_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'awaiting_info',
  'complete'
);

CREATE TYPE public.turnaround_type AS ENUM ('standard', 'rush');

-- =============================================================================
-- TABLES
-- =============================================================================
-- profiles must be created first because helper functions and other tables
-- reference it.

CREATE TABLE public.profiles (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.user_role NOT NULL DEFAULT 'customer',
  full_name  text        NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cases (
  id                         uuid                   PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id                uuid                   NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_types                public.issue_type[]    NOT NULL,
  state                      text                   NOT NULL,
  description                text                   NOT NULL,
  insurer_name               text                   NULL,
  provider_name              text                   NULL,
  urgency                    text                   NULL,
  desired_outcome            text                   NULL,
  already_tried              text                   NULL,
  turnaround                 public.turnaround_type NOT NULL DEFAULT 'standard',
  status                     public.case_status     NOT NULL DEFAULT 'draft',
  assigned_reviewer_id       uuid                   NULL REFERENCES public.profiles(id),
  stripe_checkout_session_id text                   NULL,
  stripe_payment_intent_id   text                   NULL,
  amount_cents               integer                NULL,
  paid_at                    timestamptz            NULL,
  submitted_at               timestamptz            NULL,
  completed_at               timestamptz            NULL,
  created_at                 timestamptz            NOT NULL DEFAULT now(),
  updated_at                 timestamptz            NOT NULL DEFAULT now(),

  CONSTRAINT cases_issue_types_not_empty
    CHECK (array_length(issue_types, 1) > 0),

  CONSTRAINT cases_state_valid
    CHECK (state IN (
      'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
      'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
      'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
      'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
      'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
      'DC'
    ))
);

CREATE TABLE public.case_files (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id           uuid        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  batch_id          uuid        NULL,
  storage_path      text        NOT NULL,
  original_filename text        NOT NULL,
  mime_type         text        NOT NULL,
  size_bytes        bigint      NOT NULL,
  uploaded_by       uuid        NOT NULL REFERENCES public.profiles(id),
  uploaded_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.case_updates (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     uuid        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  author_id   uuid        NOT NULL REFERENCES public.profiles(id),
  content     text        NOT NULL,
  is_internal boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.case_read_cursors (
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_id      uuid        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, case_id)
);

CREATE TABLE public.playbooks (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id    uuid        NOT NULL UNIQUE REFERENCES public.cases(id) ON DELETE CASCADE,
  author_id  uuid        NOT NULL REFERENCES public.profiles(id),
  content    text        NOT NULL,
  sent_at    timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.funnel_events (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   text        NOT NULL,
  user_id      uuid        NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_name   text        NOT NULL,
  metadata     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  referrer     text        NULL,
  utm_source   text        NULL,
  utm_medium   text        NULL,
  utm_campaign text        NULL,
  utm_term     text        NULL,
  utm_content  text        NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_cases_customer_id          ON public.cases (customer_id);
CREATE INDEX idx_cases_status               ON public.cases (status);
CREATE INDEX idx_cases_assigned_reviewer_id ON public.cases (assigned_reviewer_id);
CREATE INDEX idx_cases_updated_at           ON public.cases (updated_at DESC);
CREATE INDEX idx_cases_issue_types          ON public.cases USING gin (issue_types);

CREATE INDEX idx_case_updates_case_created  ON public.case_updates (case_id, created_at);
CREATE INDEX idx_case_files_case_uploaded   ON public.case_files (case_id, uploaded_at);

CREATE INDEX idx_funnel_events_session      ON public.funnel_events (session_id, created_at);
CREATE INDEX idx_funnel_events_user         ON public.funnel_events (user_id, created_at);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================
-- These are placed after tables so that the LANGUAGE sql functions can resolve
-- the profiles table reference at creation time.

-- Returns true if the current user is staff (admin or reviewer).
-- SECURITY DEFINER bypasses RLS on profiles to avoid circular policy checks.
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'reviewer')
  );
$$;

-- Returns true if the current user is an admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Generic updated_at trigger: sets updated_at = now() on every row update.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Auto-creates a profile when a user signs up via Supabase Auth.
-- SECURITY DEFINER is required to insert into public.profiles from auth context.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name'
    )
  );
  RETURN NEW;
END;
$$;

-- Prevents non-staff users from changing the status column on cases.
-- Called as a BEFORE UPDATE trigger.
CREATE OR REPLACE FUNCTION public.protect_case_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NOT public.is_staff() THEN
    RAISE EXCEPTION 'Only staff can change case status';
  END IF;
  RETURN NEW;
END;
$$;

-- Prevents non-admin users from changing the role column on profiles.
-- Called as a BEFORE UPDATE trigger.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  RETURN NEW;
END;
$$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-touch updated_at on row updates
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_playbooks_updated_at
  BEFORE UPDATE ON public.playbooks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile row on Supabase Auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Column-level guards (RLS cannot restrict individual columns)
CREATE TRIGGER protect_case_status
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.protect_case_status();

CREATE TRIGGER protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_files       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_updates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_read_cursors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_events    ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES — profiles
-- =============================================================================

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- No INSERT policy: profiles are created by the handle_new_user trigger
-- (SECURITY DEFINER), which bypasses RLS.

-- =============================================================================
-- RLS POLICIES — cases
-- =============================================================================

CREATE POLICY "Customers can view own cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Staff can view all cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Customers can create own cases"
  ON public.cases FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid() AND status = 'draft');

CREATE POLICY "Customers can update own cases"
  ON public.cases FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Staff can update any case"
  ON public.cases FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- =============================================================================
-- RLS POLICIES — case_files
-- =============================================================================

CREATE POLICY "Customers can view own case files"
  ON public.case_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_files.case_id
        AND cases.customer_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all case files"
  ON public.case_files FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Customers can upload to own draft or awaiting-info cases"
  ON public.case_files FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_files.case_id
        AND cases.customer_id = auth.uid()
        AND cases.status IN ('draft', 'awaiting_info')
    )
  );

CREATE POLICY "Staff can upload to any case"
  ON public.case_files FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- =============================================================================
-- RLS POLICIES — case_updates
-- =============================================================================

CREATE POLICY "Customers can view non-internal updates on own cases"
  ON public.case_updates FOR SELECT
  TO authenticated
  USING (
    NOT is_internal
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_updates.case_id
        AND cases.customer_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all updates"
  ON public.case_updates FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Customers can reply on own awaiting-info cases"
  ON public.case_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND NOT is_internal
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_updates.case_id
        AND cases.customer_id = auth.uid()
        AND cases.status = 'awaiting_info'
    )
  );

CREATE POLICY "Staff can add updates to any case"
  ON public.case_updates FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- =============================================================================
-- RLS POLICIES — case_read_cursors
-- =============================================================================

CREATE POLICY "Users can manage own read cursors"
  ON public.case_read_cursors FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all read cursors"
  ON public.case_read_cursors FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- =============================================================================
-- RLS POLICIES — playbooks
-- =============================================================================

-- Customers can only see a playbook once it has been sent.
CREATE POLICY "Customers can view sent playbooks on own cases"
  ON public.playbooks FOR SELECT
  TO authenticated
  USING (
    sent_at IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = playbooks.case_id
        AND cases.customer_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage all playbooks"
  ON public.playbooks FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- =============================================================================
-- RLS POLICIES — funnel_events
-- =============================================================================

-- Simple insert-only for both anonymous and authenticated visitors.
-- No sensitive checks in the policy to avoid leaking schema logic.
CREATE POLICY "Anyone can insert funnel events"
  ON public.funnel_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view funnel events"
  ON public.funnel_events FOR SELECT
  TO authenticated
  USING (public.is_staff());
