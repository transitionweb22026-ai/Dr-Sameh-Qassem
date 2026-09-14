import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getSupabaseUserForProxy } from "./lib/supabase/proxy";

const handleIntlRouting = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin dashboard is not part of the bilingual public site — it never
  // gets a /ar or /en prefix, so it's handled entirely outside next-intl.
  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      return NextResponse.next();
    }

    const { user, response } = await getSupabaseUserForProxy(request);

    // A Server Action POST (identified by the `Next-Action` header Next.js
    // always attaches) must never be answered with an HTTP redirect: the
    // client expects a specific action-result response shape from this same
    // route, and a redirect to an unrelated page breaks that contract,
    // surfacing as "An unexpected response was received from the server."
    // When the session is invalid, let the request through instead — every
    // controller already calls `requireAdmin()` and returns a graceful
    // `{ ok: false, error }` via `runAction()`, which the client can handle
    // normally (see `src/lib/controllers/result.ts`).
    const isServerAction = request.headers.has("next-action");

    if (!user && !isServerAction) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return handleIntlRouting(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
