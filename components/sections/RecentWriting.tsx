import Link from "next/link";
import { essays } from "@/lib/essays";
import { EssayCard } from "./EssayCard";
import { SectionMarker } from "@/components/effects/SectionMarker";

export function RecentWriting() {
  const featured = essays[0];
  const rest = essays.slice(1, 3);

  return (
    <section className="relative overflow-hidden bg-[var(--bg-deep)] py-[clamp(4rem,9vw,8rem)]">
      <SectionMarker number="02" label="The Writing" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] -top-[20%] h-[640px] w-[640px] rounded-full blur-[80px]"
        style={{ background: "color-mix(in oklab, var(--accent) 14%, transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--max-width)] px-[var(--content-pad)]">
        <div className="mb-12 flex flex-col gap-6 border-b border-[var(--rule)] pb-10 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              <span className="block h-px w-8 bg-[var(--rule-strong)]" />
              <span>Recent Writing</span>
            </div>
            <h2 className="font-display italic font-light text-[color:var(--fg)] leading-[1.06] tracking-[-0.025em] text-[clamp(2rem,4.5vw,52px)]">
              Essays on becoming.
            </h2>
          </div>
          <p className="max-w-[44ch] font-body text-[15px] leading-[1.78] text-[color:var(--fg-2)]">
            The long argument. Source material for getting yourself back.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <EssayCard essay={featured} featured />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {rest.map((e) => (
              <EssayCard key={e.slug} essay={e} />
            ))}
          </div>
        </div>

        <Link
          href="/withdepth"
          className="mt-12 inline-flex cursor-pointer items-center gap-2 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-2)] underline decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--fg)]"
        >
          All essays →
        </Link>
      </div>
    </section>
  );
}
