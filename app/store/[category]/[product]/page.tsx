import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  categories,
  getCategory,
  getProduct,
  products,
  productsIn,
} from "@/lib/punchup";
import { ProductGraphic } from "@/components/punchup/ProductGraphic";
import { ZoomParallax } from "@/components/punchup/ZoomParallax";
import { TiltCard } from "@/components/punchup/TiltCard";
import { TrackingIn } from "@/components/punchup/TrackingIn";
import { MaskedSlideReveal } from "@/components/punchup/MaskedSlideReveal";
import { BuyControls } from "@/components/punchup/BuyControls";

type Params = { category: string; product: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, product } = await params;
  const p = getProduct(product);
  const c = getCategory(category);
  if (!p || !c || p.category !== c.slug)
    return { title: "Not found — PunchUp" };
  return {
    title: `${p.name} — PunchUp`,
    description: p.blurb,
  };
}

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, product } = await params;
  const p = getProduct(product);
  const c = getCategory(category);
  if (!p || !c || p.category !== c.slug) notFound();

  // sibling products in the same category for the rail
  const siblings = productsIn(c.slug).filter((x) => x.slug !== p.slug);

  return (
    <main className="relative">
      {/* ───────── Header ─────────── */}
      <header className="relative bg-punch-paper px-[var(--content-pad)] pb-6 pt-[clamp(7rem,11vw,10rem)]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
            <Link
              href="/store"
              className="cursor-pointer transition-colors hover:text-punch-blood"
            >
              ← Store
            </Link>
            <span className="block h-2 w-2 rounded-full bg-punch-blood" />
            <Link
              href={`/store/${c.slug}`}
              className="cursor-pointer transition-colors hover:text-punch-blood"
            >
              {c.label}
            </Link>
            <span className="block h-2 w-2 rounded-full bg-punch-blood" />
            <span>{p.name}</span>
          </div>
        </div>
      </header>

      {/* ───────── Zoom-parallax hero ─────────── */}
      <ZoomParallax maxScale={1.5}>
        <TiltCard
          tiltLimit={6}
          scale={1.01}
          className="border-2 border-punch-ink shadow-[12px_12px_0_0_var(--color-punch-ink)]"
        >
          <ProductGraphic product={p} scale="hero" />
        </TiltCard>
      </ZoomParallax>

      {/* ───────── Title + add-to-cart ─────────── */}
      <section className="relative bg-punch-paper py-[clamp(3rem,7vw,6rem)]">
        <div className="punch-halftone absolute inset-0 opacity-30" aria-hidden />
        <div className="relative z-10 mx-auto grid max-w-[1180px] gap-12 px-[var(--content-pad)] md:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
              <span className="block h-2 w-2 rounded-full bg-punch-blood" />
              {c.label} · drop 001
            </div>
            <h1 className="font-punch text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[0.9] tracking-[-0.025em] text-punch-ink uppercase">
              <TrackingIn text={p.name} />
            </h1>

            <div className="mt-7 max-w-[60ch] space-y-5 font-body text-[16px] leading-[1.78] text-punch-ink/82">
              {p.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-3">
              <span className="punch-sticker punch-sticker-tilt-r animate-punch-wobble">
                ⌗ printed in the US
              </span>
              <span className="punch-sticker punch-sticker-tilt">
                ✦ numbered run
              </span>
            </div>
          </div>

          {/* sticky buy panel */}
          <aside className="self-start">
            <div className="border-2 border-punch-ink bg-punch-paper p-6 shadow-[8px_8px_0_0_var(--color-punch-ink)]">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
                price · usd
              </div>
              <div className="font-punch text-[clamp(2.6rem,4.6vw,3.6rem)] leading-[0.9] tracking-[-0.02em] text-punch-ink">
                ${p.price}
              </div>

              <BuyControls
                product={p}
                sizes={c.slug === "patches" ? ["ONE"] : SIZES}
              />

              <ul className="mt-8 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-punch-ink/65">
                {[
                  ["weight", p.spec.weight],
                  ["fit", p.spec.fit],
                  ["print", p.spec.print],
                  ["origin", p.spec.origin],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex justify-between gap-4 border-b border-punch-ink/20 pb-1.5"
                  >
                    <span className="text-punch-ink/55">{k}</span>
                    <span className="text-right text-punch-ink/85">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ───────── Pull-quote ─────────── */}
      <section className="relative border-y-2 border-punch-ink bg-punch-volt py-[clamp(3rem,6vw,5rem)]">
        <div className="punch-halftone absolute inset-0 opacity-25" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[860px] px-[var(--content-pad)] text-center">
          <MaskedSlideReveal
            text={`"${p.graphic.headline}"`}
            as="div"
            className="font-punch text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em] text-punch-ink uppercase"
          />
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.28em] text-punch-ink/70">
            — printed at full chest —
          </div>
        </div>
      </section>

      {/* ───────── Sibling rail ─────────── */}
      <section className="relative bg-punch-paper py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto max-w-[1180px] px-[var(--content-pad)]">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="font-punch text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[0.95] tracking-[-0.02em] text-punch-ink uppercase">
              More from {c.label}
            </h2>
            <Link
              href={`/store/${c.slug}`}
              className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink hover:text-punch-blood"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {siblings.slice(0, 3).map((s) => (
              <Link
                key={s.slug}
                href={`/store/${c.slug}/${s.slug}`}
                className="group block cursor-pointer"
              >
                <TiltCard
                  tiltLimit={8}
                  scale={1.02}
                  className="border-2 border-punch-ink shadow-[6px_6px_0_0_var(--color-punch-ink)]"
                >
                  <ProductGraphic product={s} />
                </TiltCard>
                <div className="mt-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-punch-ink">
                  <span className="truncate">{s.name}</span>
                  <span className="ml-3 shrink-0">${s.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
