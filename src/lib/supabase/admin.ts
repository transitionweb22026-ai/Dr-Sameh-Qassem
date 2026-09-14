import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "./server";

export class NotAdminError extends Error {
  constructor(message = "Not signed in as an admin.") {
    super(message);
    this.name = "NotAdminError";
  }
}

/**
 * Confirms the current request has a signed-in user AND that user has an
 * `admin_profiles` row, then returns both the client and the user.
 *
 * The proxy (`src/proxy.ts`) already redirects unauthenticated visitors away
 * from `/admin/*`, but per the Next.js docs, a proxy matcher change or a
 * Server Action reached from elsewhere can silently skip that check — so
 * every Server Action that writes CMS content calls this too rather than
 * trusting the proxy alone.
 *
 * Wrapped in `cache()` for the same reason as `createSupabaseServerClient`:
 * this makes a real network call to Supabase's Auth API, and de-duping it
 * within one render pass avoids piling up calls that can trip Supabase's
 * rate limit.
 */
export const requireAdmin = cache(async function requireAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new NotAdminError("You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new NotAdminError("This account does not have admin access.");
  }

  return { supabase, user, profile };
});
