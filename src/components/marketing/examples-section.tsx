"use client";

import { useState } from "react";

interface ActionChunk {
  heading: string;
  items: string[];
}

interface Example {
  id: string;
  title: string;
  preview: string;
  problem: string;
  plan: string;
  actions: ActionChunk[];
}

const EXAMPLES: Example[] = [
  {
    id: "denied-claim",
    title: "Denied claim after an MRI",
    preview:
      "A claim was denied because the insurer said prior authorization wasn\u2019t obtained \u2014 even though the doctor\u2019s office submitted it.",
    problem:
      "A patient received an MRI referral from their primary care doctor for chronic knee pain. The insurer denied the claim, saying prior authorization wasn\u2019t obtained. The doctor\u2019s office says they submitted the request, but the insurer has no record of it. The patient received a bill for $2,100.",
    plan: "File an internal appeal within the insurer\u2019s appeal window. The key is proving the prior auth request was submitted and attaching a medical necessity letter from the treating physician. If the internal appeal is denied, escalate to the state insurance department and request an external review.",
    actions: [
      {
        heading: "Gather evidence",
        items: [
          "Call Member Services and request the denial reason code and appeal deadline in writing",
          "Contact your doctor\u2019s office \u2014 ask for the fax confirmation, timestamp, or reference number proving the prior auth was submitted",
          "Ask the treating physician for a medical necessity letter supporting the MRI",
        ],
      },
      {
        heading: "File internal appeal",
        items: [
          "Submit the appeal package to the address on your denial letter by certified mail",
          "Include: denial letter, proof of prior auth submission, medical necessity letter, and a brief cover letter",
          "Record the name and title of anyone you speak with \u2014 e.g. Senior Appeals Specialist or Appeals Coordinator",
        ],
      },
      {
        heading: "Escalate if denied again",
        items: [
          "Request the contact information for the Medical Director, Utilization Management who reviewed your case",
          "File a complaint with your state insurance department \u2014 look for the State Insurance Case Intake line",
          "Request an Independent External Review through your insurer or state regulator",
        ],
      },
    ],
  },
  {
    id: "medical-bill",
    title: "Unexpected ER balance bill",
    preview:
      "An emergency room visit at an in-network hospital resulted in a $3,200 bill from an out-of-network physician group.",
    problem:
      "A patient went to an in-network hospital emergency room for chest pain. Weeks later, they received a $3,200 bill from the ER physician group, which turned out to be out-of-network. Insurance paid their portion, but the physician group is billing the patient for the remaining balance.",
    plan: "This situation is likely protected by the No Surprises Act. Emergency services at in-network facilities cannot be balance billed at out-of-network rates. The patient should not owe more than their in-network cost-sharing amount. If the provider doesn\u2019t correct the bill, escalate to the insurer and the federal No Surprises Help Desk.",
    actions: [
      {
        heading: "Gather documentation",
        items: [
          "Request an itemized bill from the physician group\u2019s billing department",
          "Request the Explanation of Benefits (EOB) from your insurer for the same date of service",
          "Confirm the hospital facility was in-network on the date of service",
        ],
      },
      {
        heading: "Dispute the balance bill",
        items: [
          "Call the physician group\u2019s billing department and reference the No Surprises Act \u2014 they are prohibited from balance billing for emergency services",
          "Ask to speak with a Billing Supervisor or Revenue Cycle Manager if the first representative cannot resolve it",
          "Record the name, title, and direct line of anyone you speak with",
        ],
      },
      {
        heading: "Escalate if unresolved",
        items: [
          "File a complaint with your insurer\u2019s Executive Escalations Team or Member Grievances department",
          "Contact the federal No Surprises Help Desk (1-800-985-3059) to report the balance bill",
          "If your employer provides the plan, notify your Benefits Manager \u2014 they may be able to intervene with the insurer directly",
        ],
      },
    ],
  },
];

export function ExamplesSection() {
  const [activeExample, setActiveExample] = useState<Example | null>(null);

  return (
    <>
      <section id="examples" className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            See how it works
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            Composite examples based on common situations
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setActiveExample(ex)}
                className="rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-heading font-semibold">{ex.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {ex.preview}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-accent">
                  View example &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeExample && (
        <ExampleOverlay
          example={activeExample}
          onClose={() => setActiveExample(null)}
        />
      )}
    </>
  );
}

function ExampleOverlay({
  example,
  onClose,
}: {
  example: Example;
  onClose: () => void;
}) {
  const [screen, setScreen] = useState<0 | 1>(0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background animate-fade-in">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {screen === 1 ? (
            <button
              type="button"
              onClick={() => setScreen(0)}
              className="flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-border hover:text-foreground"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 animate-slide-up">
          {screen === 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                {example.title}
              </h2>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  The situation
                </h3>
                <p className="mt-2 leading-relaxed text-foreground">
                  {example.problem}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  The plan
                </h3>
                <p className="mt-2 leading-relaxed text-foreground">
                  {example.plan}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setScreen(1)}
                className="mt-2 inline-block text-sm font-medium text-accent transition-colors hover:text-cta"
              >
                See sample action steps &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold tracking-tight">
                Sample action steps
              </h2>

              {example.actions.map((chunk) => (
                <div key={chunk.heading}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
                    {chunk.heading}
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {chunk.items.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border text-[10px] text-muted">
                          &#x2713;
                        </span>
                        <p className="text-sm leading-relaxed text-foreground">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <p className="rounded-lg bg-accent-light px-4 py-3 text-xs leading-relaxed text-muted">
                We don&rsquo;t just tell you to call customer service. We help
                direct the case toward the people who can actually influence
                the outcome.
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted">
            Ready to get help with your situation?
          </p>
          <a
            href="/start"
            className="mt-3 inline-block rounded-lg bg-cta px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
          >
            Start your review
          </a>
        </div>
      </div>
    </div>
  );
}
