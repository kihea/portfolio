import Link from "next/link";

export function FactionUpsell() {
  return (
    <section className="border-t border-[var(--rule)] bg-[color:var(--bg-alt)] px-[var(--content-pad)] py-[clamp(3rem,5vw,4rem)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
              <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
              The Faction
            </div>
            <p className="font-body text-[15px] leading-[1.7] text-[color:var(--fg-2)] max-w-[44ch]">
              Faction members get every course — including new ones added after they join.
            </p>
          </div>
          <Link
            href="/faction"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[color:var(--fg)] px-6 py-3 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--bg)] transition-opacity hover:opacity-80 cursor-pointer"
          >
            Join the Faction →
          </Link>
        </div>
      </div>
    </section>
  );
}
