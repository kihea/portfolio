"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { completeWelcome } from "./actions";

type Tier = "free" | "member";

type Props = {
  email: string | null;
  initialDisplayName: string;
  initialTier: Tier | null;
};

const TIERS: {
  value: Tier;
  label: string;
  price: string;
  pitch: string;
  features: string[];
  accent: "ink" | "oxblood";
}[] = [
  {
    value: "free",
    label: "Reader",
    price: "$0",
    pitch: "Read the work, take the basic courses, see what we're doing.",
    features: [
      "Every essay, free to read",
      "Basic courses",
      "The public dispatch",
    ],
    accent: "ink",
  },
  {
    value: "member",
    label: "Faction",
    price: "$8/mo",
    pitch: "The room where the arguments actually happen.",
    features: [
      "Faction of Truth forum",
      "Comment on every essay",
      "All courses unlocked",
      "Early reads + dispatch",
      "PunchUp drops first",
    ],
    accent: "oxblood",
  },
];

const STEP_TRANSITION = {
  duration: 0.55,
  ease: [0.19, 1, 0.22, 1] as const,
};

export function WelcomeFlow({
  email,
  initialDisplayName,
  initialTier,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [tier, setTier] = useState<Tier | null>(initialTier);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [exiting, setExiting] = useState(false);

  const goNext = () => {
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setError("Pick at least two characters — anything you'll answer to.");
      return;
    }
    if (trimmed.length > 40) {
      setError("Forty characters max.");
      return;
    }
    setError(null);
    setDirection(1);
    setStep(1);
  };

  const goBack = () => {
    setError(null);
    setDirection(-1);
    setStep(0);
  };

  const onSubmit = () => {
    if (!tier) {
      setError("Pick a tier.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("display_name", displayName.trim());
      fd.set("tier", tier);
      const res = await completeWelcome(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      // Play the exit animation, then route. The router.push happens after
      // the exit transition resolves so the page doesn't jank away.
      setExiting(true);
      setTimeout(() => {
        router.push(res.nextUrl);
      }, 540);
    });
  };

  return (
    <AnimatePresence mode="wait">
      {!exiting && (
        <motion.div
          key="welcome-shell"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.985 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Eyebrow + step indicator */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-oxblood-300/95">
              <span className="block h-[3px] w-[3px] rounded-full bg-oxblood-300" />
              {step === 0 ? "Step 1 of 2 · Your name" : "Step 2 of 2 · Your tier"}
            </div>
            <StepDots step={step} />
          </div>

          <h1 className="font-display italic font-light text-sand-100 leading-[1.04] tracking-[-0.025em] text-[clamp(2rem,4.6vw,3.4rem)]">
            <AnimatePresence mode="wait">
              <motion.span
                key={step}
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={STEP_TRANSITION}
                className="inline-block"
              >
                {step === 0
                  ? "What should we call you?"
                  : "What kind of room are you in for?"}
              </motion.span>
            </AnimatePresence>
          </h1>

          {email && (
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-sand-300/55">
              Signed in as <span className="text-sand-100/80">{email}</span>
            </p>
          )}

          {/* Steps */}
          <div className="relative mt-10">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 ? (
                <motion.div
                  key="step-name"
                  custom={direction}
                  initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
                  transition={STEP_TRANSITION}
                >
                  <NameStep
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    onContinue={goNext}
                    onEnter={(e) => {
                      if (e.key === "Enter") goNext();
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="step-tier"
                  custom={direction}
                  initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
                  transition={STEP_TRANSITION}
                >
                  <TierStep selected={tier} onSelect={setTier} />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-oxblood-300/95"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Footer controls */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            {step === 1 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={isPending}
                className="btn-ghost btn-sm disabled:opacity-50"
              >
                ← Back
              </button>
            ) : (
              <span aria-hidden />
            )}

            {step === 0 ? (
              <button type="button" onClick={goNext} className="btn-primary">
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={isPending || !tier}
                className="btn-primary"
              >
                {isPending ? "Saving…" : tier === "member" ? "Join the Faction" : "Get me in"}
              </button>
            )}
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-100/40">
            You can change either of these later.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Step 1: name ─────────────────────────────────────────────────────────

function NameStep({
  displayName,
  setDisplayName,
  onContinue,
  onEnter,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  onContinue: () => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rounded-[24px] border border-sand-100/12 bg-void-700/70 p-7 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <label
        htmlFor="welcome-name"
        className="mb-3 block font-mono text-[10px] uppercase tracking-[0.22em] text-sand-100/55"
      >
        Display name
      </label>
      <input
        id="welcome-name"
        type="text"
        autoFocus
        autoComplete="nickname"
        maxLength={40}
        placeholder="anything you'll answer to"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        onKeyDown={onEnter}
        className="w-full rounded-2xl border border-sand-100/15 bg-void-900/50 px-5 py-4 font-display italic text-[24px] text-sand-100 placeholder:text-sand-100/30 focus:border-oxblood-300/60 focus:outline-none focus:ring-1 focus:ring-oxblood-300/40 md:text-[28px]"
      />
      <p className="mt-4 max-w-[44ch] font-body text-[14px] leading-[1.7] text-sand-100/65">
        This is the name on your comments and your member tag. Real name,
        handle, fake name — your call. You can change it.
      </p>
    </div>
  );
}

// ─── Step 2: tier ─────────────────────────────────────────────────────────

function TierStep({
  selected,
  onSelect,
}: {
  selected: Tier | null;
  onSelect: (t: Tier) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Pick a tier"
      className="grid grid-cols-1 gap-4"
    >
      {TIERS.map((tier) => {
        const active = selected === tier.value;
        return (
          <button
            key={tier.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(tier.value)}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-[24px] border px-6 py-6 text-left transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-oxblood-300/50",
              active
                ? tier.accent === "oxblood"
                  ? "border-oxblood-300/55 bg-gradient-to-br from-oxblood-700/35 via-void-700/85 to-void-900/85 shadow-[0_18px_50px_rgba(107,30,30,0.30)]"
                  : "border-sand-100/35 bg-void-500/55 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                : "border-sand-100/10 bg-void-700/45 hover:border-sand-100/25 hover:bg-void-500/55",
            )}
          >
            {/* glow accent on selected */}
            {active && tier.accent === "oxblood" && (
              <motion.span
                layoutId="tier-glow"
                className="pointer-events-none absolute -left-[20%] -top-[40%] h-[260px] w-[260px] rounded-full bg-oxblood-600/25 blur-[60px]"
                transition={{ duration: 0.4 }}
              />
            )}

            {/* radio indicator */}
            <span className="absolute right-6 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-sand-100/30">
              <motion.span
                animate={{ scale: active ? 1 : 0 }}
                transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
                className={cn(
                  "block h-3 w-3 rounded-full",
                  tier.accent === "oxblood" ? "bg-oxblood-300" : "bg-sand-100",
                )}
              />
            </span>

            <div className="relative">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display italic font-light text-sand-100 text-[clamp(1.5rem,3vw,2rem)] leading-[1.05]">
                  {tier.label}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-sand-100/55">
                  {tier.price}
                </span>
              </div>

              <p className="mt-2 max-w-[44ch] font-body text-[14.5px] leading-[1.65] text-sand-100/72">
                {tier.pitch}
              </p>

              <ul className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {tier.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sand-100/70"
                  >
                    <span
                      className={cn(
                        "block h-[6px] w-[6px] rounded-full",
                        tier.accent === "oxblood"
                          ? "bg-oxblood-300"
                          : "bg-sand-300/60",
                      )}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {tier.value === "member" && (
                <p className="mt-5 inline-block rounded-full border border-sand-100/15 bg-void-900/40 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-sand-100/55">
                  Stripe still in verification — your spot is held.
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Tiny step dots ───────────────────────────────────────────────────────

function StepDots({ step }: { step: 0 | 1 }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1].map((i) => (
        <span
          key={i}
          className={cn(
            "block h-[6px] rounded-full transition-all duration-400",
            i === step ? "w-7 bg-oxblood-300" : "w-[6px] bg-sand-100/25",
          )}
        />
      ))}
    </div>
  );
}
