import Link from "next/link";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Edit all hero copy here. Do not scatter strings into JSX.
// ---------------------------------------------------------------------------
const HERO = {
  headline: "Need help with a health insurance problem?",
  body: "Denials, medical bills, prior authorizations, delays, and other insurance issues. We examine your case and give you a clear, step-by-step plan.",
  reassurance: "One case manager handles your case from start to finish.",
  cta: {
    primaryLoggedIn: "Start your case",
    primaryLoggedOut: "Start your case",
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
  alt: "A person reviewing insurance documents with WinYourAppeal",
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
        <div className="flex flex-col pb-4 pt-16 sm:pb-14 sm:pt-20 lg:pb-16 lg:pt-24 lg:pr-14">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.18]">
            {HERO.headline}
          </h1>

          <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {HERO.body}
          </p>

          {/* CTAs — routes and logic preserved exactly */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {user ? (
              <>
                <Link
                  href="/case/new"
                  className="inline-flex items-center justify-center rounded-full bg-cta px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-cta-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
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
                className="inline-flex w-fit items-center justify-center rounded-full bg-cta px-7 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-cta-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
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

          {/* Trust indicators */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
              </svg>
              Secure document upload
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Z" clipRule="evenodd" />
              </svg>
              Private case review
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.93 4.93C3.12 6.74 2 9.24 2 12a8 8 0 1 0 8-8c-2.76 0-5.26 1.12-7.07 2.93ZM10 6a1 1 0 0 1 1 1v3.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 9 11V7a1 1 0 0 1 1-1Z" clipRule="evenodd" />
              </svg>
              Clear pricing
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.5 3A1.5 1.5 0 0 0 5 4.5v1.905A5.968 5.968 0 0 0 4 10c0 1.477.534 2.827 1.41 3.866l-.707.707a.75.75 0 1 0 1.06 1.06l.707-.706A5.97 5.97 0 0 0 10 16a5.97 5.97 0 0 0 3.53-1.073l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.708A5.968 5.968 0 0 0 16 10a5.968 5.968 0 0 0-1-3.266V4.5A1.5 1.5 0 0 0 13.5 3h-7Z" />
              </svg>
              No subscription
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
              </svg>
              Reviewed by an experienced case specialist
            </span>
          </div>
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
        <div className="flex min-w-0 items-end justify-center pt-0 lg:justify-end lg:pt-0">
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
