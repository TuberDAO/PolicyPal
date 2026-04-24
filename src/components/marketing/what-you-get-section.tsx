"use client";

const ITEMS = [
  {
    title: "Denied treatment can still get approved",
    body: "We help you understand why it was denied and what may change the decision.",
  },
  {
    title: "Bills can be corrected, reduced, or challenged",
    body: "We look for billing mistakes, coding issues, coverage errors, and charges that may not belong with you.",
  },
  {
    title: "Prior authorizations can move faster",
    body: "We identify what is missing, what needs to be sent, and how to reduce avoidable delays.",
  },
  {
    title: "Cost pressure can become more manageable",
    body: "We help you push for written options before bills, deadlines, or collections get harder to handle.",
  },
  {
    title: "Less guessing. Better next steps.",
    body: "You know who to contact, what to ask for, what to say, and when to escalate.",
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
  return (
    <section className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          When insurance gets messy, we help you find the fastest path to fix it.
        </h2>
        <p className="mt-3 text-center text-sm text-muted">
          No two cases are exactly the same. Whether it is a denial, bill, prior
          authorization, coverage question, or payment pressure, we review the
          details and give you a practical path forward.
        </p>

        <ul className="mt-8 space-y-5">
          {ITEMS.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <CheckIcon />
              <div>
                <p className="font-medium leading-snug">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
