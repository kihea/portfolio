"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { SectionMarker } from "@/components/effects/SectionMarker";

export function AboutTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section
      ref={ref}
      id="why"
      className="topo-overlay relative overflow-hidden bg-[var(--bg)] py-[clamp(4rem,9vw,8rem)]"
    >
      <SectionMarker number="01" label="The Why" />

      <div className="relative z-10 mx-auto grid max-w-[var(--max-width)] grid-cols-1 items-center gap-[clamp(2rem,5vw,4rem)] px-[var(--content-pad)] lg:grid-cols-[44%_1fr]">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[var(--rule)] shadow-[var(--card-shadow)] lg:aspect-auto lg:min-h-[520px]">
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="absolute inset-0"
          >
            <Image
              src="/images/galina-nelyubova-remember-us.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
              style={{ filter: "saturate(0.85)" }}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,7,6,0.45)_100%)]" />
          <figcaption className="absolute bottom-[18px] left-[22px] rounded-full border border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] px-3 py-1.5 font-mono text-[9px] tracking-[0.06em] text-[color:var(--fg-3)] backdrop-blur">
            Galina Nelyubova, “Remember Us”
          </figcaption>
        </figure>

        <div className="gloss-panel rounded-[28px] p-[clamp(2rem,4vw,48px)]">
          <div className="mb-5 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
            <span className="block h-px w-8 bg-[var(--accent)]" />
            <span>The Why</span>
          </div>
          <h2 className="mb-6 font-display italic font-semibold text-[color:var(--fg)] leading-[1.05] tracking-[-0.03em] text-[clamp(2rem,4vw,48px)]">
            Built for those the
            <br />
            system forgot to count.
          </h2>
          <div className="mb-6 h-px w-10 bg-gradient-to-r from-[var(--accent)] to-transparent" />
          <div className="max-w-[52ch] space-y-4 font-body text-[15px] leading-[1.78] text-[color:var(--fg-2)]">
            <p>
              The systems around you were not built with you in mind. They were
              built for a version of you that is useful and quiet.
            </p>
            <p className="text-[color:var(--fg)]">
              Here, your complexity is the point.
            </p>
          </div>
          <Link href="/withdepth/lead-them-to-water" className="btn-ghost btn-sm mt-7">
            Read the full manifesto →
          </Link>
        </div>
      </div>
    </section>
  );
}
