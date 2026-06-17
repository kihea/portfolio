import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { courses, getCourse, getCourseModule } from "@/lib/courses";
import { getEssay } from "@/lib/essays";
import { createClient } from "@/lib/supabase/server";
import { SectionMarker } from "@/components/effects/SectionMarker";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ModuleCompleteButton } from "@/components/course/ModuleCompleteButton";
import { ModuleVideoEmbed } from "@/components/course/ModuleVideoEmbed";
import { ModuleQuiz } from "@/components/course/ModuleQuiz";
import { CourseProgressSidebar } from "@/components/course/CourseProgressSidebar";

type Params = { slug: string; module: string };

export function generateStaticParams(): Params[] {
  return courses.flatMap((c) =>
    c.modules.map((m) => ({ slug: c.slug, module: m.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, module: moduleSlug } = await params;
  const mod = getCourseModule(slug, moduleSlug);
  const course = getCourse(slug);
  if (!mod || !course) return { title: "Module not found — Divine Ipseity" };
  return {
    title: `${mod.title} — ${course.title}`,
    description: mod.body[0] ?? course.excerpt,
  };
}

export default async function ModuleReaderPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, module: moduleSlug } = await params;
  const course = getCourse(slug);
  const mod = getCourseModule(slug, moduleSlug);
  if (!course || !mod) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [membershipRes, completionsRes, grantsRes, completionRes] = await Promise.all([
    user
      ? supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .in("status", ["active", "trialing"])
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("course_completions")
          .select("module_slug")
          .eq("user_id", user.id)
          .eq("course_slug", slug)
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("course_access_grants")
          .select("course_slug")
          .eq("user_id", user.id)
          .eq("course_slug", slug)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("course_completions")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_slug", slug)
          .eq("module_slug", moduleSlug)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const isMember = Boolean(membershipRes.data);
  const hasGrant = Boolean(grantsRes.data);
  const canAccess = course.tier === "free" || mod.preview || isMember || hasGrant;
  const isCompleted = Boolean(completionRes.data);
  const completedSlugs = (completionsRes.data ?? []).map((r) => r.module_slug);

  // Server-side access gate
  if (!canAccess) {
    return <LockedModulePage course={course} modTitle={mod.title} />;
  }

  // Derive prev/next modules
  const idx = course.modules.findIndex((m) => m.slug === moduleSlug);
  const prevMod = idx > 0 ? course.modules[idx - 1] : null;
  const nextMod = idx < course.modules.length - 1 ? course.modules[idx + 1] : null;

  // For excerpt modules: pull the essay body slice
  const essayExcerpt =
    mod.type === "excerpt" && mod.essaySlug
      ? (getEssay(mod.essaySlug)?.body ?? []).slice(
          mod.excerptRange?.[0] ?? 0,
          (mod.excerptRange?.[1] ?? 5) + 1,
        )
      : null;
  const essayTitle =
    mod.type === "excerpt" && mod.essaySlug
      ? getEssay(mod.essaySlug)?.title ?? ""
      : "";

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const moduleUrl = `${proto}://${host}/learn/${slug}/${moduleSlug}`;

  const moduleIndex = idx + 1;
  const paddedIndex = String(moduleIndex).padStart(2, "0");

  const TYPE_LABELS: Record<string, string> = {
    read: "Read",
    reflect: "Reflect",
    excerpt: "Excerpt",
    video: "Watch",
    quiz: "Quiz",
  };

  return (
    <main className="relative">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="topo-overlay overflow-hidden border-b border-[var(--rule)] px-[var(--content-pad)] pb-14 pt-36 md:pb-16 md:pt-44">
        <div className="pointer-events-none absolute -right-[10%] -top-[20%] h-[400px] w-[400px] rounded-full bg-[color:var(--accent)]/6 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[820px]">
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
            <Link
              href={`/learn/${slug}`}
              className="text-[color:var(--accent)] transition-colors hover:text-[color:var(--fg)] cursor-pointer"
            >
              ← {course.title}
            </Link>
          </div>

          {/* Module meta */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-[var(--rule)] bg-[color:var(--fg)] px-3 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)]">
              {TYPE_LABELS[mod.type] ?? mod.type}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
              Module {moduleIndex} of {course.moduleCount}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
              · {mod.duration}
            </span>
          </div>

          <h1 className="font-display italic font-light text-[color:var(--fg)] leading-[1.04] tracking-[-0.025em] text-[clamp(2rem,4.5vw,48px)] tura-wordmark">
            {mod.title}
          </h1>

          <div className="mt-6 h-px w-12 bg-[color:var(--accent)]/65" />
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[color:var(--bg)] py-[clamp(3rem,7vw,6rem)]">
        <SectionMarker number={paddedIndex} label="The module" />

        <div className="relative z-10 mx-auto max-w-[var(--max-width)] px-[var(--content-pad)]">
          <div className="flex gap-16">
            {/* Main content column */}
            <div className="min-w-0 flex-1">
              {/* Pull quote — shown for all types */}
              {mod.pullQuote && (
                <figure className="mb-12 border-l-2 border-[color:var(--accent)]/60 pl-6 md:pl-8">
                  <blockquote className="font-display italic font-light text-[color:var(--fg)] leading-[1.25] tracking-[-0.015em] text-[clamp(1.4rem,2.4vw,26px)]">
                    &ldquo;{mod.pullQuote}&rdquo;
                  </blockquote>
                </figure>
              )}

              {/* ── READ / REFLECT ── */}
              {(mod.type === "read" || mod.type === "reflect") && (
                <ArticleBody
                  body={mod.body}
                  essaySlug={`${slug}-${moduleSlug}`}
                  articleUrl={moduleUrl}
                  essayTitle={mod.title}
                />
              )}

              {/* ── EXCERPT ── */}
              {mod.type === "excerpt" && (
                <>
                  <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-3)]">
                    Excerpt from &ldquo;{essayTitle}&rdquo;
                  </p>
                  {essayExcerpt && essayExcerpt.length > 0 ? (
                    <ArticleBody
                      body={essayExcerpt}
                      essaySlug={`${slug}-${moduleSlug}-excerpt`}
                      articleUrl={moduleUrl}
                      essayTitle={essayTitle}
                    />
                  ) : (
                    <p className="font-body text-[15px] text-[color:var(--fg-3)]">
                      Essay excerpt unavailable.
                    </p>
                  )}
                  {mod.essaySlug && (
                    <Link
                      href={`/withdepth/${mod.essaySlug}`}
                      className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)] hover:text-[color:var(--fg)] transition-colors cursor-pointer"
                    >
                      Read the full essay →
                    </Link>
                  )}
                </>
              )}

              {/* ── VIDEO ── */}
              {mod.type === "video" && mod.videoUrl && (
                <>
                  <ModuleVideoEmbed url={mod.videoUrl} title={mod.title} />
                  {mod.body.length > 0 && (
                    <details className="mt-8 rounded-[12px] border border-[var(--rule)] bg-[color:var(--bg-alt)]">
                      <summary className="cursor-pointer px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-2)] hover:text-[color:var(--fg)] transition-colors select-none">
                        Transcript
                      </summary>
                      <div className="px-6 pb-6 pt-2">
                        <ArticleBody
                          body={mod.body}
                          essaySlug={`${slug}-${moduleSlug}-transcript`}
                          articleUrl={moduleUrl}
                          essayTitle={mod.title}
                        />
                      </div>
                    </details>
                  )}
                </>
              )}

              {/* ── QUIZ ── */}
              {mod.type === "quiz" && (
                <>
                  {mod.body.length > 0 && (
                    <ArticleBody
                      body={mod.body}
                      essaySlug={`${slug}-${moduleSlug}-intro`}
                      articleUrl={moduleUrl}
                      essayTitle={mod.title}
                    />
                  )}
                  {mod.quiz && mod.quiz.length > 0 && (
                    <ModuleQuiz questions={mod.quiz} />
                  )}
                </>
              )}

              {/* ── REFLECT prompt ── */}
              {mod.type === "reflect" && (
                <div className="mt-10 rounded-r-[12px] border-l-2 border-[color:var(--accent)]/60 py-4 pl-6">
                  <p className="font-body text-[15px] leading-[1.75] text-[color:var(--fg-2)]">
                    This module is meant to be written with. Take ten minutes.
                  </p>
                </div>
              )}

              {/* ── Complete button ── */}
              <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-[var(--rule)] pt-8">
                <ModuleCompleteButton
                  courseSlug={slug}
                  moduleSlug={moduleSlug}
                  initialCompleted={isCompleted}
                  signedIn={!!user}
                />
              </div>

              {/* ── Prev / Next module ── */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {prevMod ? (
                  <Link
                    href={`/learn/${slug}/${prevMod.slug}`}
                    className="group glass-card block rounded-[16px] p-5 transition-all duration-500 cursor-pointer"
                  >
                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--fg-3)]">
                      <span className="text-base leading-none transition-transform group-hover:-translate-x-1">←</span>
                      <span>Previous</span>
                    </div>
                    <div className="font-display italic text-[color:var(--fg)] leading-[1.25] text-[13px]">
                      {prevMod.title}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextMod ? (
                  <Link
                    href={`/learn/${slug}/${nextMod.slug}`}
                    className="group glass-card block rounded-[16px] p-5 text-right transition-all duration-500 cursor-pointer"
                  >
                    <div className="mb-1.5 flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--fg-3)]">
                      <span>Next</span>
                      <span className="text-base leading-none transition-transform group-hover:translate-x-1">→</span>
                    </div>
                    <div className="font-display italic text-[color:var(--fg)] leading-[1.25] text-[13px]">
                      {nextMod.title}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="mt-8 flex justify-start">
                <Link
                  href={`/learn/${slug}`}
                  className="cursor-pointer rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)] px-6 py-3 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg)] transition-all hover:border-[var(--rule-strong)]"
                >
                  Back to course overview
                </Link>
              </div>
            </div>

            {/* Sidebar (lg+) */}
            <CourseProgressSidebar
              course={course}
              currentModuleSlug={moduleSlug}
              completedSlugs={completedSlugs}
              canAccess={course.tier === "free" || isMember || hasGrant}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Locked module page ───────────────────────────────────────────────────────

function LockedModulePage({
  course,
  modTitle,
}: {
  course: { slug: string; title: string };
  modTitle: string;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-[var(--content-pad)] py-[clamp(5rem,12vw,10rem)] text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--fg-3)]" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1 className="font-display italic text-[color:var(--fg)] text-[clamp(1.5rem,3vw,2rem)] mb-3">
        {modTitle}
      </h1>
      <p className="font-body text-[15px] text-[color:var(--fg-2)] max-w-[38ch] leading-[1.7] mb-8">
        This module is part of a Faction course. Join to access it — and every module across every course.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/faction"
          className="rounded-full bg-[color:var(--fg)] px-6 py-3 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)] transition-opacity hover:opacity-80 cursor-pointer"
        >
          Join the Faction →
        </Link>
        <Link
          href={`/learn/${course.slug}`}
          className="rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)] px-6 py-3 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg)] transition-all hover:border-[var(--rule-strong)] cursor-pointer"
        >
          Back to {course.title}
        </Link>
      </div>
    </main>
  );
}
