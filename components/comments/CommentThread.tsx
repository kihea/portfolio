import { createClient } from "@/lib/supabase/server";
import { CommentCompose } from "./CommentCompose";
import { CommentItem } from "./CommentItem";

type Comment = {
  id: string;
  body: string;
  user_id: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  display_name: string | null;
};

type Props = {
  slug: string;
};

export async function CommentThread({ slug }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let isMember = false;
  if (user) {
    const { data: activeSub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle();
    isMember = Boolean(activeSub);
  }

  const { data: rows } = await supabase
    .from("comments")
    .select(
      "id, body, user_id, is_edited, created_at, updated_at, profiles(display_name)",
    )
    .eq("essay_slug", slug)
    .order("created_at", { ascending: true });

  const comments: Comment[] = (rows ?? []).map((r) => {
    const profile = r.profiles as
      | { display_name: string | null }
      | { display_name: string | null }[]
      | null;
    const displayName = Array.isArray(profile)
      ? profile[0]?.display_name ?? null
      : profile?.display_name ?? null;
    return {
      id: r.id,
      body: r.body,
      user_id: r.user_id,
      is_edited: r.is_edited,
      created_at: r.created_at,
      updated_at: r.updated_at,
      display_name: displayName,
    };
  });

  return (
    <section
      id="comments"
      aria-label="Comments"
      className="relative border-t border-[var(--rule)] bg-[color:var(--bg)] py-[clamp(3rem,6vw,5rem)]"
    >
      <div className="mx-auto max-w-[760px] px-[var(--content-pad)]">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
              <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
              The room
            </div>
            <h2 className="font-display italic font-light text-[color:var(--fg)] leading-[1.05] tracking-[-0.02em] text-[clamp(1.7rem,3vw,2.2rem)]">
              {comments.length === 0
                ? "No one's spoken yet."
                : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
            Member-only · be civil · be specific
          </p>
        </header>

        {comments.length > 0 && (
          <ul className="mb-10 space-y-5">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                slug={slug}
                comment={{
                  id: c.id,
                  body: c.body,
                  displayName: c.display_name,
                  createdAt: c.created_at,
                  isEdited: c.is_edited,
                  isOwner: user?.id === c.user_id,
                }}
              />
            ))}
          </ul>
        )}

        <CommentCompose
          slug={slug}
          signedIn={!!user}
          isMember={isMember}
        />
      </div>
    </section>
  );
}
