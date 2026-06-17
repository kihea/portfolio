"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Divider } from "@/components/sections/Divider";

// ─── Types ────────────────────────────────────────────────────────────────────

type Highlight = { id: string; text: string };
type ToolbarState = { text: string; x: number; y: number } | null;

type Props = {
  body: string[];
  essaySlug: string;
  articleUrl: string;
  essayTitle: string;
};

// ─── Markdown inline parser ───────────────────────────────────────────────────

function parseMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*{1,3}[^*]+\*{1,3})/g);
  return parts.map((part, i) => {
    if (/^\*\*\*(.+)\*\*\*$/.test(part))
      return <span key={i} style={{ fontWeight: "bold", fontStyle: "italic" }}>{part.slice(3, -3)}</span>;
    if (/^\*\*(.+)\*\*$/.test(part))
      return <span key={i} style={{ fontWeight: "bold" }}>{part.slice(2, -2)}</span>;
    if (/^\*(.+)\*$/.test(part))
      return <span key={i} style={{ fontStyle: "italic" }}>{part.slice(1, -1)}</span>;
    return part;
  });
}

// ─── Highlight-aware paragraph renderer ──────────────────────────────────────
// Searches for stored highlight strings in the raw paragraph text; wraps
// matches in <mark> before markdown parsing so bold/italic still resolves.

