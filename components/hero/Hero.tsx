"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WordPullUp } from "./WordPullUp";
import { ShaderAnimation } from "./TopographyShader";

const headlineWords = ["You", "were", "not", "made", "to", "be", "managed."];
const ENTRY_EASE = [0.19, 1, 0.22, 1] as const;

export function Hero() {
  return (
    <section
      id="origin"
      className="h-screen overflow-hidden border-b border-[var(--rule)]"
      aria-label="Hero"
    >
      <motion.div  
        aria-hidden
        initial={{ opacity: 0.5, backgroundPositionX: "50%" }}
        animate={{ opacity: 0.7, backgroundPositionX: "51%" }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: ["easeIn", "easeOut"], type: "tween", damping: 600 }}
        className="pointer-events-none absolute inset-0 opacity-[100%] bg-blend-multiply"
        style={{
          backgroundImage: "url('/images/topographic-map.jpg')",
          backgroundSize: "cover",

        }}
      />

      {/* Aurora — warm accent bloom behind the left column */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8%] top-[-1%] h-[100vh] w-[60vw] rounded-full"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,color-mix(in_oklab,var(--accent)_18%,transparent)_0%,transparent_60%)] blur-[80px]" />
      </div>

      

      {/* Content */}
      <div className="relative mx-auto grid max-w-[var(--max-width)] grid-cols-1 items-start gap-[clamp(2rem,4vw,3.5rem)] px-[var(--content-pad)] pb-[clamp(3.5rem,7vw,6rem)] pt-[clamp(6.5rem,9vw,9rem)] lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: ENTRY_EASE }}
            className="mb-2 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.28em] text-[color:var(--bg-inverse)]"
          >
            <span className="block h-px w-8 bg-[var(--accent)]" />
            <span>Ipseity — the state of being oneself</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease: ENTRY_EASE }}
            className="font-display font-stretch-extra-expanded italic font-bold text-[color:var(--bg-inverse)] leading-[0.92] tracking-[-0.035em] text-[clamp(3rem,7.4vw,6rem)] tura-wordmark"
          >
            Divine
            Ipseity
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: ENTRY_EASE }}
            className="mt-6 max-w-[20ch]"
          >
            <WordPullUp
              words={headlineWords}
              className="font-wrap italic font-medium text-[color:var(--bg-inverse)] leading-[1.06] tracking-[-0.025em] text-[clamp(1.5rem,2.6vw,2.1rem)]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: ENTRY_EASE }}
            className="mt-6 max-w-[46ch] font-body text-[16px] leading-[1.72] text-[color:var(--fg-3)] md:text-[17px]"
          >
            A community for those who remember what they are, beneath what
            they have been told to be. We consent to our own diminishment for
            as long as we mistake the system for the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: ENTRY_EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/faction" className="btn-primary">
              Begin
            </Link>
            <Link href="/withdepth" className="btn-ghost text-[color:var(--bg-inverse)]">
              The Writing
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4, ease: ENTRY_EASE }}
            className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]"
          >
            <span className="block h-px w-10 bg-[var(--rule-strong)]" />
            <span>Vol. 01 · 2026 · A living document</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
