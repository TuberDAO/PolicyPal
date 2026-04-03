const SOURCES = [
  "HealthCare.gov",
  "Medicare.gov",
  "Medicaid.gov",
  "CMS",
  "U.S. Department of Labor",
  "IRS",
  "State insurance departments",
  "Your insurer\u2019s plan documents",
];

export function TrustedSourcesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Official sources we check when relevant
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SOURCES.map((source) => (
            <span
              key={source}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
