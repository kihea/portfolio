"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Article title — used for the X/Twitter share intent text. */
  title: string;
  /** Absolute URL of the page being shared. */
  url: string;
  /** When provided (e.g. from the highlight toolbar), shows a "Copy passage" option. */
  passage?: string;
  /** Extra classes on the trigger button. */
  className?: string;
};

type CopyState = "idle" | "link" | "passage";

export function ShareDialog({ title, url, passage, className }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<CopyState>("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click-outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const copyToClipboard = async (text: string, kind: CopyState) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied("idle"), 2200);
    } catch {
      window.prompt("Copy this:", text);
    }
  };

  const xShareUrl =
    `https://twitter.com/intent/tweet?` +
    `text=${encodeURIComponent(`"${title}"`)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Share this essay"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-2)] transition-colors hover:border-[var(--rule-strong)] hover:text-[color:var(--fg)] cursor-pointer",
          open && "border-[var(--rule-strong)] text-[color:var(--fg)]",
          className,
        )}
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Share options"
          className="absolute left-0 top-full z-50 mt-2 w-[220px] overflow-hidden rounded-[12px] border border-[var(--rule-strong)] bg-[color:var(--bg-alt)] shadow-[var(--card-shadow)]"
        >
          {/* Panel header */}
          <div className="border-b border-[var(--rule)] px-4 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
              Share
            </span>
          </div>

          <div className="p-2">
            {/* Copy link */}
            <ShareRow
              icon={<LinkIcon />}
              label={copied === "link" ? "Copied" : "Copy link"}
              active={copied === "link"}
              onClick={() => copyToClipboard(url, "link")}
            />

            {/* Copy passage — only shown when a selection was passed in */}
            {passage && (
              <ShareRow
                icon={<PassageIcon />}
                label={copied === "passage" ? "Copied" : "Copy passage"}
                active={copied === "passage"}
                onClick={() => copyToClipboard(`"${passage}"\n\n— ${url}`, "passage")}
              />
            )}

            {/* Post to X */}
            <ShareRow
              icon={<XIcon />}
              label="Post to X"
              onClick={() => {
                window.open(xShareUrl, "_blank", "noopener,noreferrer");
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Row sub-component ────────────────────────────────────────────────────────

function ShareRow({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors cursor-pointer",
        active
          ? "text-[color:var(--accent)] bg-[color:var(--accent-tint)]"
          : "text-[color:var(--fg-2)] hover:bg-[color:var(--bg-deep)] hover:text-[color:var(--fg)]",
      )}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-70">
        {icon}
      </span>
      {label}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function PassageIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18M3 12h12M3 18h8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
