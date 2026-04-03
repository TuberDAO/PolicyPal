import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { getClientEnv } from "@/env";

/**
 * Supabase browser client — for use in client components.
 *
 * Uses the anon key and reads/writes auth cookies automatically.
 * All queries go through RLS with the current user's JWT.
 */
export function createClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
    getClientEnv();

  return createBrowserClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
