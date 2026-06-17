"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────────────────
// Forum Server Actions: create thread, reply, edit, delete.
// All writes are RLS-gated to active members at the database level —
// these wrappers add typed errors + revalidation so the UI updates.
// ─────────────────────────────────────────────────────────────────────────

const TITLE_MIN = 3;
const TITLE_MAX = 140;
const BODY_MIN = 1;
const BODY_MAX = 8000;

type Result =
  | { ok: true; data?: unknown }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "validation" | "error"; message?: string };

/** Create a new thread + redirect to the detail page on success. */
export async function createThread(formData: FormData): Promise<Result> {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    return { ok: false, reason: "validation", message: `Title must be ${TITLE_MIN}-${TITLE_MAX} characters.` };
  }
  if (body.length < BODY_MIN || body.length > BODY_MAX) {
    return { ok: false, reason: "validation", message: `Body must be ${BODY_MIN}-${BODY_MAX} characters.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const { data, error } = await supabase
    .from("forum_threads")
    .insert({ user_id: user.id, title, body })
    .select("id")
    .single();

  if (error) {
    // RLS policy "forum_threads insert member" rejects non-members.
    if (error.code === "42501") {
      return { ok: false, reason: "forbidden", message: "Membership required to post." };
    }
    return { ok: false, reason: "error", message: error.message };
  }

  revalidatePath("/faction/forum");
  redirect(`/faction/forum/${data.id}`);
}

/** Reply to an existing thread. */
export async function replyToThread(threadId: string, formData: FormData): Promise<Result> {
  const body = String(formData.get("body") ?? "").trim();

  if (body.length < BODY_MIN || body.length > BODY_MAX) {
    return { ok: false, reason: "validation", message: `Reply must be ${BODY_MIN}-${BODY_MAX} characters.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const { error } = await supabase
    .from("forum_posts")
    .insert({ thread_id: threadId, user_id: user.id, body });

  if (error) {
    if (error.code === "42501") {
      return { ok: false, reason: "forbidden", message: "Membership required to reply." };
    }
    return { ok: false, reason: "error", message: error.message };
  }

  revalidatePath(`/faction/forum/${threadId}`);
  revalidatePath("/faction/forum");
  return { ok: true };
}

/** Delete a post the caller authored. */
export async function deletePost(postId: string, threadId: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const { error } = await supabase.from("forum_posts").delete().eq("id", postId);
  if (error) return { ok: false, reason: "error", message: error.message };

  revalidatePath(`/faction/forum/${threadId}`);
  return { ok: true };
}
