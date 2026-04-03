import type { Metadata } from "next";
import { BRAND } from "@/constants";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="w-full max-w-sm space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Sign in to {BRAND.name}
        </h1>
        <p className="text-sm text-muted">
          Get expert help with your health-insurance issue.
        </p>
      </div>

      <LoginForm next={next} authError={error === "auth"} />
    </div>
  );
}
