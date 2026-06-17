"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type WelcomeResult =
  | { ok: true; nextUrl: string }
  | { ok: false; error: string };

const NAME_MIN = 2;
const NAME_MAX = 40;

/**
 * Persists the display name + tier intent for a freshly signed-in user.
 * Called from the WelcomeFlow client component as a Server Action.
 *
 * - Both tiers save the display name.
 * - "member" additionally stamps profiles.wants_membership_at — when Stripe
 *   is live, we use that to email everyone who tried to join early.
 * - "free" clears the membership stamp (in case they came back to switch).
 *
 * Returns a result the client can use to drive the post-submit transition.
 * Throws nothing on success — uses redirect() from the server.
 */
export async function completeWelcome(formData: FormData): Promise<WelcomeResult> {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const tier = String(formData.get("tier") ?? "");

  if (displayName.length < NAME_MIN || displayName.length > NAME_MAX) {
    return {
      ok: false,
      error: `Display name must be between ${NAME_MIN} and ${NAME_MAX} characters.`,
    };
  }

  if (tier !== "free" && tier !== "member") {
    return { ok: false, error: "Pick a tier to continue." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { ok: false, error: "Your session expired. Sign in again." };
  }

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      wants_membership_at:
        tier === "member" ? new Date().toISOString() : null,
    })
    .eq("id", user.id);

  if (updateErr) {
    return { ok: false, error: updateErr.message };
  }

  // Bust the cache for any page that reads the profile (faction page CTA etc.)
  revalidatePath("/", "layout");

  // Returning the URL keeps the post-submit transition under the client's
  // control — it can play an exit animation, then push the next route.
  return {
    ok: true,
    nextUrl: tier === "member" ? "/faction/checkout" : "/?welcome=1",
  };
}

/**
 * Server-side helper to bail out if a visitor hits /faction/welcome without
 * an active session. Used directly by the page to keep the client island
 * focused on UI.
 */
export async function requireUserOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_error=expired");
  return user;
}
