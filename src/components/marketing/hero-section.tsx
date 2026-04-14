import Link from "next/link";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Edit all hero copy here. Do not scatter strings into JSX.
// ---------------------------------------------------------------------------
const HERO = {
  headline: "Need help with a denied claim, medical bill, or insurance problem?",
  body: "We review your situation and build a step-by-step plan — who to contact, what to say, and how to escalate when needed.",
  reassurance: "You'll be assigned one case manager from intake to delivery.",
  cta: {
    primaryLoggedIn: "Start a new case",
    primaryLoggedOut: "Start your review",
    secondary: "View current cases",
  },
} as const;

// ---------------------------------------------------------------------------
// Portrait image
// Asset: /public/images/hero-portrait.png  (1024×682, transparent background PNG)
// Rendered at natural proportions — no crop, no overflow clipping.
// Transparent areas around her figure show the hero background through.
//
// To swap: replace /public/images/hero-portrait.png.
// ---------------------------------------------------------------------------
const PORTRAIT = {
  src: "/images/hero-portrait.png",
  alt: "A person reviewing insurance documents with PolicyPal",
  width: 1024,
  height: 682,
} as const;

export function HeroSection({ user }: { user: User | null }) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background layer ── */}
      {/* Subtle geometric asset — positioned to show more on the right */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-right-top"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        aria-hidden="true"
      />
      {/* Soft white wash — reduced opacity for more visual depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-background/60"
        aria-hidden="true"
      />
      {/* Subtle accent-light wash behind the right column — adds depth behind portrait */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-gradient-to-l from-accent-light/50 to-transparent lg:block"
        aria-hidden="true"
      />

      {/*
       * Grid: single column on mobile/tablet, 60/40 split on desktop (lg:grid-cols-[3fr_2fr]).
       * lg:items-end bottom-aligns both columns so the portrait stands on the hero floor.
       */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 px-4 sm:px-6 lg:grid-cols-[3fr_2fr] lg:items-end">

        {/* ── Left column — copy + CTAs ── */}
        <div className="flex flex-col pb-12 pt-16 sm:pb-14 sm:pt-20 lg:pb-16 lg:pt-24 lg:pr-14">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.18]">
            {HERO.headline}
          </h1>

          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted sm:text-lg">
            {HERO.body}
          </p>

          {/* CTAs — routes and logic preserved exactly */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {user ? (
              <>
                <Link
                  href="/case/new"
                  className="inline-flex items-center justify-center rounded-lg bg-cta px-6 py-3 text-base font-medium text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                >
                  {HERO.cta.primaryLoggedIn}
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
                >
                  {HERO.cta.secondary}
                </Link>
              </>
            ) : (
              <Link
                href="/start"
                className="inline-flex w-fit items-center justify-center rounded-lg bg-cta px-7 py-3 text-base font-medium text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
              >
                {HERO.cta.primaryLoggedOut}
              </Link>
            )}
          </div>

          {/* Reassurance line */}
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-accent"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 4 6.5 11 3 7.5" />
            </svg>
            {HERO.reassurance}
          </p>
        </div>

        {/* ── Right column — portrait ── */}
        {/*
         * Visible on ALL screen sizes including mobile.
         * Height-driven sizing keeps the full figure uncropped at every breakpoint.
         *
         * Breakpoints:
         *   mobile (< 640px) — h-[200px]: compact, centred below copy
         *   sm  (640 px+)    — h-[260px]: balanced on small tablets
         *   md  (768 px+)    — h-[300px]: comfortable on large tablets
         *   lg  (1024 px+)   — h-[420px]: dominant hero figure on desktop
         *   xl  (1280 px+)   — h-[460px]: larger on wide screens
         *   2xl (1536 px+)   — h-[500px]: comfortable at very wide viewports
         *
         * min-w-0 keeps the grid cell at its [2fr] track width so the layout
         * stays stable even though the image is wider than the column (the
         * transparent-left overhang is invisible against the hero background).
         */}
        <div className="flex min-w-0 items-end justify-center pt-4 lg:justify-end lg:pt-0">
          <Image
            src={PORTRAIT.src}
            alt={PORTRAIT.alt}
            width={PORTRAIT.width}
            height={PORTRAIT.height}
            priority
            sizes="(max-width: 640px) 300px, (max-width: 768px) 390px, (max-width: 1024px) 450px, (max-width: 1280px) 632px, 690px"
            className="h-[200px] w-auto max-w-none select-none sm:h-[260px] md:h-[300px] lg:h-[420px] xl:h-[460px] 2xl:h-[500px]"
          />
        </div>

      </div>
    </section>
  );
}
