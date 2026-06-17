"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BODY_MIN = 1;
const BODY_MAX = 4000;

export type CommentResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Create a comment on an essay. RLS enforces:
 *   - the inserter is signed in,
 *   - they have an active membership,
 *   - user_id matches auth.uid().
 * We additionally validate length client-side here for nicer error UX.
 */
export async function createComment(
  slug: string,
  body: string,
): Promise<CommentResult> {
  const trimmed = body.trim();
  if (trimmed.length < BODY_MIN) {
    return { ok: false, error: "Empty comment." };
  }
  if (trimmed.length > BODY_MAX) {
    return { ok: false, error: `Max ${BODY_MAX} characters.` };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to comment." };

  const { error } = await supabase.from("comments").insert({
    essay_slug: slug,
    user_id: user.id,
    body: trimmed,
  });

  if (error) {
    // RLS will reject non-members with a row-level-security error. Translate
    // it into something readable.
    if (error.message.toLowerCase().includes("row-level security")) {
      return {
        ok: false,
        error: "Comments are open to Faction members.",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/writing/${slug}`);
  return { ok: true };
}

export async function updateComment(
  commentId: string,
  body: string,
  slug: string,
): Promise<CommentResult> {
  const trimmed = body.trim();
  if (trimmed.length < BODY_MIN || trimmed.length > BODY_MAX) {
    return { ok: false, error: "Invalid length." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to edit." };

  const { error } = await supabase
    .from("comments")
    .update({ body: trimmed })
    .eq("id", commentId)
    .eq("user_id", user.id); // belt-and-suspenders alongside RLS

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/writing/${slug}`);
  return { ok: true };
}

export async function deleteComment(
  commentId: string,
  slug: string,
): Promise<CommentResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to delete." };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/writing/${slug}`);
  return { ok: true };
}
