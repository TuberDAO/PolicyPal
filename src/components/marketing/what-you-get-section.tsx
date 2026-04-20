const DELIVERABLES = [
  {
    title: "Your story and supporting facts",
    body: "How your condition, treatment history, symptoms, delays, costs, and day to day impact help explain what happened and why the issue needs attention",
  },
  {
    title: "Clinical evidence and claim support",
    body: "The medical records, treatment history, symptoms, test results, and specialist support that may strengthen your position",
  },
  {
    title: "Coverage rules and review standards",
    body: "The plan criteria, billing rules, review standards, and applicable state and federal requirements relevant to your case",
  },
  {
    title: "Issues that may be hurting your case",
    body: "Missing information, coding issues, documentation weaknesses, process failures, and other problems that may be affecting your claim, appeal, bill, or coverage position",
  },
  {
    title: "Clear next steps",
    body: "What to do next, what to submit, what to say, what to ask for, and when to escalate",
  },
  {
    title: "Escalation targets when needed",
    body: "Specific names, departments, decision makers, and higher level paths that may help move the case forward faster",
  },
];

export function WhatYouGetSection() {
  return (
    <section className="bg-accent-light/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          What your case pack can include
        </h2>
        <p className="mt-3 text-center text-sm text-muted">
          AppealSupportPro helps organize the facts, records, rules, and next steps that may strengthen your position, support an appeal, correct errors, reduce avoidable costs where possible, and move your case forward faster.
        </p>

        <ul className="mt-8 space-y-5">
          {DELIVERABLES.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
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
