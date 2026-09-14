import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Refreshes the Supabase session cookie for the current request and reports
 * whether a signed-in session exists. Used by `src/proxy.ts` to guard
 * `/admin/*` — see the Supabase SSR docs for the request-cookie /
 * response-cookie dance this requires in Next.js middleware:
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * Deliberately uses `getSession()` (reads/refreshes the local JWT) rather
 * than `getUser()` (a network round-trip to Supabase's Auth server on every
 * single request). The proxy only needs a fast "is anyone signed in at all"
 * gate for the redirect — every Server Action and dashboard layout already
 * re-verifies with the authoritative `getUser()` check via `requireAdmin()`
 * before touching any data. Calling `getUser()` here too caused a real bug:
 * Next.js issues several proxy-covered requests per navigation (the page
 * plus RSC data fetches), and firing that many auth-server round-trips back
 * to back occasionally hit Supabase's rate limit, which surfaced as random
 * "logged out" redirects even with a perfectly valid session.
 */
export async function getSupabaseUserForProxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    return { user: null, response };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { user: session?.user ?? null, response };
}
