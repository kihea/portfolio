"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionMarker } from "@/components/effects/SectionMarker";

export function Mission() {
  return (
    <section
      id="mission"
      className="topo-overlay relative overflow-hidden bg-[var(--bg)] py-[clamp(4rem,9vw,8rem)]"
    >
      <SectionMarker number="03" label="The Mission" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -bottom-[10%] h-[560px] w-[560px] rounded-full blur-[100px]"
        style={{ background: "color-mix(in oklab, var(--accent) 10%, transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--max-width)] px-[var(--content-pad)]">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              <span className="block h-px w-8 bg-[var(--rule-strong)]" />
              <span>The Mission</span>
            </div>
            <h2 className="max-w-[18ch] font-display italic font-light text-[color:var(--fg)] leading-[1.05] tracking-[-0.025em] text-[clamp(2.25rem,4.5vw,52px)]">
              We are here to keep you&nbsp;yourself.
            </h2>
          </div>
          <p className="max-w-[42ch] font-body text-[15px] leading-[1.8] text-[color:var(--fg-2)]">
            One purpose holds all of it: the person kept whole while the system
            argues otherwise.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="gloss-panel relative overflow-hidden rounded-[28px] p-[clamp(2rem,4vw,52px)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[20%] -top-[40%] h-[200%] w-[140%] opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 55%)",
            }}
          />
          <div className="relative max-w-[64ch] space-y-5 font-body text-[16px] leading-[1.85] text-[color:var(--fg-2)] md:text-[17px]">
            <p>
              Divine Ipseity is a project against being rounded down. The systems
              we live inside prefer a smaller version of you, one that stays
              useful and quiet, and they are patient about getting it.
            </p>
            <p className="text-[color:var(--fg)]">
              So we publish the long version and show our work: the sources
              named, the machinery drawn plainly. The aim is to hand back the
              room to think at all.
            </p>
          </div>

          <div className="relative mt-9 flex flex-wrap items-center gap-3">
            <Link href="/writing" className="btn-primary">
              Read the long version
            </Link>
            <Link href="/portfolio" className="btn-ghost">
              See the work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