function renderParagraph(raw: string, highlights: Highlight[]): React.ReactNode {
  if (highlights.length === 0) return parseMarkdown(raw);

  // Build sorted, non-overlapping list of match ranges
  const ranges: { start: number; end: number; id: string }[] = [];
  for (const h of highlights) {
    let cursor = 0;
    while (cursor < raw.length) {
      const idx = raw.indexOf(h.text, cursor);
      if (idx === -1) break;
      ranges.push({ start: idx, end: idx + h.text.length, id: `${h.id}-${idx}` });
      cursor = idx + h.text.length;
    }
  }
  if (ranges.length === 0) return parseMarkdown(raw);

  ranges.sort((a, b) => a.start - b.start);

  // Split raw text into plain / highlighted segments
  const nodes: React.ReactNode[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start < pos) continue; // skip overlapping
    if (r.start > pos) nodes.push(...parseMarkdown(raw.slice(pos, r.start)));
    nodes.push(
      <mark
        key={r.id}
        className="rounded-[2px] bg-[color:var(--accent-tint)] px-[1px] text-[color:var(--fg)] not-italic"
      >
        {parseMarkdown(raw.slice(r.start, r.end))}
      </mark>,
    );
    pos = r.end;
  }
  if (pos < raw.length) nodes.push(...parseMarkdown(raw.slice(pos)));
  return nodes;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ArticleBody({ body, essaySlug, articleUrl, essayTitle }: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [toolbar, setToolbar] = useState<ToolbarState>(null);
  const [savedConfirm, setSavedConfirm] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  // Load saved highlights on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`highlights:${essaySlug}`);
      if (raw) setHighlights(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [essaySlug]);

  // Detect text selection
  useEffect(() => {
    const handleSelectionEnd = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setToolbar(null);
        return;
      }
      const text = sel.toString().trim();
      if (text.length < 3) { setToolbar(null); return; }

      const range = sel.getRangeAt(0);
      if (!articleRef.current?.contains(range.commonAncestorContainer)) {
        setToolbar(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      setToolbar({ text, x: rect.left + rect.width / 2, y: rect.top });
      setSavedConfirm(false);
    };

    document.addEventListener("mouseup", handleSelectionEnd);
    document.addEventListener("touchend", handleSelectionEnd);
    return () => {
      document.removeEventListener("mouseup", handleSelectionEnd);
      document.removeEventListener("touchend", handleSelectionEnd);
    };
  }, []);

  // ── Toolbar actions ──────────────────────────────────────────────────────

  const onShare = useCallback(async () => {
    if (!toolbar) return;
    const fragmentUrl =
      `${articleUrl}#:~:text=` + encodeURIComponent(toolbar.text.slice(0, 120));

    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: essayTitle, text: `"${toolbar.text}"`, url: fragmentUrl });
        setToolbar(null);
        return;
      } catch { /* cancelled */ }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`"${toolbar.text}"\n\n— ${fragmentUrl}`);
      setSavedConfirm(true);
      setTimeout(() => { setToolbar(null); setSavedConfirm(false); }, 1200);
    } catch {
      window.prompt("Copy this passage:", `"${toolbar.text}" — ${fragmentUrl}`);
    }
  }, [toolbar, articleUrl, essayTitle]);

  const onHighlight = useCallback(() => {
    if (!toolbar) return;
    const id = `h-${Date.now()}`;
    const updated: Highlight[] = [...highlights, { id, text: toolbar.text }];
    setHighlights(updated);
    try {
      localStorage.setItem(`highlights:${essaySlug}`, JSON.stringify(updated));
    } catch { /* quota exceeded */ }
    setSavedConfirm(true);
    setTimeout(() => { setToolbar(null); setSavedConfirm(false); }, 1000);
  }, [toolbar, highlights, essaySlug]);

  const onLookup = useCallback(() => {
    if (!toolbar) return;
    const query = toolbar.text.trim().split(/\s+/).slice(0, 8).join(" ");
    window.open(
      `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [toolbar]);

  return (
    <>
      <article
        ref={articleRef}
        id="essay-body"
        className="space-y-7 font-body text-[16.5px] leading-[1.85] text-[color:var(--fg-2)] md:text-[17px]"
      >
        {body.map((para, i) => {
          if (para.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="!mt-12 !mb-2 font-display italic font-medium text-[color:var(--fg)] leading-[1.2] tracking-[-0.015em] text-[clamp(1.4rem,2.4vw,28px)]"
              >
                {para.replace(/^##\s+/, "")}
              </h2>
            );
          }
          if (para === "---") return <Divider key={i} />;
          return (
            <p key={i} className="max-w-[68ch]">
              {renderParagraph(para, highlights)}
            </p>
          );
        })}
      </article>

      {/* Floating selection toolbar */}
      {toolbar && (
        <div
          role="toolbar"
          aria-label="Text actions"
          style={{
            position: "fixed",
            left: Math.max(80, Math.min(toolbar.x, window.innerWidth - 80)),
            top: toolbar.y - 50,
            transform: "translateX(-50%)",
            zIndex: 200,
            pointerEvents: "all",
          }}
          onMouseDown={(e) => e.preventDefault()} // keep selection alive
          className="flex items-center overflow-hidden rounded-[10px] border border-[var(--rule-strong)] bg-[color:var(--bg)] shadow-[var(--card-shadow)]"
        >
          <ToolbarBtn
            icon={<ShareIcon />}
            label={savedConfirm ? "Copied" : "Share"}
            onClick={onShare}
          />
          <Sep />
          <ToolbarBtn
            icon={<MarkIcon />}
            label={savedConfirm ? "Saved" : "Highlight"}
            onClick={onHighlight}
            active={savedConfirm}
          />
          <Sep />
          <ToolbarBtn icon={<SearchIcon />} label="Look up" onClick={onLookup} />
        </div>
      )}
    </>
  );
}

// ─── Toolbar sub-components ───────────────────────────────────────────────────

function Sep() {
  return <div className="h-5 w-px shrink-0 bg-[var(--rule)]" />;
}

function ToolbarBtn({
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
      className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors cursor-pointer whitespace-nowrap ${
        active
          ? "text-[color:var(--accent)] bg-[color:var(--accent-tint)]"
          : "text-[color:var(--fg-2)] hover:bg-[color:var(--bg-alt)] hover:text-[color:var(--fg)]"
      }`}
    >
      <span className="opacity-80">{icon}</span>
      {label}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function MarkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
