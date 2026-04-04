# PolicyPal

**Bills, claims & coverage help.**

PolicyPal is a mobile-first paid service for U.S. consumers dealing with health-insurance problems. Customers describe their issue, upload supporting documents, pay for a review, and receive a human-written step-by-step playbook.

This is v1 — a manual concierge-style service, not a self-serve AI product.

## Project documentation

- **[Product & flow source of truth](docs/source-of-truth.md)** — what PolicyPal is, approved funnel, pricing, turnaround, auth, statuses, and locked decisions.
- **[Style guide](docs/style-guide.md)** — fonts, color tokens, mobile-first UI rules, and what to avoid.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth (Google OAuth + magic link) |
| Database | Supabase Postgres |
| Storage | Supabase Storage |
| Payments | Stripe Checkout |
| Email | Resend |
| Analytics | Vercel Web Analytics |
| Errors | Sentry |

## Current Phase

**Auth foundations complete.** Sign-in (Google OAuth + magic link), session management, and route protection are wired on top of the database schema.

Implemented:
- Supabase SQL migration with enums, tables, indexes, triggers, and RLS policies
- Supabase client wrappers (browser, server, admin, middleware helper)
- Helper functions for staff/admin role checks and auto-profile creation
- Supabase CLI config for local development (`supabase/config.toml`)
- Login page with Google OAuth and email magic link
- Auth callback route (PKCE code exchange)
- Session refresh in proxy (token auto-renewal on each request)
- Route protection: customer routes require auth, admin routes require staff role
- Dashboard and admin layout gating with server-side session checks

Not yet implemented:
- Intake form and localStorage draft
- File upload
- Stripe Checkout and webhook
- Admin dashboard and playbook editor
- Transactional emails (Resend)
- Sentry integration (SDK initialized, DSN placeholder)
- Funnel-event tracking
- Production UI and copy

## Folder Structure

```
src/
  app/              Route pages and layouts (Next.js App Router)
    (marketing)/    Public pages: landing, privacy, terms
    (auth)/         Sign-in, auth callback
    (intake)/       Intake form
    (dashboard)/    Customer: dashboard, case detail, upload, checkout, account
    admin/          Admin: case queue, case review, playbook editor
    api/            Webhook endpoints
  lib/              Third-party client wrappers (Supabase, Stripe, Resend)
  actions/          Server actions (case, upload, checkout, playbook, email)
  components/       React components grouped by domain
    ui/             Design-system primitives (button, input, card, etc.)
    intake/         Intake form components
    case/           Case-related components
    layout/         Header, footer, nav
  hooks/            Custom React hooks
  types/            TypeScript type definitions
  utils/            Pure utility functions (validation, formatting)
  constants.ts      Brand, pricing, feature flags, label maps
  env.ts            Typed environment variable validation
  proxy.ts          CSP nonce, auth session refresh, route protection
supabase/
  migrations/       SQL migration files
  seed.sql          Local dev seed data
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in real values. See `src/env.ts` for the full list and validation rules.

- `NEXT_PUBLIC_*` variables are available in client and server code.
- All other variables are server-only and validated to never leak to the browser.
- `getServerEnv()` throws if called on the client.
- `getClientEnv()` validates public variables.

## Design Tokens

All colors, fonts, and visual constants are defined in `src/app/globals.css` using Tailwind v4's `@theme` directive. Components reference tokens via Tailwind utility classes (`bg-surface`, `text-muted`, `border-border`, etc.). Do not hardcode hex values in components.

Fonts: **Inter** (body/UI) and **Sora** (headings), loaded via `next/font/google` in the root layout.

## Business Constants

Pricing, turnaround labels, upload limits, issue-type labels, and feature flags are centralized in `src/constants.ts`. Do not scatter these values into individual components.

## Security

- **CSP**: Nonce-based Content-Security-Policy set in proxy (Next.js 16 convention, formerly middleware). No `unsafe-eval`. `strict-dynamic` for scripts.
- **Headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy set in `next.config.ts`.
- **Auth**: Google OAuth + email magic link only. No password auth.
- **Secrets**: Server-only env vars validated in `env.ts`. Never exposed to client bundles.
- **File access**: Private Supabase Storage bucket. Signed URLs only.

## For Future Developers

- **Product flow and copy are locked.** Do not reinvent the intake flow, pricing model, or email set without explicit approval.
- **No password auth.** This is intentional, not an oversight.
- **No UI component library.** Tailwind utilities are sufficient for this MVP.
- **No ORM.** Supabase client is the query layer; raw SQL for migrations.
- **No state management library.** Server components + localStorage + URL state cover all needs.
- Extend the app by implementing the placeholder files. Each one has a comment describing its purpose.
- When adding a feature, put business logic in `actions/`, UI in `components/`, and keep page files thin.

## Supabase Local Development

The project includes a `supabase/config.toml` for the Supabase CLI. To run a local Supabase stack:

```bash
# Start local Supabase (Postgres, Auth, Storage, Studio)
npx supabase start

# View local credentials (anon key, service role key, Studio URL)
npx supabase status
```

Copy the local credentials into `.env.local`. The local Studio UI is at `http://localhost:54323`.

### Google OAuth (local)

To test Google sign-in locally, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as environment variables before starting Supabase. These are referenced in `supabase/config.toml` via `env(...)`. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) with `http://localhost:54321/auth/v1/callback` as the authorized redirect URI.

### Migrations

Migrations live in `supabase/migrations/` and are plain SQL files prefixed with a timestamp.

```bash
# Apply migrations to a running local Supabase instance
npx supabase db push

# Reset local database (drops and recreates from migrations + seed)
npx supabase db reset
```

### Type Generation

After applying migrations, regenerate the TypeScript database types:

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

`src/types/database.ts` is auto-generated — do not hand-edit it. The placeholder in the repo compiles but provides no table-level type safety until real types are generated.

## Development

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Production build
npm run lint    # ESLint
```
