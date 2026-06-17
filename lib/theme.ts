// ─────────────────────────────────────────────────────────────────────────
// Theme system — three values: "dark" (default), "light", "system".
// Resolved theme is what's actually applied to <html data-theme="…">.
// User preference is what they picked (or "system" = follow OS).
// ─────────────────────────────────────────────────────────────────────────

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "di-theme-v1";

/**
 * Inline script body, stringified for use in next/script `beforeInteractive`.
 * Reads localStorage / system preference and sets `data-theme` on <html>
 * before paint so there's no flash of wrong-theme content.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var pref = stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    var resolved =
      pref === "system"
        ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
        : pref;
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.dataset.themePref = pref;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;
