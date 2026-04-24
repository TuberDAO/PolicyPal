// ---------------------------------------------------------------------------
// Edit all section copy here.
// ---------------------------------------------------------------------------
const COPY = {
  heading: "Why Appeals Matter",
  subheading:
    "The right appeal can overturn a denial, reduce your bill & help avoid delays in care.",
  leftCard1: {
    headline: "1 in 5 claims denied",
    body: "Millions of people face claim denials and billing errors each year and are left unsure what to do next. We will work with you for a positive outcome.",
  },
  leftCard2: {
    headline: "Most people never appeal",
    body: "Many patients do not challenge denials or billing errors, even when they should. We guide you step by step through the process.",
  },
  rightCard: {
    headline: "8 out of 10 Appeals Succeed",
    body: "Many cases can be resolved surprisingly quickly.",
  },
} as const;

// ---------------------------------------------------------------------------
// Assets
// Background: /public/images/outcomes-bg.png
// People:     /public/images/outcomes-people.png  (transparent PNG, object-contain)
// ---------------------------------------------------------------------------

export function OutcomesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20" aria-label="Why appeals matter">
      <div className="mx-auto max-w-6xl">

        {/* ── Centered heading ── */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {COPY.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {COPY.subheading}
          </p>
        </div>

        {/*
         * ── Cards grid ──
         * Mobile:  single column, all cards stacked
         * Desktop: left column (2fr) holds 2 stacked cards, right column (3fr) holds 1 tall card
         * align-items: stretch (default) so both columns share the same row height
         */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:mt-14 lg:grid-cols-[2fr_3fr] lg:gap-8">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">

            {/* Left card 1 — white surface */}
            <div className="flex-1 rounded-2xl border border-border bg-surface p-7 shadow-sm">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {COPY.leftCard1.headline}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {COPY.leftCard1.body}
              </p>
            </div>

            {/* Left card 2 — accent-light tint */}
            <div className="flex-1 rounded-2xl border border-border bg-accent-light p-7 shadow-sm">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {COPY.leftCard2.headline}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {COPY.leftCard2.body}
              </p>
            </div>

          </div>

          {/*
           * ── Right column — large card ──
           *
           * overflow-hidden clips the bg image to the rounded corners.
           * The card is a flex column so text sits at the top and the
           * people image is pushed to the bottom via mt-auto.
           *
           * People image sizing by breakpoint:
           *   mobile  (< 640px):  h-[200px]
           *   sm      (640 px+):  h-[240px]
           *   lg      (1024 px+): h-[280px]
           *
           * object-contain ensures no cropping — faces, arms, and bodies
           * remain fully visible at every breakpoint.
           */}
          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl shadow-sm lg:min-h-0">

            {/* Card background image */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/outcomes-bg.png')" }}
              aria-hidden="true"
            />

            {/* Card content — sits above background */}
            <div className="relative z-10 flex flex-1 flex-col p-8 sm:p-10">

              {/* Text at top of card */}
              <div className="max-w-xs">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {COPY.rightCard.headline}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {COPY.rightCard.body}
                </p>
              </div>

              {/* People image — pushed to bottom-right via mt-auto + justify-end */}
              <div className="mt-auto flex justify-end">
                <img
                  src="/images/outcomes-people.png"
                  alt="Four people smiling, supported by WinYourAppeal"
                  className="h-[200px] w-auto select-none sm:h-[240px] lg:h-[280px]"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
