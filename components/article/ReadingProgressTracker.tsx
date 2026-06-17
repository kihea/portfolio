"use client";

import { useEffect, useRef, useState } from "react";
import { saveReadingProgress } from "@/app/withdepth/[slug]/actions";

type Props = {
  slug: string;
  /** True when a session exists. Anonymous reads still get localStorage. */
  signedIn: boolean;
  /** Server-rendered initial scroll % so we can restore on mount. */
  initialPct?: number;
};

const STORAGE_KEY = "divine-reading-progress-v1";
const SAVE_INTERVAL_MS = 5_000;
const MIN_DELTA_PCT = 4;

type LocalProgress = Record<string, { pct: number; at: number }>;

function readLocal(): LocalProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalProgress) : {};
  } catch {
    return {};
  }
}

function writeLocal(slug: string, pct: number) {
  if (typeof window === "undefined") return;
  try {
    const all = readLocal();
    all[slug] = { pct, at: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* quota — ignore */
  }
}

/**
 * Tracks how far the user has scrolled through this essay and persists the
 * deepest position. Two paths:
 *
 *   - signed in: throttled `saveReadingProgress` Server Action call (max 1
 *     save per ~5s while scrolling), plus a final save on `pagehide`,
 *     `visibilitychange:hidden`, and unmount.
 *   - signed out: localStorage only.
 *
 * Bug fix vs v1: the previous implementation cleared a debounced timer on
 * every scroll event, so continuous scrolling never produced a save until
 * the user paused for 5+ seconds. The new flow is a real time-window
 * throttle — at most one save per window — which guarantees forward
 * progress writes during continuous scroll.
 *
 * On mount: scrolls to the user's last position if depth ≥ 15% and < 95%.
 */
export function ReadingProgressTracker({
  slug,
  signedIn,
  initialPct,
}: Props) {
  const lastSavedRef = useRef(initialPct ?? 0);
  const deepestRef = useRef(initialPct ?? 0);
  const lastSaveTimeRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [restored, setRestored] = useState(false);

  // ── Restore on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (restored) return;
    let pct = initialPct ?? 0;
    if (!signedIn) {
      const local = readLocal()[slug];
      if (local) pct = local.pct;
    }
    if (pct >= 15 && pct < 95) {
      const target = Math.round(
        (document.documentElement.scrollHeight - window.innerHeight) *
          (pct / 100),
      );
      // Defer to the next frame so layout has settled.
      requestAnimationFrame(() =>
        window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior }),
      );
    }
    deepestRef.current = pct;
    lastSavedRef.current = pct;
    setRestored(true);
  }, [slug, signedIn, initialPct, restored]);

  // ── Track scroll, persist on a real throttle ──────────────────────────
  useEffect(() => {
    const computePct = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.max(
        0,
        Math.min(100, Math.round((window.scrollY / max) * 100)),
      );
    };

    const flush = () => {
      const value = deepestRef.current;
      if (value <= lastSavedRef.current) return;
      lastSavedRef.current = value;
      lastSaveTimeRef.current = Date.now();
      writeLocal(slug, value);
      if (signedIn) {
        // Fire-and-forget — failures are non-fatal.
        saveReadingProgress(slug, value).catch(() => {});
      }
    };

    const onScroll = () => {
      const pct = computePct();
      if (pct > deepestRef.current) {
        deepestRef.current = pct;
      }
      if (pct - lastSavedRef.current < MIN_DELTA_PCT) return;

      const now = Date.now();
      const elapsed = now - lastSaveTimeRef.current;
      if (elapsed >= SAVE_INTERVAL_MS) {
        // Throttle window passed — flush immediately.
        flush();
        return;
      }

      // Inside the window — schedule a single trailing save when the window
      // expires. If a timer is already armed, leave it alone.
      if (idleTimerRef.current) return;
      idleTimerRef.current = setTimeout(() => {
        idleTimerRef.current = null;
        flush();
      }, SAVE_INTERVAL_MS - elapsed);
    };

    // Final-flush handlers — make sure the last position lands on disk
    // even if the throttle window hadn't expired yet.
    const finalFlush = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      flush();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") finalFlush();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", finalFlush);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", finalFlush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Best-effort flush on unmount (route nav).
      finalFlush();
    };
  }, [slug, signedIn]);

  return null;
}
