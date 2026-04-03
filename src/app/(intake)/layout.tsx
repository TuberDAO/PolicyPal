import Link from "next/link";
import { BRAND } from "@/constants";

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
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {BRAND.name}
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </>
  );
}
