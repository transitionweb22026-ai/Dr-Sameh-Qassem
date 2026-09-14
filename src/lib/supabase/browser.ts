import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Browser-side Supabase client used by the admin login page and the media
 * uploader. Unlike the plain `supabase-js` client in `lib/supabase/client.ts`
 * (used for the anonymous public contact form), this one writes the session
 * to cookies so the server (proxy, Server Components, Server Actions) can
 * see the same signed-in session.
 */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient(supabaseUrl as string, supabaseAnonKey as string);
}
