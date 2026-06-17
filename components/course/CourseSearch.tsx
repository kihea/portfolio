"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Course, CourseTag } from "@/lib/courses";
import { CourseCard } from "./CourseCard";
import { CourseHorizontalCard } from "./CourseHorizontalCard";
import { FeaturedCourseHero } from "./FeaturedCourseHero";
import { SectionMarker } from "@/components/effects/SectionMarker";

const ALL_TAGS: CourseTag[] = ["Systems", "Philosophy", "Identity", "Community", "Founding"];

type CompletedCounts = Record<string, number>;
type GrantedSlugs = Set<string>;

type Props = {
  courses: Course[];
  isMember: boolean;
  grantedSlugs: string[];   // serialized from server (Set not serializable)
  completedCounts: CompletedCounts;
  activeTag: string | null;
};

export function CourseSearch({
  courses,
  isMember,
  grantedSlugs: grantedSlugsList,
  completedCounts,
  activeTag,
}: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const grantedSlugs: GrantedSlugs = useMemo(() => new Set(grantedSlugsList), [grantedSlugsList]);

  // Filter courses by query (title + excerpt + tag)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.excerpt.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q),
    );
  }, [query, courses]);

  const featuredCourse = filtered.find((c) => c.featured && c.tier === "free");
  const freeCourses = filtered.filter((c) => c.tier === "free" && !c.featured);
  const memberCourses = filtered.filter((c) => c.tier === "member");

  const handleTagClick = (tag: CourseTag | null) => {
    const url = tag ? `/learn?tag=${tag}` : "/learn";
    router.push(url);
  };

  return (
    <div>
      {/* Search + tag filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Text search */}
        <div className="relative max-w-[340px] flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--fg-3)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)] py-2.5 pl-9 pr-4 font-mono text-[11px] text-[color:var(--fg)] placeholder:text-[color:var(--fg-3)] outline-none transition-colors focus:border-[var(--rule-strong)]"
          />
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2">
          <TagChip
            label="All"
            active={!activeTag}
            onClick={() => handleTagClick(null)}
          />
          {ALL_TAGS.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => handleTagClick(tag)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 font-body text-[15px] text-[color:var(--fg-3)]">
          No courses match &ldquo;{query}&rdquo;.
        </p>
      )}

      {/* Featured course hero — only shown when not searching */}
      {!query && featuredCourse && (
        <div className="-mx-[var(--content-pad)] mt-12">
          <FeaturedCourseHero
            course={featuredCourse}
            isMember={isMember}
            hasGrant={grantedSlugs.has(featuredCourse.slug)}
            completedCount={completedCounts[featuredCourse.slug] ?? 0}
          />
        </div>
      )}

      {/* Free courses — 3-column grid */}
      {(query ? filtered.filter((c) => c.tier === "free") : freeCourses).length > 0 && (
        <section className="mt-16">
          <SectionMarker number="01" label="Free courses" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(query ? filtered.filter((c) => c.tier === "free") : freeCourses).map((course, i) => (
              <CourseCard
                key={course.slug}
                course={course}
                isMember={isMember}
                hasGrant={grantedSlugs.has(course.slug)}
                completedCount={completedCounts[course.slug] ?? 0}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* Member courses — horizontal alternating */}
      {(query ? filtered.filter((c) => c.tier === "member") : memberCourses).length > 0 && (
        <section className="mt-20">
          <SectionMarker number="02" label="Faction courses" />
          <div className="mt-8 divide-y divide-[var(--rule)]">
            {(query ? filtered.filter((c) => c.tier === "member") : memberCourses).map(
              (course, i) => (
                <CourseHorizontalCard
                  key={course.slug}
                  course={course}
                  isMember={isMember}
                  hasGrant={grantedSlugs.has(course.slug)}
                  completedCount={completedCounts[course.slug] ?? 0}
                  flip={i % 2 === 1}
                  index={i}
                />
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
        active
          ? "border-[color:var(--fg)] bg-[color:var(--fg)] text-[color:var(--bg)]"
          : "border-[var(--rule)] bg-[color:var(--bg-alt)] text-[color:var(--fg-2)] hover:border-[var(--rule-strong)] hover:text-[color:var(--fg)]"
      }`}
    >
      {label}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
