"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Essay } from "@/lib/essays";

type Props = {
  essay: Essay;
  featured?: boolean;
};

export function EssayCard({ essay, featured = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
    >
      <Link
        href={`/withdepth/${essay.slug}`}
        id={essay.slug}
        className={
          "group gloss-card relative block overflow-hidden rounded-[20px] cursor-pointer " +
          (featured
            ? "p-[clamp(2rem,4vw,52px)]"
            : "p-[clamp(1.5rem,3vw,32px)]")
        }
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[15%] -top-[40%] h-[180%] w-[140%] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 55%)",
          }}
        />

        {featured && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-15%] top-[-15%] h-[260px] w-[260px] rounded-full blur-[60px]"
            style={{ background: "color-mix(in oklab, var(--accent) 14%, transparent)" }}
          />
        )}

        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            {featured && (
              <span className="inline-block rounded-full border border-[var(--accent)] bg-[var(--accent)] px-2.5 py-1 font-heading text-[8.5px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ivory)]">
                Featured
              </span>
            )}
            <span className="font-mono text-[9.5px] tracking-[0.08em] text-[color:var(--fg-3)]">
              {essay.issue}
            </span>
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--rule-strong)]" />
            <span className="font-mono text-[9.5px] tracking-[0.06em] text-[color:var(--fg-3)]">
              {essay.date}
            </span>
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--rule-strong)]" />
            <span className="font-mono text-[9.5px] tracking-[0.06em] text-[color:var(--fg-3)]">
              {essay.read}
            </span>
          </div>

          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <h3
                className={
                  "mb-3 font-display italic text-[color:var(--fg)] leading-[1.15] tracking-[-0.02em] " +
                  (featured
                    ? "text-[clamp(1.8rem,3.4vw,40px)]"
                    : "text-[clamp(1.375rem,2.5vw,28px)]")
                }
              >
                {essay.title}
              </h3>
              <p
                className={
                  "mb-5 max-w-[640px] font-body leading-[1.78] text-[color:var(--fg-2)] " +
                  (featured ? "text-[15.5px]" : "text-[14px]")
                }
              >
                {essay.excerpt}
              </p>
              <span className="inline-block rounded-full border border-[var(--rule-strong)] bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-3 py-1.5 font-heading text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--fg)]">
                {essay.tag}
              </span>
            </div>
            <span className="shrink-0 pt-1 text-lg text-[color:var(--fg-3)] transition-all group-hover:translate-x-1 group-hover:text-[color:var(--fg)]">
              →
            </span>
          </div>

          {featured && (
            <div className="mt-7 flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              <span className="block h-px w-10 bg-[var(--rule-strong)]" />
              <span>Read the essay</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
