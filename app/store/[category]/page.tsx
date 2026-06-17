import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategory, productsIn } from "@/lib/punchup";
import { InfinitePanGrid } from "@/components/punchup/InfinitePanGrid";
import { TrackingIn } from "@/components/punchup/TrackingIn";
import { PunchTicker } from "@/components/punchup/PunchTicker";
import { TextScramble } from "@/components/punchup/TextScramble";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: "Not found — PunchUp" };
  return {
    title: `${c.label} — PunchUp`,
    description: c.blurb,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const list = productsIn(category);

  return (
    <main className="relative">
      {/* Header */}
      <header className="relative overflow-hidden bg-punch-paper px-[var(--content-pad)] pb-10 pt-[clamp(7rem,11vw,10rem)]">
        <div className="punch-halftone absolute inset-0 opacity-30" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1180px]">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
            <Link
              href="/store"
              className="cursor-pointer text-punch-ink transition-colors hover:text-punch-blood"
            >
              ← Store
            </Link>
            <span className="block h-2 w-2 rounded-full bg-punch-blood" />
            <span>category · {c.slug}</span>
            <span className="block h-2 w-2 rounded-full bg-punch-blood" />
            <span>{list.length} pieces</span>
          </div>

          <h1 className="font-punch text-[clamp(3.5rem,12vw,11rem)] leading-[0.86] tracking-[-0.03em] text-punch-ink uppercase">
            <TrackingIn text={c.label.toUpperCase()} />
          </h1>
          <p className="mt-4 max-w-[58ch] font-body text-[16px] leading-[1.7] text-punch-ink/72">
            {c.blurb}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
            <span className="block h-px w-10 bg-punch-ink/40" />
            — {c.tagline} —
          </div>
        </div>
      </header>

      <PunchTicker
        items={[
          `the ${c.label.toLowerCase()} rail`,
          "move the mouse to pan",
          "click to open",
          "numbered runs · printed in the US",
        ]}
        tone="ink"
      />

      {/* Infinite-pan rail */}
      <section className="relative bg-punch-paper py-10">
        <InfinitePanGrid products={list} category={c.slug} />
      </section>

      {/* Specs strip */}
      <section className="relative border-t-2 border-punch-ink bg-punch-paper py-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-[var(--content-pad)] md:grid-cols-3">
          {[
            {
              k: "Cotton",
              v: "8.5oz mid-heavy",
              n: "Combed and ring-spun. Drapes after one wash, holds shape after fifty.",
            },
            {
              k: "Print",
              v: "Single-color discharge",
              n: "Soft hand. Reads matte across a room. Will not crack.",
            },
            {
              k: "Run",
              v: "Numbered, small",
              n: "Each drop is bounded. We restock when the argument calls for it.",
            },
          ].map((s) => (
            <div key={s.k} className="border-2 border-punch-ink p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
                {s.k}
              </div>
              <div className="mt-1 font-punch text-[clamp(1.4rem,2.4vw,1.9rem)] uppercase tracking-[-0.01em] text-punch-ink">
                <TextScramble text={s.v} />
              </div>
              <p className="mt-2 font-body text-[13.5px] leading-[1.65] text-punch-ink/70">
                {s.n}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
