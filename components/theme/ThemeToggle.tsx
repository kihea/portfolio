"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import {
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

/**
 * Compact dark/light toggle. Two-state for now (dark ↔ light); the
 * "system" preference is honored at boot via the inline script in
 * <head>, but the toggle just flips between explicit choices.
 *
 * The actual swap happens by setting `data-theme` on <html>; the CSS
 * variables in globals.css resolve to the right palette in either mode.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  const apply = (next: ResolvedTheme) => {
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.dataset.themePref = next satisfies ThemePreference;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode — ignore */
    }
    setTheme(next);
  };

  // Render a placeholder (matched dimensions) until mounted to avoid hydration
  // mismatch when the inline boot script picked the opposite of SSR's default.
  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rule)] bg-transparent",
          className,
        )}
      />
    );
  }

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => apply(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light" : "Switch to dark"}
      className={cn(
        "group relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--rule)] bg-transparent transition-colors hover:border-[var(--rule-strong)]",
        className,
      )}
    >
      <SunIcon
        className={cn(
          "absolute h-[14px] w-[14px] text-[color:var(--fg)] transition-all duration-300",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <MoonIcon
        className={cn(
          "absolute h-[14px] w-[14px] text-[color:var(--fg)] transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
