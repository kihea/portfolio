"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TextScramble } from "./TextScramble";

type Props = {
  videoSrc: string;
  posterSrc?: string;
};

/**
 * The boxing-video scroll-expansion hero, ported into the PunchUp light theme.
 *
 * Behavior matches the inspiration's ScrollExpandMedia:
 * - Wheel and touch progress a 0→1 expansion before the page can scroll.
 * - Once fully expanded, the page unlocks and normal scrolling continues.
 * - Scrolling back up at the top collapses the video again.
 *
 * We chose to preserve the punching scroll video — it carries the brand.
 */
export function PunchScrollHero({ videoSrc, posterSrc }: Props) {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchY = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
    const onResize = () => {
      isMobile.current = window.innerWidth < 768;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
        return;
      }
      if (!expanded) {
        e.preventDefault();
        const delta = e.deltaY * 0.0009;
        setProgress((p) => {
          const next = Math.min(Math.max(p + delta, 0), 1);
          if (next >= 1) setExpanded(true);
          return next;
        });
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const cy = e.touches[0]?.clientY ?? 0;
      const dy = touchY.current - cy;
      if (expanded && dy < -20 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
        return;
      }
      if (!expanded) {
        e.preventDefault();
        const factor = dy < 0 ? 0.008 : 0.005;
        setProgress((p) => {
          const next = Math.min(Math.max(p + dy * factor, 0), 1);
          if (next >= 1) setExpanded(true);
          return next;
        });
        touchY.current = cy;
      }
    };

    const onScroll = () => {
      if (!expanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [expanded]);

  const w = 320 + progress * (isMobile.current ? 480 : 1100);
  const h = 420 + progress * (isMobile.current ? 240 : 380);
  // Slight drift apart as the video grows — a tiny "punch" kick.
  const drift = progress * (isMobile.current ? 1.6 : 2.4); // vh

  return (
    <section className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-punch-paper">
      {/* halftone wash on the paper */}
      <div className="punch-halftone absolute inset-0 opacity-60" aria-hidden />

      {/* burst behind video */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.85 - progress * 0.6 }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        style={{ width: 720, height: 720 }}
      >
        <div
          className="h-full w-full"
          style={{
            background: "var(--color-punch-volt)",
            clipPath:
              "polygon(0% 35%, 12% 30%, 14% 12%, 26% 25%, 38% 8%, 44% 26%, 58% 5%, 60% 25%, 74% 18%, 76% 35%, 92% 28%, 88% 46%, 100% 55%, 88% 62%, 95% 78%, 78% 74%, 78% 92%, 62% 80%, 56% 96%, 46% 80%, 36% 95%, 30% 78%, 14% 88%, 18% 70%, 4% 64%, 16% 54%, 0% 48%)",
          }}
        />
      </motion.div>

      {/* the video */}
      <div
        className="relative z-20 overflow-hidden border-2 border-punch-ink"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          maxWidth: "92vw",
          maxHeight: "82vh",
          boxShadow: `12px 12px 0 0 var(--color-punch-ink)`,
        }}
      >
        <video
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />

        {/* Headline overlaid on top of the video — PUNCH up top, UP bottom.
            mix-blend-difference keeps it legible against any video frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-between py-[6%]"
          style={{ mixBlendMode: "difference" }}
        >
          <motion.span
            className="font-punch uppercase leading-[0.86]"
            animate={{ y: -drift * 4 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{
              fontSize: "clamp(2.4rem, 11vw, 9.5rem)",
              letterSpacing: "-0.04em",
              color: "#F2EDE2",
            }}
          >
            Punch
          </motion.span>
          <motion.span
            className="font-punch uppercase italic leading-[0.86]"
            animate={{ y: drift * 4 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{
              fontSize: "clamp(2.4rem, 11vw, 9.5rem)",
              letterSpacing: "-0.04em",
              color: "#F2EDE2",
            }}
          >
            Up
          </motion.span>
        </div>

        {/* Subtle red shadow behind the headline for a printed-overlay feel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between py-[6%]"
          style={{ opacity: 0.35 }}
        >
          <motion.span
            className="font-punch uppercase leading-[0.86] translate-x-[3px] translate-y-[3px]"
            animate={{ y: -drift * 4 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{
              fontSize: "clamp(2.4rem, 11vw, 9.5rem)",
              letterSpacing: "-0.04em",
              color: "var(--color-punch-blood)",
            }}
          >
            Punch
          </motion.span>
          <motion.span
            className="font-punch uppercase italic leading-[0.86] translate-x-[3px] translate-y-[3px]"
            animate={{ y: drift * 4 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{
              fontSize: "clamp(2.4rem, 11vw, 9.5rem)",
              letterSpacing: "-0.04em",
              color: "var(--color-punch-volt)",
            }}
          >
            Up
          </motion.span>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-punch-ink/65">
            <TextScramble text={expanded ? "ENTER" : "SCROLL TO EXPAND"} />
          </span>
          <span className="block h-7 w-px animate-pulse bg-punch-ink/65" />
        </div>
      </div>
    </section>
  );
}
