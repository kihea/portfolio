import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { courses, getCourse } from "@/lib/courses";
import { essays } from "@/lib/essays";
import { createClient } from "@/lib/supabase/server";
import { SectionMarker } from "@/components/effects/SectionMarker";
import { ShareDialog } from "@/components/article/ShareDialog";
import { ModuleList } from "@/components/course/ModuleList";
import { CourseProgressBar } from "@/components/course/CourseProgressBar";
import { FactionUpsell } from "@/components/course/FactionUpsell";
import { EssayCard } from "@/components/sections/EssayCard";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found — Divine Ipseity" };
  return {
    title: `${course.title} — The Long Study`,
    description: course.excerpt,
    openGraph: {
      title: course.title,
      description: course.excerpt,
      type: "article",
      ...(course.image ? { images: [course.image] } : {}),
    },
  };
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [membershipRes, completionsRes, grantsRes] = await Promise.all([
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
  ]);

  const isMember = Boolean(membershipRes.data);
  const hasGrant = Boolean(grantsRes.data);
  const canAccess = course.tier === "free" || isMember || hasGrant;
  const completedSlugs = (completionsRes.data ?? []).map((r) => r.module_slug);

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const courseUrl = `${proto}://${host}/learn/${slug}`;

  // Related essays: same tag, up to 2
  const relatedEssays = essays.filter((e) => e.tag === course.tag).slice(0, 2);

  return (
    <main className="relative">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="topo-overlay overflow-hidden border-b border-[var(--rule)] px-[var(--content-pad)] pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[color:var(--accent)]/8 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[820px]">
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
            <Link
              href="/learn"
              className="text-[color:var(--accent)] transition-colors hover:text-[color:var(--fg)] cursor-pointer"
            >
              ← The Long Study
            </Link>
            <Dot />
            <span>{course.duration}</span>
            <Dot />
            <span>{course.moduleCount} modules</span>
          </div>

          {/* Tag + tier */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-[var(--rule)] bg-[color:var(--fg)] px-3 py-1.5 font-heading text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)]">
              {course.tag}
            </span>
            {course.tier === "member" && !isMember && !hasGrant && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent-tint)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
                <LockIcon /> Faction
              </span>
            )}
          </div>

          {/* Title / image layout */}
          <div className={course.image ? "grid grid-cols-1 gap-8 md:grid-cols-[1fr_240px] md:items-start" : undefined}>
            <div>
              <h1 className="font-display italic font-light text-[color:var(--fg)] leading-[1.04] tracking-[-0.025em] text-[clamp(2.25rem,5vw,56px)] tura-wordmark">
                {course.title}
              </h1>

              <p className="mt-6 font-body text-[16px] leading-[1.78] text-[color:var(--fg-2)] md:text-[17px]">
                {course.excerpt}
              </p>

              {/* Progress */}
              {completedSlugs.length > 0 && (
                <CourseProgressBar
                  completed={completedSlugs.length}
                  total={course.moduleCount}
                  className="mt-6 max-w-[240px]"
                />
              )}

              {/* Toolbar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ShareDialog title={course.title} url={courseUrl} />
                {canAccess ? (
                  <Link
                    href={`/learn/${slug}/${course.modules[0]?.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--fg)] px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)] transition-opacity hover:opacity-80 cursor-pointer"
                  >
                    {completedSlugs.length > 0 ? "Continue →" : "Begin →"}
                  </Link>
                ) : (
                  <Link
                    href="/faction"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent-tint)] px-5 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)] transition-opacity hover:opacity-80 cursor-pointer"
                  >
                    Join the Faction →
                  </Link>
                )}
              </div>
            </div>

            {course.image && (
              <div className="relative h-[260px] overflow-hidden rounded-[4px] border border-[var(--rule)] md:h-[320px] md:w-[240px] md:self-start">
                <Image
                  src={course.image}
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

      {/* ── Outcomes ─────────────────────────────────────────────────────── */}
      {course.outcomes.length > 0 && (
        <section className="relative overflow-hidden bg-[color:var(--bg-alt)] py-[clamp(3rem,6vw,5rem)]">
          <SectionMarker number="01" label="The outcomes" />

          <div className="relative z-10 mx-auto max-w-[760px] px-[var(--content-pad)]">
            <ul className="space-y-3">
              {course.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-[15px] leading-[1.7] text-[color:var(--fg-2)]">
                  <span className="mt-[8px] block h-[4px] w-[4px] shrink-0 rounded-full bg-[color:var(--accent)]/70" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Module list ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[color:var(--bg)] py-[clamp(3rem,6vw,5rem)]">
        <SectionMarker number="02" label="The modules" />

        <div className="relative z-10 mx-auto max-w-[760px] px-[var(--content-pad)]">
          <ModuleList
            modules={course.modules}
            courseSlug={slug}
            canAccess={canAccess}
            completedSlugs={completedSlugs}
          />
        </div>
      </section>

      {/* ── Faction upsell (non-members, member course) ───────────────────── */}
      {course.tier === "member" && !isMember && !hasGrant && <FactionUpsell />}

      {/* ── Related essays ────────────────────────────────────────────────── */}
      {relatedEssays.length > 0 && (
        <section className="border-t border-[var(--rule)] bg-[color:var(--bg)] py-[clamp(3rem,6vw,5rem)]">
          <div className="mx-auto max-w-[var(--max-width)] px-[var(--content-pad)]">
            <div className="mb-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--fg-3)]/60" />
              From the writing
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {relatedEssays.map((essay) => (
                <EssayCard key={essay.slug} essay={essay} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Dot() {
  return <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--fg-3)]/60" />;
}

function LockIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
