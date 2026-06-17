"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { auth, useAuthModal, type AuthOpenReason } from "@/lib/auth/store";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

const REASON_COPY: Record<AuthOpenReason, { eyebrow: string; headline: string; body: string }> = {
  begin: {
    eyebrow: "Begin",
    headline: "Get on the call list.",
    body: "We send a magic link — click it and you're in.",
  },
  comment: {
    eyebrow: "Sign in to comment",
    headline: "Members say their piece.",
    body: "Comments are open to Faction members. Sign in or join — same door.",
  },
  subscribe: {
    eyebrow: "Join the Faction",
    headline: "Get on the call list.",
    body: "We start with the magic link. The Faction tier comes after you confirm.",
  },
  tip: {
    eyebrow: "Tip the work",
    headline: "Sign in first, then tip.",
    body: "Optional, but it lets us thank you and keeps a private receipt for your records.",
  },
  bookmark: {
    eyebrow: "Save this essay",
    headline: "Sign in to save it.",
    body: "Bookmarks live with your account so you can find them later, on any device.",
  },
  forum: {
    eyebrow: "The Faction forum",
    headline: "Members only — sign in.",
    body: "Reading the forum is open to everyone. Posting and replying are member-only.",
  },
  default: {
    eyebrow: "Sign in",
    headline: "One link, one click.",
    body: "Enter your email; we send a one-time link that signs you in.",
  },
};

export function AuthModal() {
  const open = useAuthModal((s) => s.open);
  const reason = useAuthModal((s) => s.reason);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset state every time the modal closes.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Body-scroll lock + Esc to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") auth.close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const supabase = createClient();
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const copy = REASON_COPY[reason];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-void-900/70 backdrop-blur-sm"
            onClick={() => auth.close()}
            aria-hidden
          />

          <motion.div
            key="auth-panel"
            role="dialog"
            aria-modal="true"
            aria-label={copy.headline}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
            className="fixed left-1/2 top-1/2 z-[210] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="topo-overlay relative overflow-hidden rounded-[20px] border border-sand-100/12 bg-void-700/95 p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-9">
              <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[260px] w-[260px] rounded-full bg-oxblood-700/20 blur-[60px]" />

              <button
                type="button"
                onClick={() => auth.close()}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 cursor-pointer rounded-full border border-sand-100/15 bg-void-700/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-100/65 transition-colors hover:text-sand-100"
              >
                Esc
              </button>

              <div className="relative z-10">
                <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-oxblood-300/95">
                  <span className="block h-[3px] w-[3px] rounded-full bg-oxblood-300" />
                  {copy.eyebrow}
                </div>

                <h2 className="font-display italic font-light text-sand-100 leading-[1.05] tracking-[-0.02em] text-[clamp(1.6rem,3.2vw,2rem)]">
                  {copy.headline}
                </h2>

                <p className="mt-4 max-w-[42ch] font-body text-[14.5px] leading-[1.7] text-sand-100/70">
                  {copy.body}
                </p>

                {status !== "sent" ? (
                  <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3">
                    <label htmlFor="auth-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      required
                      autoComplete="email"
                      autoFocus
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "sending"}
                      className="w-full rounded-full border border-sand-100/15 bg-void-900/50 px-5 py-3.5 font-body text-[15px] text-sand-100 placeholder:text-sand-100/35 focus:border-oxblood-300/60 focus:outline-none focus:ring-1 focus:ring-oxblood-300/40 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={status === "sending" || !email}
                      className="cursor-pointer rounded-full border border-oxblood-300/30 bg-gradient-to-b from-oxblood-600 to-oxblood-800 px-6 py-3.5 font-heading text-[11px] uppercase tracking-[0.2em] text-sand-100 shadow-[0_4px_18px_rgba(107,30,30,0.35),inset_0_1px_0_rgba(255,255,255,0.10)] transition-all hover:from-oxblood-700 hover:to-oxblood-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                    >
                      {status === "sending" ? "Sending…" : "Send the link"}
                    </button>
                    {status === "error" && errorMsg && (
                      <p
                        role="alert"
                        className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-oxblood-300/95"
                      >
                        {errorMsg}
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="mt-7 rounded-2xl border border-sand-100/12 bg-void-900/40 p-5">
                    <div className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-sand-300/85">
                      <span className="block h-[6px] w-[6px] rounded-full bg-oxblood-300" />
                      Check your inbox
                    </div>
                    <p className="font-body text-[14px] leading-[1.7] text-sand-100/80">
                      We sent a sign-in link to <span className="text-sand-100">{email}</span>.
                      Click it from this device and you&apos;re in.
                    </p>
                  </div>
                )}

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-100/40">
                  Sign-in by email link only. The list is never sold.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
