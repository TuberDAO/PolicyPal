-- Migration: 20260407000000_add_quick_question_turnaround
--
-- Adds 'quick_question' to the turnaround_type enum so the Quick Question
-- product tier can be stored on cases. PostgreSQL requires ALTER TYPE to add
-- enum values; existing rows are unaffected.

ALTER TYPE public.turnaround_type ADD VALUE IF NOT EXISTS 'quick_question' BEFORE 'standard';
