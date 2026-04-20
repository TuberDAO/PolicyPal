// ---------------------------------------------------------------------------
// Testimonials
//
// Based on real customer feedback. Names and identifying details have been
// changed for privacy. Quotes have been lightly rewritten for readability and
// consistency and are not presented as verbatim transcripts.
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    quote:
      "My appeal was denied at first, and I felt completely stuck. The plan gave me a clear way forward. After I followed the steps, the denial was overturned within days. It took a huge weight off my shoulders.",
    name: "Sarah",
    location: "Texas",
  },
  {
    quote:
      "The plan was detailed, practical, and easy to follow. It helped me take the right steps, and I was able to get the medication I needed without the cost I was originally facing.",
    name: "Michael",
    location: "Ohio",
  },
  {
    quote:
      "I followed the phone and email wording from the plan closely. It helped me confirm where the bill had gone, request the right verification, and push for written confirmation. The final payment became far more manageable, and the whole process felt much more under control.",
    name: "Danielle",
    location: "Florida",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20"
      aria-label="Real customer feedback"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Real customer feedback
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Based on real customer feedback. Names and identifying details have been changed for privacy.
          </p>
        </div>

        {/*
         * Three-card responsive grid.
         * items-stretch keeps card heights balanced across the row on desktop.
         * gap scales up slightly on md+ for a calmer, more editorial rhythm.
         */}
        <ul className="mt-12 grid grid-cols-1 items-stretch gap-6 md:mt-14 md:grid-cols-3 md:gap-7">
          {TESTIMONIALS.map((item, index) => (
            <li key={index} className="flex">
              <figure className="relative flex h-full w-full flex-col rounded-2xl border border-border bg-surface p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_20px_-8px_rgba(15,23,42,0.08)] sm:p-8">
                {/* Thin accent rule at top gives a quiet editorial anchor */}
                <span
                  aria-hidden="true"
                  className="absolute left-7 right-7 top-0 h-px bg-accent/60 sm:left-8 sm:right-8"
                />

                <QuoteMark />

                <blockquote className="mt-5 flex-1 text-[15px] leading-[1.7] text-foreground text-pretty sm:text-base sm:leading-[1.75]">
                  {item.quote}
                </blockquote>

                <figcaption className="mt-7 border-t border-border/70 pt-5">
                  <span className="block text-sm font-semibold tracking-tight text-foreground">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-xs uppercase tracking-[0.08em] text-muted">
                    {item.location}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function QuoteMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 shrink-0 text-accent/80"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M6.5 4C4.57 4 3 5.57 3 7.5v1C3 10.43 4.57 12 6.5 12H7v1c0 1.1-.9 2-2 2H4.5a.75.75 0 0 0 0 1.5H5a3.5 3.5 0 0 0 3.5-3.5V7.5C8.5 5.57 6.93 4 5 4h1.5Zm8 0C12.57 4 11 5.57 11 7.5v1c0 1.93 1.57 3.5 3.5 3.5h.5v1c0 1.1-.9 2-2 2h-.5a.75.75 0 0 0 0 1.5h.5a3.5 3.5 0 0 0 3.5-3.5V7.5C16.5 5.57 14.93 4 13 4h1.5Z" />
    </svg>
  );
}
