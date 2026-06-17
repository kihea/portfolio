"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

type Props = {
  text: string;
  className?: string;
  /** Starts the scramble on mount (instead of only on hover). */
  autoStart?: boolean;
  /** Re-scramble on hover (default true). */
  hoverable?: boolean;
};

/**
 * Hover-once scramble. The animation fires a single time on pointer-enter,
 * then locks until pointer-leave. Leaving the element clears the lock so the
 * next entry can re-trigger it.
 */
export function TextScramble({
  text,
  className = "",
  autoStart = false,
  hoverable = true,
}: Props) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);
  // Locked between an `onPointerEnter` and the matching `onPointerLeave` — so
  // a single hover never re-fires the animation, even if the cursor jiggles
  // across child glyph boundaries.
  const lockedRef = useRef(false);

  // Keep the displayed text in sync with the source text (e.g. when the
  // parent flips it between two phrases) — but only when nothing is animating.
  useEffect(() => {
    if (!intervalRef.current) setDisplay(text);
  }, [text]);

  const scramble = useCallback(() => {
    frameRef.current = 0;
    const duration = Math.max(text.length * 3, 12);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / duration;
      const revealed = Math.floor(progress * text.length);
      const next = text
        .split("")
        .map((char, i) => {
          if (char === " " || char === "\n") return char;
          if (i < revealed) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setDisplay(next);
      if (frameRef.current >= duration) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplay(text);
      }
    }, 30);
  }, [text]);

  useEffect(() => {
    if (autoStart) scramble();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoStart, scramble]);

  const onEnter = () => {
    if (!hoverable) return;
    if (lockedRef.current) return;
    lockedRef.current = true;
    scramble();
  };

  const onLeave = () => {
    if (!hoverable) return;
    lockedRef.current = false;
  };

  return (
    <span
      className={className}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ display: "inline-block" }}
    >
      {display}
    </span>
  );
}
