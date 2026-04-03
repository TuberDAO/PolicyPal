const STEPS = [
  {
    number: "1",
    title: "Tell us what\u2019s wrong",
    description:
      "Select your issue type and describe what happened in your own words.",
  },
  {
    number: "2",
    title: "Upload your documents",
    description:
      "Share any relevant bills, EOBs, denial letters, or correspondence.",
  },
  {
    number: "3",
    title: "Get your action plan",
    description:
      "Receive a clear, step-by-step plan built for your specific situation.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 font-heading font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-base leading-relaxed text-muted">
          There is often a clear path forward if the right steps are taken in
          the right order.
        </p>
      </div>
    </section>
  );
}
