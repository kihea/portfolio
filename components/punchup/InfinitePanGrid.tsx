"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductGraphic } from "./ProductGraphic";
import { TiltCard } from "./TiltCard";
import type { PunchProduct } from "@/lib/punchup";

type Props = {
  products: PunchProduct[];
  category: string;
};

/**
 * Cursor-driven infinite pan. The catalog is repeated REPEATS times in a single
 * row; the cursor's X position relative to the viewport eases the row left or
 * right within a clamped range. Repeated outwards content keeps the rail full
 * even at the extremes — so the pan feels infinite without actually being so.
 */
const REPEATS = 5;            // total copies of the product list
const MAX_OFFSET_PX = 1400;   // hard clamp on horizontal travel
const SENSITIVITY = 0.85;     // how aggressively the cursor maps to travel
const LERP = 0.08;            // smoothing toward target

export function InfinitePanGrid({ products, category }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Replicated list — gives "infinite" feel within a clamped travel.
  const replicated = Array.from({ length: REPEATS }).flatMap(() => products);

  useEffect(() => {
    const el = containerRef.current;
    const rail = railRef.current;
    if (!el || !rail) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let pointerActive = false;

    const onMove = (e: PointerEvent) => {
      pointerActive = true;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      // remap so center = 0, edges push to ±MAX_OFFSET
      target = -((px - 0.5) * 2) * MAX_OFFSET_PX * SENSITIVITY;
    };
    const onLeave = () => {
      pointerActive = false;
      target = 0; // glide back to center when the cursor leaves
    };

    const tick = () => {
      current += (target - current) * LERP;
      rail.style.transform = `translate3d(${current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[78vh] w-full overflow-hidden cursor-none"
      aria-label="Apparel browser"
    >
      {/* halftone wash */}
      <div className="punch-halftone absolute inset-0 opacity-50" aria-hidden />

      {/* center crosshair */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-px -translate-x-1/2 bg-punch-ink/15"
      />

      {/* the rail */}
      <div
        ref={railRef}
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8 will-change-transform"
        style={{ width: "max-content" }}
      >
        {replicated.map((p, i) => {
          const isHover = hoveredIdx === i;
          return (
            <motion.div
              key={`${p.slug}-${i}`}
              className="relative flex-shrink-0"
              style={{
                // gentle vertical wave so the rail breathes
                transform: `translateY(${Math.sin(i * 0.7) * 18}px) rotate(${i % 2 ? -1.5 : 1.5}deg)`,
              }}
              onPointerEnter={() => setHoveredIdx(i)}
              onPointerLeave={() => setHoveredIdx(null)}
              animate={{ scale: isHover ? 1.06 : 1 }}
              transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
            >
              <Link
                href={`/store/${category}/${p.slug}`}
                className="block w-[260px] cursor-pointer md:w-[320px]"
              >
                <TiltCard
                  className="border-2 border-punch-ink shadow-[8px_8px_0_0_var(--color-punch-ink)]"
                  tiltLimit={10}
                  scale={1.02}
                >
                  <ProductGraphic product={p} />
                </TiltCard>
                <div className="mt-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-punch-ink">
                  <span className="truncate">{p.name}</span>
                  <span className="ml-3 shrink-0">${p.price}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-punch-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-punch-paper to-transparent" />

      {/* HUD */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
        <div className="flex items-center gap-3 border-2 border-punch-ink bg-punch-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink shadow-[4px_4px_0_0_var(--color-punch-ink)]">
          <span className="block h-2 w-2 rounded-full bg-punch-blood" />
          move the mouse to pan · click a piece to open
        </div>
      </div>
    </div>
  );
}
