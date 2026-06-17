"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Course } from "@/lib/courses";
import { CourseProgressBar } from "./CourseProgressBar";

type Props = {
  course: Course;
  isMember: boolean;
  hasGrant: boolean;
  completedCount: number;
};

export function FeaturedCourseHero({ course, isMember, hasGrant, completedCount }: Props) {
  const accessible = course.tier === "free" || isMember || hasGrant;
  const href = `/learn/${course.slug}`;
  const ctaLabel = !accessible
    ? "Faction access"
    : completedCount > 0
    ? "Continue the course"
    : "Begin the course";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="relative overflow-hidden border-b border-[var(--rule)] bg-[color:var(--bg)] px-[var(--content-pad)] py-[clamp(3rem,7vw,5rem)]"
    >
      {/* Accent glow */}
      <div className="pointer-events-none absolute -right-[10%] -top-[20%] h-[400px] w-[400px] rounded-full bg-[color:var(--accent)]/6 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-[var(--max-width)]">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
          <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
          Featured course
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-center lg:gap-16">
          {/* Text */}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full border border-[var(--rule)] bg-[color:var(--fg)] px-3 py-1.5 font-heading text-[8px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)]">
                {course.tag}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                {course.duration} · {course.moduleCount} modules
              </span>
            </div>

            <h2 className="font-display italic font-light text-[color:var(--fg)] leading-[1.06] tracking-[-0.025em] text-[clamp(2rem,4vw,3rem)] mb-5 tura-wordmark">
              {course.title}
            </h2>

            <p className="font-body text-[16px] leading-[1.78] text-[color:var(--fg-2)] mb-6 max-w-[54ch]">
              {course.excerpt}
            </p>

            {/* Outcomes */}
            {course.outcomes.length > 0 && (
              <ul className="mb-7 space-y-2">
                {course.outcomes.slice(0, 3).map((o, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-body text-[13.5px] text-[color:var(--fg-2)]">
                    <span className="mt-[7px] block h-[4px] w-[4px] shrink-0 rounded-full bg-[color:var(--accent)]/70" />
                    {o}
                  </li>
                ))}
              </ul>
            )}

            {completedCount > 0 && (
              <CourseProgressBar
                completed={completedCount}
                total={course.moduleCount}
                className="mb-6 max-w-[260px]"
              />
            )}

            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--fg)] px-6 py-3 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)] transition-opacity hover:opacity-80 cursor-pointer"
            >
              {ctaLabel} →
            </Link>
          </div>

          {/* Image or module count display */}
          {course.image ? (
            <div className="relative h-[300px] overflow-hidden rounded-[8px] border border-[var(--rule)] lg:h-[360px]">
              <Image
                src={course.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-top"
                priority
              />
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-[8px] border border-[var(--rule)] bg-[color:var(--bg-alt)] lg:h-[280px]">
              <span
                aria-hidden
                className="select-none font-display italic text-[color:var(--accent)]/20 leading-none text-[clamp(5rem,12vw,9rem)]"
              >
                {course.moduleCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
