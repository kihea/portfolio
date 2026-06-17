import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { essays, getEssay } from "@/lib/essays";
import { createClient } from "@/lib/supabase/server";
import { SectionMarker } from "@/components/effects/SectionMarker";
import { CommentThread } from "@/components/comments/CommentThread";
import { ShareDialog } from "@/components/article/ShareDialog";
import { BookmarkButton } from "@/components/article/BookmarkButton";
import { ReadingProgressTracker } from "@/components/article/ReadingProgressTracker";
import { ArticleBody } from "@/components/article/ArticleBody";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return { title: "Essay not found — Divine Ipseity" };
  return {
    title: `${essay.title} — Divine Ipseity`,
    description: essay.excerpt,
    openGraph: {
      title: essay.title,
      description: essay.excerpt,
      type: "article",
      ...(essay.image ? { images: [essay.image] } : {}),
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const idx = essays.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? essays[idx - 1] : null;
  const next = idx >= 0 && idx < essays.length - 1 ? essays[idx + 1] : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [commentCountRes, bookmarkRes, progressRes] = await Promise.all([
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("essay_slug", slug),
    user
      ? supabase
          .from("bookmarks")
          .select("essay_slug")
          .eq("user_id", user.id)
          .eq("essay_slug", slug)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("reading_progress")
          .select("scroll_pct")
          .eq("user_id", user.id)
          .eq("essay_slug", slug)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const commentCount = commentCountRes.count ?? 0;
  const isBookmarked = Boolean(bookmarkRes.data);
  const initialPct =
    progressRes.data && "scroll_pct" in progressRes.data
      ? (progressRes.data.scroll_pct as number)
      : 0;

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const articleUrl = `${proto}://${host}/withdepth/${slug}`;

  return (
    <main className="relative">
      {/* ───────── Header ───────── */}
      <header className="topo-overlay overflow-hidden border-b border-[var(--rule)] px-[var(--content-pad)] pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[color:var(--accent)]/8 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[820px]">
          {/* Breadcrumb / meta row */}
          <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
            <Link
              href="/withdepth"
              className="cursor-pointer text-[color:var(--accent)] transition-colors hover:text-[color:var(--fg)]"
            >
              ← The Writing
            </Link>
            <Dot />
            <span className="text-[color:var(--fg-3)]">{essay.issue}</span>
            <Dot />
            <span className="text-[color:var(--fg-3)]">{essay.date}</span>
            <Dot />
            <span className="text-[color:var(--fg-3)]">{essay.read}</span>
            <Dot />
            <a
              href="#comments"
              className="cursor-pointer transition-colors hover:text-[color:var(--fg)] text-[color:var(--fg-3)]"
              aria-label={`${commentCount} comments — jump to discussion`}
            >
              {commentCount === 0
                ? "Be the first to comment"
                : `${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
            </a>
          </div>

          {/* Tag chip */}
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-block rounded-full border border-[var(--rule)] bg-[color:var(--fg)] px-3 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)]">
              {essay.tag}
            </span>
          </div>

          {/* Title + optional image — two-column on large screens */}
          <div className={essay.image ? "grid grid-cols-1 gap-8 md:grid-cols-[1fr_240px] md:items-start" : undefined}>
            <div>
              <h1 className="font-display italic font-light text-[color:var(--fg)] leading-[1.04] tracking-[-0.025em] text-[clamp(2.25rem,5vw,56px)] tura-wordmark">
                {essay.title}
              </h1>

              <p className="mt-7 font-body text-[16px] leading-[1.78] text-[color:var(--fg-2)] md:text-[17px]">
                {essay.excerpt}
              </p>

              {/* Action toolbar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ShareDialog title={essay.title} url={articleUrl} />
                <BookmarkButton
                  slug={slug}
                  initialBookmarked={isBookmarked}
                  signedIn={!!user}
                />
              </div>
            </div>

            {/* Article image — only rendered if essay.image is set */}
            {essay.image && (
              <div className="relative h-[260px] overflow-hidden rounded-[4px] border border-[var(--rule)] md:h-[320px] md:w-[240px] md:self-start">
                <Image
                  src={essay.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            )}
          </div>

          <div className="mt-8 h-px w-12 bg-[color:var(--accent)]/65" />
        </div>
      </header>

      {/* Reading progress tracker */}
      <ReadingProgressTracker
        slug={slug}
        signedIn={!!user}
        initialPct={initialPct}
      />

      {/* ───────── Body ───────── */}
      <section className="relative overflow-hidden bg-[color:var(--bg)] py-[clamp(3rem,7vw,6rem)]">
        <SectionMarker number="01" label="The essay" />

        <div className="relative z-10 mx-auto max-w-[760px] px-[var(--content-pad)]">
          {essay.pullQuote && (
            <figure className="my-2 mb-12 border-l-2 border-[color:var(--accent)]/60 pl-6 md:pl-8">
              <blockquote className="font-display italic font-light text-[color:var(--fg)] leading-[1.25] tracking-[-0.015em] text-[clamp(1.5rem,2.6vw,28px)]">
                &ldquo;{essay.pullQuote}&rdquo;
              </blockquote>
            </figure>
          )}

          {/* ArticleBody owns rendering, selection toolbar, and highlight storage */}
          <ArticleBody
            body={essay.body}
            essaySlug={slug}
            articleUrl={articleUrl}
            essayTitle={essay.title}
          />

          {/* End mark */}
          <div className="mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
            <span className="block h-px w-12 bg-[color:var(--fg-3)]" />
            <span>End of issue {essay.issue.split("·")[1]?.trim() || essay.issue}</span>
          </div>
        </div>
      </section>

      {/* ───────── Comments thread ───────── */}
      <div id="comments" className="scroll-mt-24">
        <CommentThread slug={slug} />
      </div>

      {/* ───────── Prev / Next ───────── */}
      <section className="border-t border-[var(--rule)] bg-[color:var(--bg)] py-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-[var(--max-width)] px-[var(--content-pad)]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {prev ? (
              <Link
                href={`/withdepth/${prev.slug}`}
                className="group glass-card block rounded-[20px] p-6 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-[var(--rule-strong)] cursor-pointer"
              >
                <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--fg-3)]">
                  <span className="text-lg leading-none transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  <span>Earlier</span>
                </div>
                <div className="font-display italic text-[color:var(--fg)] leading-[1.2] text-[clamp(1.1rem,1.6vw,1.35rem)]">
                  {prev.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/withdepth/${next.slug}`}
                className="group glass-card block rounded-[20px] p-6 text-right transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-[var(--rule-strong)] cursor-pointer"
              >
                <div className="mb-2 flex items-center justify-end gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--fg-3)]">
                  <span>Next</span>
                  <span className="text-lg leading-none transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <div className="font-display italic text-[color:var(--fg)] leading-[1.2] text-[clamp(1.1rem,1.6vw,1.35rem)]">
                  {next.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/withdepth"
              className="cursor-pointer rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)] px-7 py-3 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg)] transition-all duration-300 hover:border-[var(--rule-strong)]"
            >
              Back to all writing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Dot() {
  return (
    <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--fg-3)]/60" />
  );
}

