import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Proxy (Next.js 16 convention, formerly Middleware)
 *
 * Responsibilities:
 * 1. Refresh Supabase Auth session via cookie.
 * 2. Protect /dashboard, /case, /account routes (authenticated).
 * 3. Redirect authenticated users away from /login.
 * 4. Generate CSP nonce and set Content-Security-Policy header.
 *
 * Staff-level authorization for /admin/* is enforced in the admin layout
 * (not here) to avoid a per-request DB query. The proxy only checks that
 * /admin visitors are authenticated.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isCustomerRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/case") ||
    pathname.startsWith("/account");
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isCustomerRoute || isAdminRoute) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && user) {
    const dest = sanitizeRedirect(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── CSP nonce ──────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      "https://va.vercel-scripts.com",
      "https://js.stripe.com",
      isDev && "'unsafe-eval'",
    ]
      .filter(Boolean)
      .join(" "),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io",
    "frame-src https://js.stripe.com",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

/**
 * Prevent open-redirect attacks by only allowing relative paths.
 */
function sanitizeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  return raw;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp)$).*)",
  ],
};
