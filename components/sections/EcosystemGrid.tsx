"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionMarker } from "@/components/effects/SectionMarker";

type Node = {
  num: string;
  name: string;
  tagline: string;
  body: string;
  href: string;
  external?: boolean;
};

const nodes: Node[] = [
  {
    num: "01",
    name: "WithDepth",
    tagline: "long-form essays + video",
    body: "The reading and watching arm. Sources cited, work shown.",
    href: "/withdepth",
  },
  {
    num: "02",
    name: "PunchUp",
    tagline: "apparel · the wearable argument",
    body: "Garments that say something specific. Punch up, never down.",
    href: "/store",
  },
  {
    num: "03",
    name: "Faction of Truth",
    tagline: "community · membership",
    body: "A room for the people who refuse manufactured loneliness.",
    href: "/faction",
  },
  {
    num: "04",
    name: "Systematic Sins",
    tagline: "named criticism · recurring",
    body: "Names what is being done to us, by whom, and at what cost. Without euphemism.",
    href: "/withdepth",
  },
];

export function EcosystemGrid() {
  return (
    <section
      id="ecosystem"
      className="topo-overlay relative overflow-hidden bg-[var(--bg)] py-[clamp(4rem,9vw,8rem)]"
    >
      <SectionMarker number="03" label="The Ecosystem" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -bottom-[10%] h-[560px] w-[560px] rounded-full blur-[100px]"
        style={{ background: "color-mix(in oklab, var(--accent) 10%, transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--max-width)] px-[var(--content-pad)]">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              <span className="block h-px w-8 bg-[var(--rule-strong)]" />
              <span>The Ecosystem</span>
            </div>
            <h2 className="max-w-[20ch] font-display italic font-light text-[color:var(--fg)] leading-[1.05] tracking-[-0.025em] text-[clamp(2.25rem,4.5vw,52px)]">
              Four arms of one&nbsp;argument.
            </h2>
          </div>
          <p className="max-w-[44ch] font-body text-[15px] leading-[1.8] text-[color:var(--fg-2)]">
            One argument carried four ways. Read it, wear it, gather around it,
            or name what stands in its way.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {nodes.map((n, i) => (
            <motion.div
              key={n.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.06,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <Link
                href={n.href}
                className="group gloss-card relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] p-[clamp(1.5rem,3vw,34px)] cursor-pointer"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-[20%] -top-[40%] h-[160%] w-[140%] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 30%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 55%)",
                  }}
                />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] tracking-[0.12em] text-[var(--accent)]">
                      .{n.num}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                      Node
                    </span>
                  </div>

                  <h3 className="mb-2 font-display italic text-[color:var(--fg)] leading-[1.05] tracking-[-0.02em] text-[clamp(1.75rem,3vw,32px)]">
                    {n.name}
                  </h3>
                  <p className="mb-4 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                    {n.tagline}
                  </p>

                  <div className="mb-5 h-px w-12 bg-[var(--rule-strong)]" />

                  <p className="max-w-[44ch] font-body text-[14.5px] leading-[1.78] text-[color:var(--fg-2)]">
                    {n.body}
                  </p>
                </div>

                <div className="relative mt-7 flex items-center justify-between">
                  <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg)]">
                    Enter
                  </span>
                  <span className="text-lg text-[color:var(--fg-3)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--fg)]">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
