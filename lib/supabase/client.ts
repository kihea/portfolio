"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase browser client. Reads session from cookies (set by middleware)
 * and is safe to call in client components / event handlers.
 *
 * Returns a fresh client per call — Supabase's clients are cheap to construct
 * and stateless, and this avoids the React 19 / Server-Component sharing
 * pitfalls of a singleton.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
