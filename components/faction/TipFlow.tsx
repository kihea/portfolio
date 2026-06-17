"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startTipCheckout } from "@/app/faction/actions";
import { cn } from "@/lib/cn";

const PRESETS = [
  { cents: 300, label: "$3", note: "a coffee" },
  { cents: 700, label: "$7", note: "a book" },
  { cents: 2000, label: "$20", note: "a real one" },
];

type Props = {
  /** True if Stripe is wired up (decides whether to render the full flow). */
  enabled: boolean;
};

/**
 * One-time tip flow. Three preset amounts + an "Other" custom dollar input.
 * Submits to the startTipCheckout Server Action which redirects to a
 * Stripe Checkout page. No account required.
 */
export function TipFlow({ enabled }: Props) {
  const [selected, setSelected] = useState<number | "custom" | null>(null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!enabled) {
    return (
      <p className="mx-auto max-w-[44ch] font-body text-[15px] leading-[1.7] text-[color:var(--fg)]">
        Not ready for membership? You can leave a one-time gift instead. No
        account required. Available when the payment flow ships.
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData();
    if (selected === "custom") {
      const value = custom.trim();
      if (!value) {
        setError("Pick an amount, or type one in.");
        return;
      }
      const parsed = parseFloat(value);
      if (Number.isNaN(parsed) || parsed < 1) {
        setError("Minimum gift is $1.");
        return;
      }
      fd.set("custom_dollars", value);
    } else if (typeof selected === "number") {
      fd.set("preset_cents", String(selected));
    } else {
      setError("Pick an amount.");
      return;
    }

    startTransition(async () => {
      try {
        await startTipCheckout(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-[520px] flex-col items-stretch gap-5"
    >
      <div
        role="radiogroup"
        aria-label="Pick a tip amount"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {PRESETS.map((p) => {
          const active = selected === p.cents;
          return (
            <button
              key={p.cents}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setSelected(p.cents);
                setError(null);
              }}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all",
                active
                  ? "border-oxblood-300/55 bg-gradient-to-br from-oxblood-700/35 via-[var(--bg-deep)] to-[var(--bg-alt)] shadow-[0_10px_28px_rgba(107,30,30,0.30)]"
                  : "border-[var(--fg-3)] bg-void-500/5 hover:border-[color:var(--fg-2)] hover:bg-void-500/20",
              )}
            >
              <div className="font-display italic text-[color:var(--fg-2)] text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.05]">
                {p.label}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                {p.note}
              </div>
            </button>
          );
        })}
        <button
          type="button"
          role="radio"
          aria-checked={selected === "custom"}
          onClick={() => {
            setSelected("custom");
            setError(null);
          }}
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all",
            selected === "custom"
              ? "border-sand-100/35 bg-void-500/55 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
              : "border-sand-100/12 bg-void-700/45 hover:border-sand-100/10 hover:bg-void-500",
          )}
        >
          <div className="font-display italic text-sand-100 text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.05]">
            Other
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-100/55">
            you pick
          </div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {selected === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: -8 }}
            transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <label
              htmlFor="tip-custom"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-2)]"
            >
              Amount (USD)
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-5 font-display italic text-[20px] text-[color:var(--fg-2)]">
                $
              </span>
              <input
                id="tip-custom"
                type="number"
                min="1"
                max="1000"
                step="1"
                inputMode="decimal"
                placeholder="50"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--fg)] bg-[color:var(--bg)] px-5 py-4 pl-9 font-display italic text-[24px] text-[color:var(--fg-2)] placeholder:text-[color:var(--fg-2)] focus:border-oxblood-300/60 focus:outline-none focus:ring-1 focus:ring-oxblood-300/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isPending || selected === null}
        className="cursor-pointer rounded-full border border-oxblood-300/30 bg-gradient-to-b from-oxblood-600 to-oxblood-800 px-7 py-3.5 font-heading text-[11px] uppercase tracking-[0.2em] text-sand-100 shadow-[0_4px_18px_rgba(107,30,30,0.35),inset_0_1px_0_rgba(255,255,255,0.10)] transition-all hover:from-oxblood-700 hover:to-oxblood-900 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Opening Stripe…" : "Send the gift →"}
      </button>

      {error && (
        <p
          role="alert"
          className="text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-oxblood-300/95"
        >
          {error}
        </p>
      )}

      <p className="text-center font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--fg-2)]">
        Powered by Stripe · receipt to your inbox · open to anyone
      </p>
    </form>
  );
}
