"use client";

import { cn } from "@/lib/cn";
import type { PunchProduct } from "@/lib/punchup";

const COLORS = {
  paper: { bg: "var(--color-punch-paper)", fg: "var(--color-punch-ink)" },
  ink: { bg: "var(--color-punch-ink)", fg: "var(--color-punch-paper)" },
  volt: { bg: "var(--color-punch-volt)", fg: "var(--color-punch-ink)" },
  blood: { bg: "var(--color-punch-blood)", fg: "var(--color-punch-paper)" },
} as const;

type Props = {
  product: PunchProduct;
  className?: string;
  /** Size variant — controls headline scale. */
  scale?: "card" | "hero";
};

/**
 * A printed-graphic placeholder that stands in for product photography. Each
 * product's `graphic` block in the catalog drives layout, color, and style.
 * Once we have real photo assets we swap this out for <Image>.
 */
export function ProductGraphic({ product, className, scale = "card" }: Props) {
  const g = product.graphic;
  const fg = COLORS[g.fg].fg as string;
  const bg = COLORS[g.bg].bg as string;
  const accent = g.accent ? (COLORS[g.accent].bg as string) : null;

  const sizes =
    scale === "hero"
      ? "text-[clamp(3rem,8vw,7rem)]"
      : "text-[clamp(1.6rem,3.4vw,2.8rem)]";

  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ background: bg, color: fg }}
    >
      {/* Halftone wash for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1.4px)",
          backgroundSize: scale === "hero" ? "12px 12px" : "8px 8px",
          color: fg,
        }}
      />

      {/* Accent corner stripe */}
      {accent && (
        <div
          className="pointer-events-none absolute -left-8 top-8 h-3 w-32 rotate-[-12deg]"
          style={{ background: accent }}
        />
      )}

      {/* Garment hint — soft neckline curve at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] h-[14%] w-[42%] -translate-x-1/2 rounded-[50%] border-b-2"
        style={{ borderColor: fg, opacity: 0.18 }}
      />

      {/* Headline + sub */}
      <div className="relative z-10 mx-auto flex max-w-[88%] flex-col items-center gap-2 px-4 text-center">
        {g.style === "ribbon" && (
          <div
            className="mb-2 inline-block rounded-full border-[1.5px] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ borderColor: fg }}
          >
            ⌘ flag
          </div>
        )}
        <div
          className={cn(
            "font-punch leading-[0.92] tracking-[-0.02em] uppercase",
            sizes,
            g.style === "stencil" && "tracking-[0.02em]",
          )}
          style={{
            color: fg,
            // stencil = chunky outline cut, stamp = squashed authority
            transform: g.style === "stamp" ? "skewX(-4deg)" : undefined,
          }}
        >
          {g.headline}
        </div>
        {g.sub && (
          <div
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em]"
            style={{ color: fg, opacity: 0.85 }}
          >
            — {g.sub} —
          </div>
        )}
      </div>

      {/* Crop mark in the corner */}
      <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.18em] opacity-60">
        PU—{product.slug.slice(0, 4).toUpperCase()}
      </div>
    </div>
  );
}
