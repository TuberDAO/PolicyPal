"use client";

import { useState } from "react";

interface Example {
  id: string;
  title: string;
  preview: string;
  problem: string;
  plan: string;
  steps: string[];
}

const EXAMPLES: Example[] = [
  {
    id: "denied-claim",
    title: "Denied claim after an MRI",
    preview:
      "A claim was denied because the insurer said prior authorization wasn\u2019t obtained \u2014 even though the doctor\u2019s office submitted it.",
    problem:
      "A patient received an MRI referral from their primary care doctor for chronic knee pain. The insurer denied the claim, saying prior authorization wasn\u2019t obtained. The doctor\u2019s office says they submitted the request, but the insurer has no record of it. The patient received a bill for $2,100.",
    plan: "File an internal appeal within the insurer\u2019s appeal window. The key is proving the prior auth request was submitted and attaching a medical necessity letter from the treating physician.",
    steps: [
      "Call the insurer\u2019s member services and request the specific denial reason code and appeal instructions in writing",
      "Request the denial letter (called an Adverse Benefit Determination) if not already received",
      "Contact the doctor\u2019s office and ask for proof that the prior authorization was submitted \u2014 fax confirmation, timestamp, or reference number",
      "Ask the treating physician to write a brief letter explaining why the MRI was medically necessary",
      "Compile everything into an appeal package and submit by certified mail before the appeal deadline",
      "Follow up with the insurer 14 days after submission if no acknowledgment is received",
    ],
  },
  {
    id: "medical-bill",
    title: "Unexpected ER balance bill",
    preview:
      "An emergency room visit at an in-network hospital resulted in a $3,200 bill from an out-of-network physician group.",
    problem:
      "A patient went to an in-network hospital emergency room for chest pain. Weeks later, they received a $3,200 bill from the ER physician group, which turned out to be out-of-network. Insurance paid their portion, but the physician group is billing the patient for the remaining balance.",
    plan: "This situation is likely protected by the No Surprises Act. Emergency services at in-network facilities cannot be balance billed at out-of-network rates. The patient should not owe more than their in-network cost-sharing amount.",
    steps: [
      "Request an itemized bill from the physician group and the Explanation of Benefits from the insurer",
      "Confirm that the hospital facility was in-network on the date of service",
      "Contact the physician group\u2019s billing department and reference the No Surprises Act \u2014 they are prohibited from balance billing for emergency services",
      "If the bill isn\u2019t adjusted within 30 days, file a complaint with the insurer",
      "Use the federal Independent Dispute Resolution (IDR) process if the provider disputes the amount",
      "Contact your state insurance department for additional support if needed",
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
                  The problem
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
                See sample steps &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Sample action steps
              </h2>

              <ol className="space-y-4">
                {example.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
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
