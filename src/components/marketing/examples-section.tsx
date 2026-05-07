"use client";

import { useState } from "react";

const ROWS = [
  {
    id: "story",
    label: "Your story",
    description:
      "We show how the condition has affected your daily life, function, and ability to work.",
    docParagraphs: [
      "Rheumatoid arthritis has caused persistent functional impairment, with inflammatory pain, prolonged morning stiffness, fatigue, and reduced dexterity affecting daily activities.",
      "Despite prior treatment, I continue to experience clinically significant disease burden, including impaired grip strength, reduced mobility, and difficulty sustaining routine work and household tasks.",
      "Without timely treatment escalation, there is a material risk of further functional decline and irreversible joint damage.",
    ],
  },
  {
    id: "evidence",
    label: "Clinical evidence",
    description:
      "We use specialist guidance and published evidence to support the requested care.",
    docParagraphs: [
      "Current rheumatology guidance supports treatment escalation where rheumatoid arthritis remains active despite conventional disease modifying therapy.",
      "The clinical record reflects persistent disease activity and inadequate response to prior DMARD treatment, supporting advanced therapy on medical necessity grounds.",
      "Published evidence shows that timely initiation of targeted treatment may reduce inflammatory activity, slow structural progression, and improve long term functional outcomes.",
    ],
  },
  {
    id: "rules",
    label: "Coverage rules and review standards",
    description:
      "We assess whether the denial fits the plan terms and the governing review rules.",
    docParagraphs: [
      "The adverse benefit determination does not appear to reflect a faithful application of the governing medical necessity criteria, step therapy provisions, or utilization review standards set out in the plan documents and applicable law.",
      "Based on the documented treatment history, persistent symptomatology, and specialist recommendation, the clinical prerequisites for treatment escalation appear to have been satisfied.",
      "This matter warrants de novo reconsideration and a full and fair review consistent with the governing plan terms, applicable state review requirements, and any controlling federal obligations, including protections that may apply under surprise billing and fair review rules.",
    ],
  },
] as const;

export function ExamplesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = ROWS[activeIndex];

  return (
    <section id="examples" className="px-4 py-16 sm:px-6 sm:py-20" aria-label="What we build into your action plan">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">

          {/* ── Left column ── */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              What we build into your action plan
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              WinYourAppeal builds a stronger action plan using your documents, the reason given by the insurer or billing office, relevant coverage criteria, and the practical steps that may help move your issue forward.
            </p>

            <div className="mt-8 flex flex-col" role="tablist" aria-label="Case components">
              {ROWS.map((row, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={row.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="case-preview"
                    onClick={() => setActiveIndex(i)}
                    className={`group w-full border-l-2 py-4 pl-5 pr-3 text-left transition-colors ${
                      isActive
                        ? "border-l-accent"
                        : "border-l-transparent hover:border-l-border"
                    }`}
                  >
                    <span
                      className={`block text-lg font-semibold tracking-tight transition-colors ${
                        isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      {row.label}
                    </span>
                    {isActive && (
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {row.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right column — document preview ── */}
          <div
            id="case-preview"
            role="tabpanel"
            aria-label={active.label}
            className="relative flex items-start justify-center pt-2 lg:pt-4"
          >
            {/* Soft background glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-light/60 via-accent-light/30 to-transparent"
              aria-hidden="true"
            />

            {/* Stacked paper layers */}
            <div className="relative w-full max-w-md">
              <div
                className="absolute -right-3 -top-3 h-full w-full rounded-lg border border-border/50 bg-surface shadow-sm"
                style={{ transform: "rotate(2.5deg)" }}
                aria-hidden="true"
              />
              <div
                className="absolute -right-1.5 -top-1.5 h-full w-full rounded-lg border border-border/50 bg-surface shadow-sm"
                style={{ transform: "rotate(1deg)" }}
                aria-hidden="true"
              />

              {/* Front document */}
              <div className="relative rounded-lg border border-border bg-surface px-5 py-4 shadow-md sm:px-6 sm:py-5">
                {/* Compact document header */}
                <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                  <div className="h-2.5 w-16 rounded bg-border/60" />
                  <div className="h-2 w-24 rounded bg-border/40" />
                </div>

                {/* Placeholder lines */}
                <div className="mb-3 space-y-1.5" aria-hidden="true">
                  <div className="h-1.5 w-full rounded bg-border/25" />
                  <div className="h-1.5 w-11/12 rounded bg-border/25" />
                </div>

                {/* Highlighted paragraph 1 */}
                <div className="mb-2.5 rounded bg-yellow-100/80 px-2.5 py-1.5">
                  <p className="text-[11px] leading-relaxed text-foreground sm:text-xs">
                    {active.docParagraphs[0]}
                  </p>
                </div>

                {/* Body paragraph 2 */}
                <p className="mb-2.5 px-0.5 text-[11px] leading-relaxed text-muted sm:text-xs">
                  {active.docParagraphs[1]}
                </p>

                {/* Highlighted paragraph 3 */}
                <div className="mb-3 rounded bg-yellow-100/80 px-2.5 py-1.5">
                  <p className="text-[11px] leading-relaxed text-foreground sm:text-xs">
                    {active.docParagraphs[2]}
                  </p>
                </div>

                {/* Placeholder lines at bottom */}
                <div className="space-y-1.5" aria-hidden="true">
                  <div className="h-1.5 w-3/4 rounded bg-border/25" />
                  <div className="h-1.5 w-1/2 rounded bg-border/25" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
