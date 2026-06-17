import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "The Faction · forum — Divine Ipseity",
  description: "The members' room. Threads, arguments, follow-ups.",
};

type ThreadRow = {
  id: string;
  title: string;
  user_id: string;
  posts_count: number;
  last_activity_at: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  const wk = Math.floor(day / 7);
  if (wk < 5) return `${wk}w`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const CATEGORIES = [
  {
    id: "argument",
    name: "The Argument",
    description: "Open debate, pushback, and threads worth your attention.",
    accent: "#B11226",
    tags: ["Debate", "Critique", "Active"],
  },
  {
    id: "systematic-sins",
    name: "Systematic Sins",
    description: "Named and recurring criticism of structural failures.",
    accent: "#7A0E1F",
    tags: ["Series", "Criticism"],
  },
  {
    id: "essays",
    name: "Essays & Response",
    description: "Long reads. Sit with them before you reply.",
    accent: "#5C0F1A",
    tags: ["Long-form", "Reference"],
  },
  {
    id: "general",
    name: "The Room",
    description: "Signals, links, loose thoughts. Everything else.",
    accent: "#4A0E18",
    tags: ["General"],
  },
] as const;

export default async function ForumIndex() {
  const supabase = await createClient();

  const [{ data: { user } }, threadsRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("forum_threads")
      .select(
        "id, title, user_id, posts_count, last_activity_at, created_at, profiles:profiles!forum_threads_user_id_fkey(display_name)",
      )
      .order("last_activity_at", { ascending: false })
      .limit(50),
  ]);

  const threads = ((threadsRes.data as unknown) as ThreadRow[] | null) ?? [];

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

  // Latest 4 threads shown in each category row
  const latestPreview = threads.slice(0, 4);

  return (
    <main className="relative">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="topo-overlay relative overflow-hidden border-b border-sand-100/8 px-[var(--content-pad)] pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[460px] w-[460px] rounded-full bg-oxblood-700/12 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[1060px]">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-oxblood-300/95">
            <span className="block h-[3px] w-[3px] rounded-full bg-oxblood-300" />
            The Faction · forum
          </div>

          <h1 className="font-display italic font-light text-sand-100 leading-[1.04] tracking-[-0.025em] text-[clamp(2.2rem,5vw,3.4rem)]">
            The room.
          </h1>

          <p className="mt-5 max-w-[58ch] font-body text-[15.5px] leading-[1.78] text-sand-100/72">
            Threads are public to read. Posting and replying are open to active
            Faction members.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isMember ? (
              <Link href="/faction/forum/new" className="btn-primary btn-sm">
                Start a thread
              </Link>
            ) : (
              <Link href="/faction" className="btn-ghost btn-sm">
                Members post — see how →
              </Link>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-300/55">
              {threads.length} {threads.length === 1 ? "thread" : "threads"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Category index ───────────────────────────────────────────────── */}
      <section className="border-b border-sand-100/8 bg-void-700">
        <div className="mx-auto max-w-[1060px] px-[var(--content-pad)]">

          {/* Column headers */}
          <div className="hidden border-b border-sand-100/8 py-3 md:grid md:grid-cols-[1fr_80px_1fr]">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-sand-300/45">Category</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-sand-300/45 text-center">Threads</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-sand-300/45 pl-6">Latest</span>
          </div>

          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={`grid grid-cols-1 gap-0 py-5 md:grid-cols-[1fr_80px_1fr] ${i < CATEGORIES.length - 1 ? "border-b border-sand-100/8" : ""}`}
            >
              {/* Left — category info */}
              <div className="flex gap-4">
                {/* Accent bar */}
                <div
                  className="mt-1 hidden w-[3px] flex-shrink-0 rounded-full sm:block"
                  style={{ backgroundColor: cat.accent }}
                />
                <div>
                  <h2 className="font-heading font-semibold text-sand-100 text-[15px] leading-snug">
                    {cat.name}
                  </h2>
                  <p className="mt-1 font-body text-[13px] leading-[1.6] text-sand-100/55 max-w-[36ch]">
                    {cat.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-sand-100/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-sand-300/60"
                      >
                        <span
                          className="block h-[5px] w-[5px] rounded-full"
                          style={{ backgroundColor: cat.accent }}
                        />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle — thread count */}
              <div className="hidden md:flex md:items-start md:justify-center md:pt-0.5">
                <div className="text-center">
                  <div className="font-mono text-[18px] font-bold tabular-nums text-sand-100/80">
                    {threads.length}
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-sand-300/40">
                    threads
                  </div>
                </div>
              </div>

              {/* Right — latest threads */}
              <div className="mt-4 md:mt-0 md:pl-6 md:border-l md:border-sand-100/8">
                {latestPreview.length === 0 ? (
                  <p className="font-body text-[12px] text-sand-300/40 italic">No threads yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {latestPreview.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/faction/forum/${t.id}`}
                          className="group flex items-baseline justify-between gap-3 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-white/[0.04]"
                        >
                          <span className="truncate font-body text-[13px] text-sand-100/78 group-hover:text-sand-100 transition-colors leading-snug">
                            {t.title}
                          </span>
                          <span className="flex-shrink-0 font-mono text-[10px] text-sand-300/40">
                            {timeAgo(t.last_activity_at)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── All threads ──────────────────────────────────────────────────── */}
      <section className="relative bg-void-700 py-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="mx-auto max-w-[1060px] px-[var(--content-pad)]">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-sand-300/55">
              All threads
            </h2>
            {isMember && (
              <Link href="/faction/forum/new" className="btn-ghost btn-sm text-[11px]">
                + New thread
              </Link>
            )}
          </div>

          {threads.length === 0 ? (
            <div className="rounded-2xl border border-sand-100/12 bg-white/[0.03] px-6 py-10 text-center">
              <p className="font-display italic text-sand-100 text-[clamp(1.2rem,2vw,1.5rem)]">
                Empty room.
              </p>
              <p className="mt-3 font-body text-[14px] leading-[1.7] text-sand-100/65 max-w-[40ch] mx-auto">
                No threads yet. The first one sets the tone.
              </p>
              {isMember && (
                <Link href="/faction/forum/new" className="btn-primary btn-sm mt-6 inline-flex">
                  Start the first thread
                </Link>
              )}
            </div>
          ) : (
            <ul className="space-y-2">
              {threads.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/faction/forum/${t.id}`}
                    className="group flex items-center justify-between gap-6 rounded-xl border border-sand-100/10 bg-white/[0.025] px-5 py-3.5 transition-colors hover:border-sand-100/25 hover:bg-white/[0.05]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-sand-300/45">
                        <span className="text-sand-100/65">{t.profiles?.display_name ?? "member"}</span>
                        <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/30" />
                        <span>{timeAgo(t.last_activity_at)}</span>
                      </div>
                      <div className="truncate font-display italic text-sand-100 leading-[1.2] text-[clamp(1rem,1.5vw,1.15rem)]">
                        {t.title}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-[13px] tabular-nums text-sand-100/70">{t.posts_count}</div>
                      <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-sand-300/40">
                        {t.posts_count === 1 ? "reply" : "replies"}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
