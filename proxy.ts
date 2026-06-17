import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Per-request session refresh. Without this, an active Supabase session
 * eventually expires from the browser's POV — the access token isn't
 * refreshed unless something on the server reads cookies. Calling
 * `getUser()` here triggers a refresh when needed and writes the new
 * cookies onto the response.
 *
 * Two fast-paths to avoid hitting Supabase on every single request:
 *   1. No Supabase env vars yet → bail.
 *   2. No Supabase session cookie present → bail. Unauthenticated browsing
 *      pays zero round-trips to the auth server. This is the difference
 *      between every page load taking ~300ms and ~5ms.
 */

const SESSION_COOKIE_PREFIX = "sb-";
const SESSION_COOKIE_NEEDLE = "-auth-token";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  // Fast path: no session cookie → nothing to refresh.
  const hasSession = request.cookies.getAll().some(
    (c) =>
      c.name.startsWith(SESSION_COOKIE_PREFIX) &&
      c.name.includes(SESSION_COOKIE_NEEDLE),
  );
  if (!hasSession) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    /*
     * Run on page navigations only. Skip:
     *   - Next internals: _next/static, _next/image, _next/data
     *   - Static assets: favicon, public/ subfolders, anything with a file extension
     *   - API routes (handle their own auth)
     *   - The auth callback (manages its own session exchange)
     */
    "/((?!_next/static|_next/image|_next/data|favicon.ico|videos|images|fonts|api/|auth/callback|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
