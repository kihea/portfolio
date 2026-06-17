"use client";

import Link from "next/link";
import { PunchTicker } from "./PunchTicker";

export function PunchUpFooter() {
  return (
    <footer className="relative bg-punch-paper">
      <PunchTicker
        items={[
          "Wear the argument",
          "Punch up — the other direction",
          "Numbered runs",
          "Cut and printed in the US",
          "Workers paid first",
        ]}
        tone="ink"
      />

      <div className="punch-halftone-lg absolute inset-0 opacity-40" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1180px] px-[var(--content-pad)] pb-12 pt-20">
        {/* Big closing wordmark */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-punch-ink/65">
            <span className="block h-px w-8 bg-punch-ink/65" />
            the closing argument
          </div>
          <h2 className="font-punch text-[clamp(3rem,11vw,9rem)] leading-[0.86] uppercase tracking-[-0.025em] text-punch-ink">
            Wear the
            <br />
            <span className="italic" style={{ color: "var(--color-punch-blood)" }}>
              argument.
            </span>
          </h2>
          <p className="mt-7 max-w-[44ch] font-body text-[15px] leading-[1.7] text-punch-ink/72">
            Apparel is the public statement. Each piece is small, dense,
            legible across a room, and meant to outlive the occasion.
          </p>
        </div>

        <div className="h-[2px] bg-punch-ink/25" />

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/store"
              className="font-punch text-[24px] uppercase tracking-tight text-punch-ink"
            >
              PunchUp
            </Link>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink/55">
              the apparel arm of Divine Ipseity
            </p>
          </div>

          <nav className="flex flex-wrap gap-6">
            {[
              { href: "/store/shirts", label: "Shirts" },
              { href: "/store/hoodies", label: "Hoodies" },
              { href: "/store/patches", label: "Patches" },
              { href: "/", label: "Divine Ipseity" },
              { href: "/blog", label: "The Writing" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink/65 transition-colors hover:text-punch-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.06em] text-punch-ink/55 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Divine Ipseity</span>
          <span>Workers paid first. Founder capped. Excess back to mission.</span>
        </div>
      </div>
    </footer>
  );
}
