"use client";

import { useEffect, useRef } from "react";

/**
 * Lime halo that follows the cursor across the PunchUp surface. Multiply blend
 * keeps it from overpowering content. Disabled on touch where it would be jittery.
 */
export function CursorHalo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX - 120}px, ${e.clientY - 120}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={ref} className="punch-cursor-halo" aria-hidden />;
}
