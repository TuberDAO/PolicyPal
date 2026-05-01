import Link from "next/link";
import { BRAND } from "@/constants";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} {BRAND.name}
            </p>
            <p className="text-xs text-muted">
              WinYourAppeal is a trading name of LucidPath Labs Ltd, a company registered in England and Wales.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
