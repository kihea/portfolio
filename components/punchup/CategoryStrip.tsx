"use client";

import Link from "next/link";
import { useRef } from "react";
import { categories } from "@/lib/punchup";
import { TiltCard } from "./TiltCard";
import { TextScramble } from "./TextScramble";

/**
 * Horizontal-scroll category strip on the landing page. Each category is a
 * tilt-reactive panel; scroll horizontally with wheel, swipe, or arrow keys.
 */
export function CategoryStrip() {
  const ref = useRef<HTMLDivElement>(null);

  // Translate vertical wheel into horizontal scroll inside the strip.
  const onWheel = (e: React.WheelEvent) => {
    const el = ref.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="relative overflow-hidden bg-punch-paper py-[clamp(3rem,7vw,6rem)]">
      <div className="punch-halftone absolute inset-0 opacity-30" aria-hidden />
      <div className="relative z-10 mx-auto mb-10 flex max-w-[1180px] items-end justify-between gap-6 px-[var(--content-pad)]">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
            <span className="block h-2 w-2 rounded-full bg-punch-blood" />
            .02 — the goods
          </div>
          <h2 className="font-punch text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.9] uppercase tracking-[-0.02em] text-punch-ink">
            Pick your <span className="italic">flag.</span>
          </h2>
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/55 md:block">
          scroll → · drag · arrow keys
        </div>
      </div>

      <div
        ref={ref}
        onWheel={onWheel}
        className="no-scrollbar relative z-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--content-pad)] pb-8"
        style={{ scrollBehavior: "smooth" }}
      >
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/store/${c.slug}`}
            className="group block w-[78vw] flex-shrink-0 cursor-pointer snap-center md:w-[clamp(420px,42vw,560px)]"
          >
            <TiltCard
              tiltLimit={9}
              scale={1.02}
              className="border-2 border-punch-ink bg-punch-paper shadow-[8px_8px_0_0_var(--color-punch-ink)]"
              effect="evade"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* alternating panel colors */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      i % 3 === 0
                        ? "var(--color-punch-volt)"
                        : i % 3 === 1
                          ? "var(--color-punch-ink)"
                          : "var(--color-punch-blood)",
                  }}
                />
                <div
                  className="punch-halftone-lg pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    color:
                      i % 3 === 1 || i % 3 === 2
                        ? "var(--color-punch-paper)"
                        : "var(--color-punch-ink)",
                  }}
                />
                <div className="relative z-10 flex h-full flex-col justify-between p-7">
                  <div className="flex items-start justify-between">
                    <span
                      className="border-2 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em]"
                      style={{
                        borderColor:
                          i % 3 === 1 || i % 3 === 2
                            ? "var(--color-punch-paper)"
                            : "var(--color-punch-ink)",
                        color:
                          i % 3 === 1 || i % 3 === 2
                            ? "var(--color-punch-paper)"
                            : "var(--color-punch-ink)",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      aria-hidden
                      className="font-punch text-[14px] uppercase"
                      style={{
                        color:
                          i % 3 === 1 || i % 3 === 2
                            ? "var(--color-punch-paper)"
                            : "var(--color-punch-ink)",
                      }}
                    >
                      <TextScramble text="ENTER →" />
                    </span>
                  </div>

                  <div>
                    <div
                      className="font-punch leading-[0.88] tracking-[-0.025em] text-[clamp(2.4rem,6vw,4.4rem)] uppercase"
                      style={{
                        color:
                          i % 3 === 1 || i % 3 === 2
                            ? "var(--color-punch-paper)"
                            : "var(--color-punch-ink)",
                      }}
                    >
                      {c.label}
                    </div>
                    <div
                      className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] opacity-80"
                      style={{
                        color:
                          i % 3 === 1 || i % 3 === 2
                            ? "var(--color-punch-paper)"
                            : "var(--color-punch-ink)",
                      }}
                    >
                      — {c.tagline}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <p className="mt-4 max-w-[44ch] font-body text-[14px] leading-[1.65] text-punch-ink/72">
              {c.blurb}
            </p>
          </Link>
        ))}

        {/* end card — manifesto link */}
        <Link
          href="/"
          className="group block w-[78vw] flex-shrink-0 cursor-pointer snap-center md:w-[clamp(380px,38vw,500px)]"
        >
          <div className="border-2 border-dashed border-punch-ink/45 p-8 aspect-[4/5] flex flex-col justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/55">
              the why →
            </div>
            <div>
              <h3 className="font-punch text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[0.95] uppercase tracking-[-0.02em] text-punch-ink">
                Read the
                <br />
                <span className="italic">argument first.</span>
              </h3>
              <p className="mt-3 font-body text-[13.5px] leading-[1.65] text-punch-ink/70">
                The shirts make more sense once you have the philosophy. The
                Writing is on the parent site.
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink">
              ← Divine Ipseity
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
