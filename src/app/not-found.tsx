import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-cta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
      >
        Go home
      </Link>
    </main>
  );
}
