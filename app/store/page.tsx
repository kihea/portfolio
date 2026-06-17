import Link from "next/link";
import { PunchScrollHero } from "@/components/punchup/PunchScrollHero";
import { CategoryStrip } from "@/components/punchup/CategoryStrip";
import { PunchTicker } from "@/components/punchup/PunchTicker";
import { MaskedSlideReveal } from "@/components/punchup/MaskedSlideReveal";
import { TrackingIn } from "@/components/punchup/TrackingIn";
import { LiquidMetalCTA } from "@/components/punchup/LiquidMetalCTA";
import { BackgroundParallax } from "@/components/punchup/BackgroundParallax";
import { TiltCard } from "@/components/punchup/TiltCard";
import { ProductGraphic } from "@/components/punchup/ProductGraphic";
import { products } from "@/lib/punchup";

export default function StorePage() {
  // Hero teasers — first three shirts.
  const drop = products.slice(0, 3);

  return (
    <main className="relative">
      {/* ───────── Hero (preserved punching scroll video) ───────── */}
      <PunchScrollHero
        videoSrc="/videos/boxing_hero.mp4"
        posterSrc="/images/topographic-map.jpg"
      />

      {/* ───────── Mission strip ───────── */}
      <PunchTicker
        items={[
          "Wear the argument",
          "Punch up — the other direction",
          "Heavyweight cotton, single-color print",
          "Numbered runs",
          "Workers paid first",
        ]}
        tone="volt"
        divider="✦"
      />

      {/* ───────── Manifesto block ───────── */}
      <section className="relative overflow-hidden bg-punch-paper py-[clamp(4rem,9vw,8rem)]">
        <div className="punch-halftone absolute inset-0 opacity-30" aria-hidden />
        <div className="relative z-10 mx-auto grid max-w-[1180px] gap-14 px-[var(--content-pad)] md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
              <span className="block h-2 w-2 rounded-full bg-punch-blood" />
              .01 — the position
            </div>
            <MaskedSlideReveal
              text="It is so easy to punch down."
              as="h2"
              className="font-punch text-[clamp(2.4rem,6.4vw,5.4rem)] leading-[0.92] tracking-[-0.025em] text-punch-ink uppercase"
            />
            <div className="mt-3">
              <MaskedSlideReveal
                text="This is for the other direction."
                as="div"
                staggerDelay={0.06}
                className="font-punch italic text-[clamp(2.4rem,6.4vw,5.4rem)] leading-[0.92] tracking-[-0.025em] uppercase"
              />
              <span
                aria-hidden
                className="block h-3 w-32 -mt-2"
                style={{ background: "var(--color-punch-volt)" }}
              />
            </div>
          </div>

          <div className="space-y-5 self-end font-body text-[15.5px] leading-[1.78] text-punch-ink/80">
            <p>
              PunchUp is the apparel arm of Divine Ipseity. Each piece carries
              a single argument — set big, set once, printed to be read across
              a room.
            </p>
            <p>
              Heavyweight cotton. One color, where it counts. Cut and printed
              in the US in numbered runs. The phrase on the front does the
              talking; the rest stays out of the way.
            </p>
            <p>
              Workers are paid first. Founder compensation is capped. Anything
              left rolls back into the next drop.
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <LiquidMetalCTA href="/store/shirts" tone="volt">
                Browse the shirts
              </LiquidMetalCTA>
              <LiquidMetalCTA href="/store/hoodies" tone="ink">
                Hoodies
              </LiquidMetalCTA>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Category strip (horizontal scroll) ───────── */}
      <CategoryStrip />

      {/* ───────── Drop teaser — three pieces, parallax bg ───────── */}
      <BackgroundParallax
        strength={6}
        className="bg-punch-ink py-[clamp(4rem,9vw,8rem)]"
        bg={
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(195,255,0,0.18) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(196,33,39,0.20) 0%, transparent 50%)",
            }}
          />
        }
      >
        <div className="mx-auto max-w-[1180px] px-[var(--content-pad)]">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-volt">
                <span className="block h-2 w-2 rounded-full bg-punch-volt" />
                .03 — drop 001
              </div>
              <h2 className="font-punch text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.92] tracking-[-0.025em] text-punch-paper uppercase">
                <TrackingIn text="LATEST CAPSULE" />
              </h2>
            </div>
            <p className="max-w-[40ch] font-body text-[14.5px] leading-[1.7] text-punch-paper/70">
              Three pieces. Each one is a single phrase from the project,
              printed once and meant to outlive the moment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {drop.map((p) => (
              <Link
                key={p.slug}
                href={`/store/${p.category}/${p.slug}`}
                className="group block cursor-pointer"
              >
                <TiltCard
                  tiltLimit={9}
                  scale={1.02}
                  className="border-2 border-punch-paper shadow-[8px_8px_0_0_var(--color-punch-volt)]"
                >
                  <ProductGraphic product={p} />
                </TiltCard>
                <div className="mt-4 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-punch-paper">
                  <span className="truncate">{p.name}</span>
                  <span className="ml-3 shrink-0 text-punch-volt">
                    ${p.price}
                  </span>
                </div>
                <p className="mt-1 font-body text-[13px] text-punch-paper/55">
                  {p.blurb}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </BackgroundParallax>

      {/* ───────── Volt CTA panel ───────── */}
      <section className="relative bg-punch-volt py-[clamp(3.5rem,8vw,7rem)]">
        <div className="punch-halftone absolute inset-0 opacity-30" aria-hidden />
        <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col items-center gap-8 px-[var(--content-pad)] text-center">
          <span className="punch-sticker punch-sticker-tilt animate-punch-wobble">
            ✦ list opens early
          </span>
          <h2 className="font-punch text-[clamp(2.4rem,7vw,6rem)] leading-[0.88] tracking-[-0.025em] text-punch-ink uppercase">
            Get on the list.
            <br />
            <span className="italic">Skip the queue.</span>
          </h2>
          <p className="max-w-[44ch] font-body text-[15px] leading-[1.7] text-punch-ink/80">
            Drop alerts only. No marketing tail. The list is never sold.
          </p>
          <form
            className="flex w-full max-w-[520px] flex-col items-center gap-3 sm:flex-row"
            action="#"
            method="post"
          >
            <label htmlFor="punch-email" className="sr-only">
              Email address
            </label>
            <input
              id="punch-email"
              type="email"
              required
              placeholder="your@email"
              className="w-full border-2 border-punch-ink bg-punch-paper px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-punch-ink placeholder:text-punch-ink/40 focus:outline-none focus:ring-0"
            />
            <LiquidMetalCTA tone="ink">Notify me</LiquidMetalCTA>
          </form>
        </div>
      </section>
    </main>
  );
}
