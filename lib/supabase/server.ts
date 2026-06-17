import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase server client for use in Server Components, Route Handlers, and
 * Server Actions. Reads + writes cookies via Next's `cookies()` helper so
 * the session stays in sync with the browser.
 *
 * NOTE: in pure Server Components (no Server Action / Route Handler),
 * `cookieStore.set` will throw — we swallow that. Middleware handles the
 * actual session refresh write.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — middleware will handle it.
          }
        },
      },
    },
  );
}
