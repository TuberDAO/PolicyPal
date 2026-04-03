import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database";

/**
 * Middleware helper — refreshes the Supabase auth session on each request.
 *
 * Call this from the app's proxy/middleware to keep auth tokens alive.
 * It reads cookies from the incoming request, calls getUser() to trigger
 * a token refresh if needed, and writes updated cookies to the response.
 *
 * Route protection logic is NOT handled here — add it in the proxy/middleware
 * after calling this function.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Triggers token refresh if the access token is expired.
  // IMPORTANT: Do not use getSession() here — it reads from storage only
  // and does not guarantee the token is fresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
