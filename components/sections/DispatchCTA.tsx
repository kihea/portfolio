"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Marquee } from "@/components/effects/Marquee";

export function DispatchCTA() {
  return (
    <section
      id="dispatch"
      className="relative overflow-hidden bg-[var(--bg-deep)] py-[clamp(4rem,8vw,7rem)]"
    >
      {/* Marquee strip */}
      <div className="border-y border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg-alt)_85%,transparent)] py-3 backdrop-blur">
        <Marquee
          items={[
            "Dispatches from the work of becoming",
            "Issued monthly · no algorithm",
            "Long-form, on the first of each month",
          ]}
          divider="✦"
        />
      </div>

      <div className="relative z-10 mx-auto mt-[clamp(3rem,6vw,5rem)] max-w-[var(--max-width)] px-[var(--content-pad)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="gloss-panel relative mx-auto max-w-[920px] rounded-[28px] p-[clamp(2rem,4vw,52px)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[20%] -top-[40%] h-[200%] w-[140%] opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 55%)",
            }}
          />

          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
                <span className="block h-px w-8 bg-[var(--rule-strong)]" />
                <span>The Dispatch</span>
              </div>
              <h2 className="mb-5 font-display italic font-light text-[color:var(--fg)] leading-[1.06] tracking-[-0.025em] text-[clamp(2rem,3.6vw,42px)]">
                One letter, once a&nbsp;month. <br className="hidden sm:block" />
                Long enough to&nbsp;think&nbsp;with.
              </h2>
              <p className="max-w-[48ch] font-body text-[15px] leading-[1.78] text-[color:var(--fg-2)]">
                Essays, sources, and the occasional argument with the present —
                sent on the first; the list is never sold.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
              aria-label="Subscribe to the Dispatch"
            >
              <label
                htmlFor="dispatch-email"
                className="font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]"
              >
                Your address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="dispatch-email"
                  type="email"
                  required
                  placeholder="you@somewhere.com"
                  className="flex-1 rounded-full border border-[var(--rule-strong)] bg-[color-mix(in_oklab,var(--bg)_60%,transparent)] px-5 py-3 font-body text-[14px] text-[color:var(--fg)] placeholder:text-[color:var(--fg-3)] backdrop-blur transition-colors focus:border-[var(--accent)] focus:outline-none"
                />
                <button type="submit" className="btn-primary">
                  Subscribe
                </button>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                Unsubscribe at any time. We do not ask why.
              </p>
            </form>
          </div>

          <div className="my-10 h-px w-full bg-[var(--rule)]" />

          <div className="relative flex flex-col items-start justify-between gap-4 font-heading text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-3)] md:flex-row md:items-center">
            <Link
              href="/writing"
              className="cursor-pointer text-[color:var(--fg-2)] underline decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--fg)]"
            >
              Read past issues →
            </Link>
            <span>Next issue: June 1, 2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
