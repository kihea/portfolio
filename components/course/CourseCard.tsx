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
  index?: number;
};

export function CourseCard({ course, isMember, hasGrant, completedCount, index = 0 }: Props) {
  const accessible = course.tier === "free" || isMember || hasGrant;
  const href = `/learn/${course.slug}`;

  const ctaLabel = !accessible
    ? "Faction access →"
    : completedCount > 0
    ? "Continue →"
    : "Begin →";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1], delay: index * 0.07 }}
    >
      <Link
        href={href}
        className="group glass-card relative flex flex-col overflow-hidden rounded-[20px] cursor-pointer h-full"
      >
        {/* Optional image */}
        {course.image && (
          <div className="relative h-[160px] w-full shrink-0 overflow-hidden">
            <Image
              src={course.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[color:var(--bg)]/70" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-[clamp(1.25rem,2.5vw,1.75rem)]">
          {/* Tags row */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
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
          <h3 className="font-display italic font-light text-[color:var(--fg)] leading-[1.18] tracking-[-0.015em] text-[clamp(1.1rem,1.8vw,1.3rem)] mb-3">
            {course.title}
          </h3>

          {/* Excerpt */}
          <p className="font-body text-[13.5px] leading-[1.7] text-[color:var(--fg-2)] line-clamp-2 mb-4 flex-1">
            {course.excerpt}
          </p>

          {/* Meta */}
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-3)]">
            {course.duration} · {course.moduleCount} modules
          </div>

          {/* Progress bar */}
          {completedCount > 0 && (
            <CourseProgressBar
              completed={completedCount}
              total={course.moduleCount}
              className="mb-4"
            />
          )}

          {/* CTA */}
          <span className="mt-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)] transition-colors group-hover:text-[color:var(--fg)]">
            {ctaLabel}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function LockIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
