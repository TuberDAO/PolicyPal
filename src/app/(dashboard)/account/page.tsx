import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account" };

/**
 * Account page — name, email (read-only), sign-out.
 * No password management (auth is Google OAuth + magic link only).
 * Implementation will be added in the hardening phase.
 */
export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
      <p className="text-sm text-muted">
        Account settings will appear here.
      </p>
    </div>
  );
}
