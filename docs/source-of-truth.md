# PolicyPal — source of truth

Concise, authoritative product and flow decisions. For implementation details, see `README.md`, `src/constants.ts`, and the database migration.

## What PolicyPal is

A mobile-first **paid** service that helps U.S. consumers with **bills, claims, and coverage** problems. Customers describe their situation, upload documents, pay for a review, and receive a **human-written** step-by-step playbook—not an automated AI-first product.

## Who it is for

**U.S. consumers** dealing with health insurance and related billing issues (denied claims, confusing bills/EOBs, eligibility, prior auth, etc.).

## Launch model

**Manual concierge at launch:** real people review cases, write playbooks, and handle the work end to end. v1 is not a self-serve “AI answers everything” product.

## Approved funnel

Order is fixed:

1. **Landing** (public marketing)
2. **Short issue selection** (multi-select; not a giant first screen)
3. **Main intake** (description, state, optional context)
4. **Sign-in**
5. **Upload** (documents)
6. **Review summary / checkout** (includes turnaround choice and payment)
7. **Submit** (case proceeds after payment per product rules)

**Uploads happen after sign-in and before payment.** Turnaround (standard vs rush) is chosen at **review summary / checkout**, not during pre-auth intake.

## Launch authentication

**Google OAuth and email magic link only.** No password authentication.

## Pricing

| Offering | Price (USD) |
|----------|----------------|
| Quick Question | **$19** |
| Full Case Pack (Standard) | **$67** promo / **$99** regular |
| Rush Review | **$149** |

**Quick Question** is for one specific insurance, billing, or benefits question — a single clear written answer. It is not a full case review, escalation pack, or deep document review.

**Full Case Pack** is the primary offering: full review, detailed action plan, scripts, and escalation strategy when needed.

**Rush Review** is the same depth as Full Case Pack, delivered within 1 business day.

Promo vs regular for Full Case Pack is controlled **manually** (e.g. Stripe price IDs / env)—**no automated “first 100 customers” or cohort logic** in the product.

## Turnaround

| Option | Commitment |
|--------|----------------|
| Standard | Delivered within **3 business days**, often faster |
| Rush | Delivered within **1 business day** |

## Playbook

The customer-facing playbook is **human-written** by staff (not generated as the primary deliverable).

## Main launch case statuses

Aligned with the app and database (`case_status`):

| Status | Meaning (high level) |
|--------|----------------------|
| `draft` | Case in progress before full submission / payment flow completion |
| `submitted` | Submitted for review |
| `under_review` | Staff working the case |
| `awaiting_info` | Waiting on customer input |
| `complete` | Delivered / closed from customer perspective |

## Already decided (out of scope to re-litigate casually)

- **Stack:** Next.js App Router, TypeScript, Tailwind v4, Supabase (Auth + Postgres + Storage), Stripe Checkout, Resend, no ORM, no global client state library for MVP.
- **Auth:** Google + magic link only; no passwords.
- **Funnel shape and copy:** Locked unless there is a **serious implementation conflict**—do not reinvent flow, pricing story, or core copy without explicit approval.
- **Intake:** Pre-sign-in draft may live in local storage; it does **not** include turnaround selection.

## Rule for contributors

**Do not reinvent flow, copy, or stack** without a **serious implementation conflict** and explicit product/owner alignment. Prefer extending the existing patterns in `README.md` and this repo.
