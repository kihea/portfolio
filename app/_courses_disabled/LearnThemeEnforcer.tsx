"use client";

import { useEffect } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Forces the /learn subtree into light mode on mount.
 * Restores the user's stored preference (or "dark" default) on unmount,
 * so navigating away from /learn reverts the theme correctly.
 */
export function LearnThemeEnforcer() {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.dataset.theme ?? "dark";

    // Override to light for /learn
    html.dataset.theme = "light";

    return () => {
      // Restore whatever the user actually had set
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        html.dataset.theme = stored ?? previous;
      } catch {
        html.dataset.theme = previous;
      }
    };
  }, []);

  return null;
}
