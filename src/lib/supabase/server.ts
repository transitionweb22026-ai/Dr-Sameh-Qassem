import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Server-side Supabase client bound to the request's auth cookies, for use
 * in Server Components, Server Actions, and Route Handlers. RLS policies
 * see this request's actual signed-in user (or `anon` if none), so admin
 * writes are enforced by the database — not by this helper.
 *
 * Wrapped in React's `cache()` so every controller call within the same
 * Server Component render reuses one client instance instead of each
 * constructing its own. This isn't just an optimization: a single admin
 * page load fans out into many controller calls (the hero, every section,
 * every section's content items), and each fresh supabase-js client
 * independently re-validates the session against Supabase's Auth API on
 * first use — enough of those in quick succession trips Supabase's Auth
 * rate limit and surfaces as random, spurious "signed out" redirects.
 */
export const createSupabaseServerClient = cache(async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render (not an Action/Route
          // Handler) — cookies can't be written here. The proxy's session
          // refresh already keeps the session cookie current, so this is
          // safe to ignore.
        }
      },
    },
  });
});
