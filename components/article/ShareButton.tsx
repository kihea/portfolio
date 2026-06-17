"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Title to use as the Web Share API subject. Falls back to clipboard copy. */
  title: string;
  /** Absolute URL of the page being shared. */
  url: string;
  className?: string;
};

/**
 * Share button. Uses the Web Share API on devices that support it (mobile
 * browsers, mostly), falls back to clipboard-copy with a 2-second toast on
 * desktop. Either path keeps the user on the page.
 */
export function ShareButton({ title, url, className }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (typeof navigator === "undefined") return;

    // Prefer Web Share API on devices that support it (mostly mobile).
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title, url });
        return;
      } catch {
        // User cancelled the share sheet — fall through is fine.
        return;
      }
    }

    // Desktop fallback: clipboard copy with a 2s confirmation.
    try {
      await nav.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Share this essay"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-sand-100/14 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-100/85 transition-colors hover:border-sand-100/30 hover:bg-white/[0.07] cursor-pointer",
        className,
      )}
    >
      <ShareIcon />
      <span>{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}

function ShareIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
