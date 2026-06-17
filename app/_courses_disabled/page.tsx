import type { Metadata } from "next";
import { courses } from "@/lib/courses";
import { createClient } from "@/lib/supabase/server";
import { CourseSearch } from "@/components/course/CourseSearch";

export const metadata: Metadata = {
  title: "The Long Study — Divine Ipseity",
};

type Props = { searchParams: Promise<{ tag?: string }> };

export default async function LearnPage({ searchParams }: Props) {
  const { tag } = await searchParams;

  // Filter courses by tag server-side (for shareable URL state)
  const filtered = tag
    ? courses.filter((c) => c.tag === tag)
    : courses;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Parallel fetch: membership + completions + grants
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
          .select("course_slug, module_slug")
          .eq("user_id", user.id)
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("course_access_grants")
          .select("course_slug")
          .eq("user_id", user.id)
      : Promise.resolve({ data: null }),
  ]);

  const isMember = Boolean(membershipRes.data);
  const grantedSlugs = (grantsRes.data ?? []).map((g) => g.course_slug);

  // Derive per-course completed module counts
  const completedCounts: Record<string, number> = {};
  for (const row of completionsRes.data ?? []) {
    completedCounts[row.course_slug] = (completedCounts[row.course_slug] ?? 0) + 1;
  }

  return (
    <main>
      {/* ── Masthead ────────────────────────────────────────────────────── */}
      <header className="overflow-hidden border-b border-[var(--rule)] px-[var(--content-pad)] pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[color:var(--accent)]/6 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[var(--max-width)]">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
            <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--fg-3)]/60" />
            A Divine Ipseity sub-brand · Vol. 01
          </div>

          {/* Headline */}
          <h1 className="font-display italic font-light text-[color:var(--fg)] leading-[1.04] tracking-[-0.025em] text-[clamp(2.5rem,6vw,64px)] tura-wordmark mb-6">
            The Long Study
          </h1>

          <p className="font-body text-[16px] leading-[1.78] text-[color:var(--fg-2)] max-w-[52ch] mb-7 md:text-[17px]">
            Structured courses on systems, identity, and community — written to be read once and thought about twice.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
            <span>{courses.length} courses</span>
            <Dot />
            <span>Free for Readers</span>
            <Dot />
            <span>All courses for Faction</span>
          </div>

          {/* Search + tag filter + course grid (client component) */}
          <CourseSearch
            courses={filtered}
            isMember={isMember}
            grantedSlugs={grantedSlugs}
            completedCounts={completedCounts}
            activeTag={tag ?? null}
          />
        </div>
      </header>
    </main>
  );
}

function Dot() {
  return (
    <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--fg-3)]/60" />
  );
}
