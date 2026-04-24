"use client";

import { useState } from "react";

const ITEMS = [
  {
    title: "Denied treatment can still get approved",
    body: "Many people come to us after being told no the first time. That is often not the final answer. Appeals can help get treatment approved, especially when the right evidence, language, and escalation path are used.",
    examples: true,
  },
  {
    title: "Bills can be corrected, reduced, or challenged",
    body: "Many medical bills contain errors, duplicate charges, wrong coding, or costs that should not have landed with you in the first place. This can help you spot the problem and push back properly.",
  },
  {
    title: "Prior authorizations can stop stalling your care",
    body: "If your treatment is stuck in delays, repeated requests, or endless resubmissions, this can help you see what is missing, what needs to be sent, and how to move things forward faster.",
  },
  {
    title: "Pressure over costs can become more manageable",
    body: "If bills, deadlines, or collection pressure are building, this can help you create a more manageable path while the underlying issue is being fixed.",
  },
  {
    title: "You get a clearer path and less guesswork",
    body: "Instead of calling the wrong people, repeating yourself, and getting nowhere, you get clearer next steps, stronger wording, and a better idea of when to escalate.",
  },
];

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-success"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function WhatYouGetSection() {
  const [examplesOpen, setExamplesOpen] = useState(false);

  return (
    <section className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Common issues we help resolve
        </h2>
        <p className="mt-3 text-center text-sm text-muted">
          Most people come here after something has already gone wrong. A
          denial. A bill that does not look right. A treatment delay. A case
          going nowhere. This helps you understand what to do next and how to
          improve the outcome.
        </p>

        <ul className="mt-8 space-y-5">
          {ITEMS.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <CheckIcon />
              <div>
                <p className="font-medium leading-snug">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.body}</p>

                {item.examples && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setExamplesOpen((v) => !v)}
                      className="text-xs text-muted underline-offset-2 hover:underline focus:outline-none"
                      aria-expanded={examplesOpen}
                    >
                      {examplesOpen ? "Hide examples" : "See common examples"}
                    </button>

                    {examplesOpen && (
                      <div className="mt-3 rounded-md border border-border bg-white/60 px-4 py-3 text-xs text-muted">
                        <p className="mb-2 italic">
                          Common examples only, not a complete list.
                        </p>
                        <ul className="space-y-1">
                          <li>
                            <span className="font-medium text-foreground">
                              Migraine:
                            </span>{" "}
                            Emgality, Nurtec, Ubrelvy, Aimovig
                          </li>
                          <li>
                            <span className="font-medium text-foreground">
                              Autoimmune and rheumatology:
                            </span>{" "}
                            Humira, Skyrizi, Cosentyx, Actemra, Enbrel, Remicade
                          </li>
                          <li>
                            <span className="font-medium text-foreground">
                              Asthma and eczema:
                            </span>{" "}
                            Dupixent, Xolair, Fasenra, Nucala
                          </li>
                          <li>
                            <span className="font-medium text-foreground">
                              Gastro and inflammatory bowel disease:
                            </span>{" "}
                            Stelara, Entyvio, Remicade
                          </li>
                          <li>
                            <span className="font-medium text-foreground">
                              Dermatology:
                            </span>{" "}
                            Skyrizi, Taltz, Dupixent
                          </li>
                          <li>
                            <span className="font-medium text-foreground">
                              Pediatric, rare, and specialist cases:
                            </span>{" "}
                            PANS or PANDAS treatment, specialist referrals, and
                            other complex coverage requests
                          </li>
                        </ul>
                        <p className="mt-3 border-t border-border pt-2">
                          If your insurer said no, that is often just the first
                          decision, not the final one.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
