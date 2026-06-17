import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ReplyForm } from "./ReplyForm";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("forum_threads")
    .select("title")
    .eq("id", id)
    .maybeSingle();
  return {
    title: data?.title
      ? `${data.title} — Faction forum`
      : "Thread — Faction forum",
  };
}

type Thread = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  profiles: { display_name: string | null } | null;
};

type Post = {
  id: string;
  thread_id: string;
  user_id: string;
  body: string;
  is_edited: boolean;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, threadRes, postsRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("forum_threads")
      .select(
        "id, title, body, user_id, is_edited, created_at, updated_at, profiles:profiles!forum_threads_user_id_fkey(display_name)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("forum_posts")
      .select(
        "id, thread_id, user_id, body, is_edited, created_at, profiles:profiles!forum_posts_user_id_fkey(display_name)",
      )
      .eq("thread_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const thread = threadRes.data as unknown as Thread | null;
  const posts = ((postsRes.data as unknown) as Post[]) ?? [];

  if (!thread) notFound();

  let isMember = false;
  if (user) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle();
    isMember = Boolean(sub);
  }

  return (
    <main className="relative">
      <header className="topo-overlay relative overflow-hidden border-b border-sand-100/8 px-[var(--content-pad)] pb-12 pt-32 md:pt-36">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[420px] w-[420px] rounded-full bg-oxblood-700/12 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[760px]">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-300/65">
            <Link href="/faction/forum" className="hover:text-sand-100 transition-colors">
              ← Forum
            </Link>
            <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/40" />
            <span className="text-sand-100/85">
              {thread.profiles?.display_name ?? "member"}
            </span>
            <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/40" />
            <span>{formatDate(thread.created_at)}</span>
            {thread.is_edited && (
              <>
                <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/40" />
                <span className="text-sand-300/55">edited</span>
              </>
            )}
          </div>

          <h1 className="font-display italic font-light text-sand-100 leading-[1.05] tracking-[-0.025em] text-[clamp(2rem,4.4vw,3rem)]">
            {thread.title}
          </h1>

          <div className="mt-7 max-w-[64ch] space-y-5 font-body text-[16px] leading-[1.85] text-sand-100/85 whitespace-pre-wrap">
            {thread.body}
          </div>

          <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-sand-300/55">
            <span className="block h-px w-10 bg-sand-300/40" />
            <span>
              {posts.length} {posts.length === 1 ? "reply" : "replies"}
            </span>
          </div>
        </div>
      </header>

      {/* Replies */}
      <section className="relative bg-void-700 py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-[760px] px-[var(--content-pad)]">
          {posts.length === 0 ? (
            <p className="text-center font-body text-[14px] text-sand-100/55">
              No replies yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {posts.map((p) => (
                <li
                  key={p.id}
                  className="rounded-2xl border border-sand-100/12 bg-white/[0.03] px-5 py-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-300/55">
                    <span className="text-sand-100/85">
                      {p.profiles?.display_name ?? "member"}
                    </span>
                    <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/40" />
                    <span>{formatDate(p.created_at)}</span>
                    {p.is_edited && (
                      <>
                        <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/40" />
                        <span className="text-sand-300/55">edited</span>
                      </>
                    )}
                  </div>
                  <div className="font-body text-[15.5px] leading-[1.78] text-sand-100/85 whitespace-pre-wrap">
                    {p.body}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Reply composer */}
      <section className="relative border-t border-sand-100/8 bg-void-900 py-[clamp(2rem,4vw,3rem)]">
        <div className="mx-auto max-w-[760px] px-[var(--content-pad)]">
          <ReplyForm threadId={thread.id} signedIn={!!user} isMember={isMember} />
        </div>
      </section>
    </main>
  );
}
