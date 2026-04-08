const DELIVERABLES = [
  "Summary of your issue and what's happening",
  "Step-by-step action plan you can check off",
  "Who to contact and in what order",
  "Escalation targets when needed — titles, roles, and departments that influence outcomes",
  "What details to record from reviewers and decision-makers",
  "Draft wording for calls, letters, and emails",
];

export function WhatYouGetSection() {
  return (
    <section className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          What your Full Case Pack includes
        </h2>
        <p className="mt-3 text-center text-sm text-muted">
          A complete, human-written playbook tailored to your situation
        </p>

        <ul className="mt-8 space-y-4">
          {DELIVERABLES.map((item) => (
            <li key={item} className="flex items-start gap-3">
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
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
