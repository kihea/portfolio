import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link callback. Supabase redirects the user here with `?code=...`
 * after they click the email link. We exchange the code for a session
 * (Supabase sets the cookies server-side), then route based on whether
 * they've finished the welcome flow:
 *
 *   - no display_name yet  →  /faction/welcome  (run onboarding)
 *   - display_name set     →  ?next param, or "/"
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const explicitNext = url.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  // Session is set — figure out where to send them.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/?auth_error=no_user", url.origin));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  // First time through — no display name → onboarding.
  if (!profile?.display_name) {
    return NextResponse.redirect(new URL("/faction/welcome", url.origin));
  }

  // Returning user — honor ?next= if they came from a gated CTA.
  return NextResponse.redirect(new URL(explicitNext || "/", url.origin));
}
