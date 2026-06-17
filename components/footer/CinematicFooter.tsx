"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Marquee } from "@/components/effects/Marquee";

export function CinematicFooter() {
  const pathname = usePathname();
  // PunchUp store owns its own light-mode footer.
  if (pathname?.startsWith("/store")) return null;
  return <CinematicFooterInner />;
}

function CinematicFooterInner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const giantY = useTransform(scrollYProgress, [0, 1], ["8vh", "-2vh"]);
  const giantScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.05]);
  const giantOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.5, 1]);
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.55, 1],
  );

  return (
    <footer
      ref={ref}
      className="topo-overlay relative overflow-hidden border-t border-[var(--rule)] bg-[var(--bg)]"
    >
      <div className="relative z-10 border-y border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg-alt)_85%,transparent)] py-4 backdrop-blur">
        <Marquee
          items={[
            "Pro-human, anti-extractive",
            "Warm toward people, sharp toward systems",
            "Definition is limitation",
            "We show our work",
            "Preservation over production",
          ]}
          divider="✦"
        />
      </div>

      <motion.div
        style={{ opacity: auroraOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 16%, transparent) 0%, color-mix(in oklab, var(--accent) 4%, transparent) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: giantY, scale: giantScale, opacity: giantOpacity }}
        aria-hidden
        className="pointer-events-none absolute -bottom-[3vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-display italic font-semibold leading-[0.8] tracking-[-0.05em] text-transparent text-[24vw]"
      >
        <span
          className="bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(180deg, color-mix(in oklab, var(--fg) 14%, transparent) 0%, transparent 100%)",
          }}
        >
          Divine Ipseity
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[var(--max-width)] px-[var(--content-pad)] pb-12 pt-24">
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.32em] text-[color:var(--fg-3)]">
            <span className="block h-px w-8 bg-[var(--accent)]" />
            The closing argument
          </div>
          <h2 className="max-w-[18ch] font-display italic font-semibold text-[color:var(--fg)] leading-[1.04] tracking-[-0.035em] text-[clamp(2.5rem,6vw,5rem)]">
            You were not made to be managed.
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/faction" className="btn-primary">
              Begin
            </Link>
            <Link href="/withdepth" className="btn-ghost">
              The Writing
            </Link>
          </div>
        </div>

        <div className="mb-10 h-px bg-[var(--rule)]" />

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="font-display italic text-[26px] tracking-[-0.01em] text-[color:var(--fg-2)] transition-colors hover:text-[color:var(--fg)]"
            >
              Divine Ipseity
            </Link>
            <p className="mt-3 font-display italic text-sm tracking-[-0.01em] text-[color:var(--fg-3)]">
              Definition is limitation.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6">
            {[
              { href: "/", label: "The Work" },
              { href: "/withdepth", label: "WithDepth" },
              { href: "/learn", label: "Learn" },
              { href: "/faction/forum", label: "The Faction" },
              { href: "/store", label: "Store" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-heading text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)] transition-colors hover:text-[color:var(--fg)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 font-mono text-[9px] uppercase tracking-[0.06em] text-[color:var(--fg-3)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 Divine Ipseity</span>
          <span>For the people inheriting a broken system.</span>
        </div>
      </div>
    </footer>
  );
}
