import Link from "next/link";

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-border bg-surface px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex h-9 items-center font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          WinYourAppeal
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </>
  );
}
