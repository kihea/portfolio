"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result =
  | { ok: true; completed: boolean }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "error" };

export async function markModuleComplete(
  courseSlug: string,
  moduleSlug: string,
): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, reason: "unauthenticated" };

  const { error } = await supabase.from("course_completions").upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      module_slug: moduleSlug,
    },
    { onConflict: "user_id,course_slug,module_slug" },
  );

  if (error) {
    console.error("[markModuleComplete]", error);
    return { ok: false, reason: "error" };
  }

  revalidatePath(`/learn/${courseSlug}/${moduleSlug}`);
  revalidatePath(`/learn/${courseSlug}`);
  revalidatePath("/learn");

  return { ok: true, completed: true };
}

export async function unmarkModuleComplete(
  courseSlug: string,
  moduleSlug: string,
): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, reason: "unauthenticated" };

  const { error } = await supabase
    .from("course_completions")
    .delete()
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("module_slug", moduleSlug);

  if (error) {
    console.error("[unmarkModuleComplete]", error);
    return { ok: false, reason: "error" };
  }

  revalidatePath(`/learn/${courseSlug}/${moduleSlug}`);
  revalidatePath(`/learn/${courseSlug}`);
  revalidatePath("/learn");

  return { ok: true, completed: false };
}
