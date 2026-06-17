"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  /** Visual mode: 'volt' for lime, 'ink' for black, 'blood' for red. */
  tone?: "volt" | "ink" | "blood";
  className?: string;
};

/**
 * Liquid-metal-style CTA. We swapped the WebGL shader for a pure-CSS
 * approximation: a slowly-rotating conic gradient under the surface, with a
 * cursor-tracked highlight on top. Looks alive without the dependency.
 */
export function LiquidMetalCTA({
  href,
  onClick,
  children,
  tone = "ink",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const surface =
    tone === "volt"
      ? "from-[#dfff5e] via-[#c3ff00] to-[#9ed500]"
      : tone === "blood"
        ? "from-[#e8454c] via-[#c42127] to-[#8e1318]"
        : "from-[#3a322c] via-[#0a0907] to-[#000000]";

  const text =
    tone === "volt" ? "text-punch-ink" : "text-punch-paper";

  const inner = (
    <span
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        "group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-punch text-[12px] uppercase tracking-[0.2em] transition-transform active:scale-[0.97]",
        text,
        "border-2 border-[var(--color-punch-ink)] shadow-[5px_5px_0_0_var(--color-punch-ink)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_var(--color-punch-ink)]",
        className,
      )}
    >
      {/* base liquid surface */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-20 bg-gradient-to-br",
          surface,
        )}
      />
      {/* slow conic — gives the metallic shift */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[40%] -z-10 animate-[spin_8s_linear_infinite] opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,0.0) 0deg, rgba(255,255,255,0.45) 60deg, rgba(255,255,255,0.0) 120deg, rgba(255,255,255,0.0) 360deg)",
        }}
      />
      {/* cursor-tracked highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.55) 0%, transparent 45%)`,
        }}
      />
      {children}
      <span aria-hidden className="text-current">→</span>
    </span>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return (
    <button onClick={onClick} className="cursor-pointer">
      {inner}
    </button>
  );
}
