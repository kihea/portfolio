"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const marqueePhrases = [
  "preservation of humanity",
  "vessels of ideation",
  "sharp toward systems",
  "definition is limitation",
  "we show our work",
  "the work of becoming",
];

type Phase = "showing" | "wiping" | "done";

// How much wheel/touch delta to require before we treat as a "real" scroll intent.
const SCROLL_INTENT_DELTA = 8;
// Wait this many ms after mount before listening — prevents stray pre-paint events.
const ARM_DELAY_MS = 350;

export function IntroOverlay() {
  // Render the intro by default — even during SSR — so it covers the page on
  // first paint. We only flip to "wiping" once the user makes a real scroll
  // gesture, and to "done" after the curtain animation finishes.
  const [phase, setPhase] = useState<Phase>("showing");
  const triggered = useRef(false);
  const armed = useRef(false);
  const accumulatedTouch = useRef(0);
  const touchStartY = useRef<number | null>(null);

  // Lock body scroll for the lifetime of "showing".
  useEffect(() => {
    if (phase !== "showing") return;
    if (typeof window === "undefined") return;

    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overscrollBehavior = "none";
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
      document.documentElement.style.overscrollBehavior = prevOverscroll;
    };
  }, [phase]);

  // Listen for real scroll intent. Arms after a short delay so we don't catch
  // any wheel events queued during page load.
  useEffect(() => {
    if (phase !== "showing") return;
    if (typeof window === "undefined") return;

    const armTimer = window.setTimeout(() => {
      armed.current = true;
    }, ARM_DELAY_MS);

    const trigger = () => {
      if (!armed.current) return;
      if (triggered.current) return;
      triggered.current = true;
      // Re-enable scroll a beat into the wipe.
      window.setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.overscrollBehavior = "";
      }, 200);
      setPhase("wiping");
    };

    const onWheel = (e: WheelEvent) => {
      if (!armed.current) return;
      // Require a meaningful wheel — drop trackpad jitter.
      if (Math.abs(e.deltaY) < SCROLL_INTENT_DELTA) return;
      // Only dismiss on downward intent.
      if (e.deltaY <= 0) return;
      trigger();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
      accumulatedTouch.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!armed.current) return;
      const startY = touchStartY.current;
      if (startY == null) return;
      const currY = e.touches[0]?.clientY ?? startY;
      // dy positive when finger moves UP (intent to scroll down)
      const dy = startY - currY;
      if (dy > 28) trigger();
    };

    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === "End" ||
        e.key === " " ||
        e.key === "Spacebar" ||
        e.key === "Enter"
      ) {
        trigger();
      }
    };

    // Fallback: if the user manages to scroll the document anyway, dismiss.
    const onScroll = () => {
      if (!armed.current) return;
      if (window.scrollY > 4) trigger();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(armTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [phase]);

  if (phase === "done") return null;

  const repeated = [...marqueePhrases, ...marqueePhrases];

  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 0 0)" }}
      animate={
        phase === "wiping"
          ? { clipPath: "inset(0 0 100% 0)" }
          : { clipPath: "inset(0 0 0 0)" }
      }
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      onAnimationComplete={() => {
        if (phase === "wiping") setPhase("done");
      }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg)]"
      aria-hidden
    >
      {/* Topographic wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen"
        style={{
          backgroundImage: "url('/images/topographic-map.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Aurora pulse behind wordmark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(126,38,38,0.22)_0%,rgba(207,126,126,0.08)_38%,transparent_70%)] blur-[60px]" />
      </motion.div>

      {/* Top corner — issue mark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="absolute left-[clamp(1.25rem,3vw,2.5rem)] top-[clamp(1.25rem,3vw,2rem)] flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--fg-3)]"
      >
        <span className="block h-[5px] w-[5px] rounded-full bg-[var(--accent)]" />
        VOL. 01 · 2026
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="absolute right-[clamp(1.25rem,3vw,2.5rem)] top-[clamp(1.25rem,3vw,2rem)] font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--fg-3)]"
      >
        entering
      </motion.div>

      {/* Centered wordmark */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ y: 24, opacity: 0, letterSpacing: "-0.02em" }}
          animate={{ y: 0, opacity: 1, letterSpacing: "-0.045em" }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
          className="font-display italic text-[color:var(--fg)] text-[16vw] md:text-[11vw] lg:text-[10vw] leading-[0.92] tracking-tight tura-wordmark"
        >
          Divine Ipseity
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="mt-5 font-heading text-[10px] tracking-[0.32em] uppercase text-[color:var(--fg-2)]"
        >
          for the generation inheriting a broken system
        </motion.div>
      </div>

      {/* "scroll to enter" cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.4 }}
        className="absolute bottom-[clamp(5.5rem,12vw,8rem)] left-0 right-0 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--fg-2)]">
          scroll to enter
        </span>
        <span className="block h-7 w-px animate-pulse bg-[var(--rule-strong)]" />
      </motion.div>

      {/* Bottom marquee strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg-alt)_85%,transparent)] py-4 backdrop-blur"
      >
        <div className="inline-flex animate-marquee-fast whitespace-nowrap">
          {repeated.map((p, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-6 font-heading text-[10px] tracking-[0.32em] uppercase text-[color:var(--fg-2)]"
            >
              {p}
              <span className="text-[var(--accent)]" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
