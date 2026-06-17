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
  /** When true, image renders on the left; text on the right. */
  flip?: boolean;
  index?: number;
};

export function CourseHorizontalCard({
  course,
  isMember,
  hasGrant,
  completedCount,
  flip = false,
  index = 0,
}: Props) {
  const accessible = course.tier === "free" || isMember || hasGrant;
  const href = `/learn/${course.slug}`;
  const ctaLabel = !accessible
    ? "Faction access →"
    : completedCount > 0
    ? "Continue →"
    : "Begin →";

  return (
    <motion.div
      initial={{ opacity: 0, x: flip ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
      className="py-12"
    >
      <Link
        href={href}
        className={`group grid grid-cols-1 gap-8 cursor-pointer lg:gap-12 ${
          course.image
            ? flip
              ? "lg:grid-cols-[380px_1fr]"
              : "lg:grid-cols-[1fr_380px]"
            : ""
        }`}
      >
        {/* Text side — order depends on flip + image presence */}
        <div className={`flex flex-col justify-center ${flip && course.image ? "lg:order-2" : ""}`}>
          {/* Tags */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-[var(--rule)] bg-[color:var(--fg)] px-2.5 py-1 font-heading text-[8px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)]">
              {course.tag}
            </span>
            {course.tier === "member" && !accessible && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent-tint)] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
                <LockIcon /> Faction
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display italic font-light text-[color:var(--fg)] leading-[1.15] tracking-[-0.02em] text-[clamp(1.5rem,2.4vw,2rem)] mb-4">
            {course.title}
          </h3>

          {/* Excerpt */}
          <p className="font-body text-[15px] leading-[1.75] text-[color:var(--fg-2)] mb-5 max-w-[52ch]">
            {course.excerpt}
          </p>

          {/* Outcomes (first 2) */}
          {course.outcomes.length > 0 && (
            <ul className="mb-5 space-y-1.5">
              {course.outcomes.slice(0, 2).map((o, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-[13px] text-[color:var(--fg-3)]">
                  <span className="mt-[6px] block h-[4px] w-[4px] shrink-0 rounded-full bg-[color:var(--accent)]/70" />
                  {o}
                </li>
              ))}
            </ul>
          )}

          {/* Meta */}
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-3)]">
            {course.duration} · {course.moduleCount} modules
          </div>

          {/* Progress */}
          {completedCount > 0 && (
            <CourseProgressBar completed={completedCount} total={course.moduleCount} className="mb-4 max-w-[220px]" />
          )}

          {/* CTA */}
          <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)] transition-colors group-hover:text-[color:var(--fg)]">
            {ctaLabel}
          </span>
        </div>

        {/* Image side */}
        {course.image && (
          <div className={`relative h-[240px] overflow-hidden rounded-[8px] lg:h-[300px] ${flip ? "lg:order-1" : ""}`}>
            <Image
              src={course.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 380px"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* Lock overlay for non-members */}
            {!accessible && (
              <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--bg)]/60 backdrop-blur-[2px]">
                <span className="flex items-center gap-2 rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--bg-alt)] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--fg-2)]">
                  <LockIcon /> Faction only
                </span>
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

function LockIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
