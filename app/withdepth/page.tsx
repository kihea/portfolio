import Link from "next/link";
import type { Metadata } from "next";
import { essays, getEssay, type Essay } from "@/lib/essays";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "WithDepth — Divine Ipseity",
  description:
    "Long-form essays and video on systems, identity, and what comes after.",
};

export default async function WithDepthPage() {
  const [featured, ...rest] = essays;

  // Server-side: pull resume position + bookmark set if signed in.
  let resume: { slug: string; title: string; pct: number } | null = null;
  let bookmarkSlugs = new Set<string>();
  let userSignedIn = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userSignedIn = !!user;
    if (user) {
      const [progressRes, bookmarksRes] = await Promise.all([
        supabase
          .from("reading_progress")
          .select("essay_slug, scroll_pct, updated_at")
          .eq("user_id", user.id)
          .gt("scroll_pct", 5)
          .lt("scroll_pct", 95)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("bookmarks")
          .select("essay_slug")
          .eq("user_id", user.id),
      ]);
      if (progressRes.data) {
        const e = getEssay(progressRes.data.essay_slug);
        if (e) {
          resume = {
            slug: e.slug,
            title: e.title,
            pct: progressRes.data.scroll_pct,
          };
        }
      }
      if (bookmarksRes.data) {
        bookmarkSlugs = new Set(bookmarksRes.data.map((b) => b.essay_slug));
      }
    }
  } catch {
    /* anonymous render */
  }

  return (
    <main className="relative">
      {/* ─── Header — editorial masthead ─────────────────────────── */}
      <header className="relative border-b border-[var(--rule)] px-[var(--content-pad)] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(7rem,10vw,9rem)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          {/* Two-line masthead row: sub-brand + nav */}
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-6">
            <div>
              <div className="mb-2 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
                A Divine Ipseity sub-brand
              </div>
              <div className="font-display italic font-medium text-[color:var(--fg)] leading-none text-[clamp(2rem,4vw,3rem)] tracking-[-0.02em]">
                WithDepth
              </div>
            </div>
            <nav className="flex items-center gap-7 font-heading text-[11px] uppercase tracking-[0.18em] text-[color:var(--fg-2)]">
              <span className="text-[color:var(--accent)] border-b border-[color:var(--accent)] pb-1">
                Writing
              </span>
              {userSignedIn && (
                <Link
                  href="/withdepth/saved"
                  className="hover:text-[color:var(--fg)] transition-colors"
                >
                  Saved
                </Link>
              )}
            </nav>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <div>
              <h1 className="max-w-[16ch] font-display italic font-light text-[color:var(--fg)] leading-[1.02] tracking-[-0.03em] text-[clamp(2.5rem,5.5vw,4.5rem)]">
                Long-form, on purpose.
              </h1>
              <p className="mt-6 max-w-[54ch] font-body text-[15.5px] leading-[1.78] text-[color:var(--fg-2)] md:text-[16.5px]">
                The deeper material: essays you can take a walk with, videos
                that don&rsquo;t cut for the algorithm. The shorter takes go on
                YouTube; what lives here is the long version.
              </p>
              <div className="mt-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
                <span className="block h-px w-10 bg-[var(--rule-strong)]" />
                <span>
                  Vol. 01 · {essays.length}{" "}
                  {essays.length === 1 ? "essay" : "essays"}
                </span>
              </div>
            </div>

            {/* Resume strip — only when there's progress to resume */}
            {resume ? (
              <Link
                href={`/withdepth/${resume.slug}`}
                className="group relative block self-start overflow-hidden rounded-[6px] border border-[var(--rule)] bg-[var(--bg-alt)] px-6 py-5 transition-colors hover:border-[var(--rule-strong)]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
                    Continue reading
                  </div>
                  <div className="font-mono text-[10.5px] tabular-nums text-[color:var(--fg-2)]">
                    {resume.pct}%
                  </div>
                </div>
                <div className="font-display italic text-[color:var(--fg)] leading-[1.2] text-[clamp(1.1rem,1.6vw,1.35rem)]">
                  {resume.title}
                </div>
                <div className="mt-4 h-[2px] w-full overflow-hidden bg-[var(--rule)]">
                  <div
                    className="h-full bg-[var(--accent)] transition-[width] duration-500"
                    style={{ width: `${resume.pct}%` }}
                  />
                </div>
              </Link>
            ) : (
              <div className="self-start rounded-[6px] border border-[var(--rule)] bg-[var(--bg-alt)] px-6 py-5">
                <div className="mb-2 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
                  In this issue
                </div>
                <p className="max-w-[34ch] font-body text-[14px] leading-[1.7] text-[color:var(--fg-2)]">
                  {featured.excerpt.slice(0, 140)}
                  {featured.excerpt.length > 140 ? "…" : ""}
                </p>
                <Link
                  href={`/withdepth/${featured.slug}`}
                  className="mt-4 inline-block font-heading text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent)] hover:text-[color:var(--accent-hover)]"
                >
                  Open the issue →
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Featured (the current issue) — single full row ─────────── */}
      <section className="relative border-b border-[var(--rule)] px-[var(--content-pad)] py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="mb-7 flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-3">
            <div className="font-heading text-[11px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              The current issue
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
              {featured.issue}
            </div>
          </div>
          <FeaturedRow essay={featured} bookmarked={bookmarkSlugs.has(featured.slug)} />
        </div>
      </section>

      {/* ─── Archive — editorial list, not grid ─────────────────────── */}
      <section className="relative px-[var(--content-pad)] py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="mb-2 flex items-baseline justify-between gap-6 border-b border-[var(--rule)] pb-3">
            <div className="font-heading text-[11px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              The archive
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
              {rest.length} earlier {rest.length === 1 ? "essay" : "essays"}
            </div>
          </div>
          <ul>
            {rest.map((essay) => (
              <li key={essay.slug}>
                <ArchiveRow
                  essay={essay}
                  bookmarked={bookmarkSlugs.has(essay.slug)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────

function FeaturedRow({
  essay,
  bookmarked,
}: {
  essay: Essay;
  bookmarked: boolean;
}) {
  return (
    <Link
      href={`/withdepth/${essay.slug}`}
      className="group block transition-colors hover:bg-[var(--accent-tint)]"
    >
      <div className="grid gap-6 px-1 py-7 md:grid-cols-[140px_1fr_160px] md:gap-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--fg-2)]">
          {essay.date}
        </div>
        <div>
          <div className="mb-2 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
            {essay.tag}
            {bookmarked && <span className="ml-3 text-[color:var(--fg-3)]">· saved</span>}
          </div>
          <h2 className="font-display italic font-medium text-[color:var(--fg)] leading-[1.06] tracking-[-0.02em] text-[clamp(2rem,4vw,3rem)]">
            {essay.title}
          </h2>
          <p className="mt-4 max-w-[60ch] font-body text-[15.5px] leading-[1.7] text-[color:var(--fg-2)]">
            {essay.excerpt}
          </p>
          <span className="mt-5 inline-block font-heading text-[11px] uppercase tracking-[0.18em] text-[color:var(--accent)] transition-colors group-hover:text-[color:var(--accent-hover)]">
            Read the issue →
          </span>
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
          <div>{essay.read}</div>
        </div>
      </div>
    </Link>
  );
}

function ArchiveRow({
  essay,
  bookmarked,
}: {
  essay: Essay;
  bookmarked: boolean;
}) {
  return (
    <Link
      href={`/withdepth/${essay.slug}`}
      className="group block border-b border-[var(--rule)] transition-colors hover:bg-[var(--accent-tint)]"
    >
      <div className="grid gap-4 px-1 py-6 md:grid-cols-[140px_1fr_160px] md:gap-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
          {essay.date}
        </div>
        <div>
          <div className="mb-1.5 font-heading text-[9.5px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
            {essay.tag}
            {bookmarked && <span className="ml-3 text-[color:var(--fg-3)]">· saved</span>}
          </div>
          <h3 className="font-display italic font-medium text-[color:var(--fg)] leading-[1.18] tracking-[-0.015em] text-[clamp(1.4rem,2.4vw,1.8rem)] group-hover:text-[color:var(--accent)] transition-colors">
            {essay.title}
          </h3>
          <p className="mt-2 max-w-[68ch] font-body text-[14.5px] leading-[1.65] text-[color:var(--fg-2)]">
            {essay.excerpt}
          </p>
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
          <div>{essay.read}</div>
          <div className="mt-1 opacity-60">{essay.issue.split("·")[1]?.trim()}</div>
        </div>
      </div>
    </Link>
  );
}
