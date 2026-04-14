// ---------------------------------------------------------------------------
// Scrolling source strip — sits flush beneath the hero section.
//
// Technique: two identical pill tracks in a flex row.  CSS translates the pair
// from 0 → -50%, landing back at the start of track 1 for a seamless loop.
// The wrapper has a gradient mask on both edges so pills fade in/out cleanly.
//
// Accessibility:
//   • Track 2 is aria-hidden — screen readers see each source exactly once.
//   • @media (prefers-reduced-motion) disables animation; pills wrap statically.
// ---------------------------------------------------------------------------

const SOURCES = [
  "HealthCare.gov",
  "Medicare.gov",
  "Medicaid.gov",
  "CMS",
  "U.S. Department of Labor",
  "IRS",
  "State insurance departments",
  "UnitedHealthcare policies",
  "Blue Cross Blue Shield policies",
  "Aetna policies",
  "Cigna Healthcare policies",
  "Humana policies",
  "Your health plan policy",
  "EOBs",
  "Denial letters",
  "Summary of Benefits & Coverage",
] as const;

const LABEL = "Sources we review";

export function TrustedSourcesSection() {
  return (
    <section
      className="border-y border-border bg-surface"
      aria-label={LABEL}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">

        {/* Desktop: label left, strip right */}
        <div className="flex items-center gap-5">

          {/* Static label — only visible sm+ */}
          <p
            className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted sm:block"
            aria-label={LABEL}
          >
            {LABEL}
          </p>
          <div
            className="hidden h-4 w-px shrink-0 bg-border sm:block"
            aria-hidden="true"
          />

          {/*
           * Scrolling track container.
           * mask-image fades pills at left and right edges for a premium finish.
           * overflow-hidden prevents the translating track from spilling out.
           */}
          <div
            className="
              min-w-0 flex-1 overflow-hidden
              [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]
            "
          >
            {/*
             * Normal motion: single-row flex, animate-marquee translates -50%.
             * Reduced motion: flex-wrap + no animation so all pills are readable.
             */}
            <div
              className="
                flex w-max gap-2.5
                animate-marquee
                motion-reduce:animate-none motion-reduce:w-auto motion-reduce:flex-wrap
              "
            >
              {/* Track 1 — read by screen readers */}
              {SOURCES.map((source) => (
                <Pill key={source}>{source}</Pill>
              ))}
              {/* Track 2 — visual loop only, hidden from AT */}
              {SOURCES.map((source) => (
                <Pill key={`${source}--2`} hidden>{source}</Pill>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile label below the strip */}
        <p
          className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted sm:hidden"
          aria-hidden="true"
        >
          {LABEL}
        </p>

      </div>
    </section>
  );
}

function Pill({
  children,
  hidden,
}: {
  children: React.ReactNode;
  hidden?: boolean;
}) {
  return (
    <span
      aria-hidden={hidden ? true : undefined}
      className="
        inline-flex shrink-0 items-center gap-1.5
        rounded-full border border-border bg-background
        px-3.5 py-1
        text-xs text-muted
        whitespace-nowrap
        select-none
      "
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/35"
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
