const DELIVERABLES = [
  "Summary of the issue",
  "Summary of the plan and why",
  "Step-by-step next steps",
  "Phone, email, portal, or letter guidance",
  "Draft wording where useful",
  "Source details for people who want to verify",
];

export function WhatYouGetSection() {
  return (
    <section className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          What you get
        </h2>

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
