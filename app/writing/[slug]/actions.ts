"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────────────────
// Article-level Server Actions: bookmark + reading progress.
// Both require an active session — RLS would block these anyway, but we
// short-circuit early with a typed result so the client can pop the
// auth modal instead of getting a generic error.
// ─────────────────────────────────────────────────────────────────────────

type Result =
  | { ok: true; data?: unknown }
  | { ok: false; reason: "unauthenticated" | "error"; message?: string };

/**
 * Toggle a bookmark for the current user on the given essay slug.
 * Returns the new bookmarked state so the client can update UI optimistically.
 */
export async function toggleBookmark(slug: string): Promise<Result & { bookmarked?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  // Look up first — composite PK means insert-or-delete is the natural toggle.
  const { data: existing } = await supabase
    .from("bookmarks")
    .select("essay_slug")
    .eq("user_id", user.id)
    .eq("essay_slug", slug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("essay_slug", slug);
    if (error) return { ok: false, reason: "error", message: error.message };
    revalidatePath(`/writing/${slug}`);
    revalidatePath(`/writing`);
    return { ok: true, bookmarked: false };
  }

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, essay_slug: slug });
  if (error) return { ok: false, reason: "error", message: error.message };
  revalidatePath(`/writing/${slug}`);
  revalidatePath(`/writing`);
  return { ok: true, bookmarked: true };
}

/**
 * Save the user's deepest scroll progress on this essay. We only ever move
 * the value upward — coming back to the top must not erase progress.
 */
export async function saveReadingProgress(
  slug: string,
  scrollPct: number,
): Promise<Result> {
  if (typeof scrollPct !== "number" || Number.isNaN(scrollPct)) {
    return { ok: false, reason: "error", message: "invalid scroll value" };
  }
  const clamped = Math.max(0, Math.min(100, Math.round(scrollPct)));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  // Read existing — only write if new value is higher than what's stored.
  const { data: existing } = await supabase
    .from("reading_progress")
    .select("scroll_pct")
    .eq("user_id", user.id)
    .eq("essay_slug", slug)
    .maybeSingle();

  if (existing && existing.scroll_pct >= clamped) {
    return { ok: true };
  }

  const { error } = await supabase
    .from("reading_progress")
    .upsert(
      {
        user_id: user.id,
        essay_slug: slug,
        scroll_pct: clamped,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,essay_slug" },
    );
  if (error) return { ok: false, reason: "error", message: error.message };
  return { ok: true };
}
