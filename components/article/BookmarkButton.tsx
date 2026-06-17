"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { auth } from "@/lib/auth/store";
import { toggleBookmark } from "@/app/withdepth/[slug]/actions";

type Props = {
  slug: string;
  initialBookmarked: boolean;
  signedIn: boolean;
  className?: string;
};

export function BookmarkButton({
  slug,
  initialBookmarked,
  signedIn,
  className,
}: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!signedIn) {
      auth.open("bookmark");
      return;
    }
    const optimistic = !bookmarked;
    setBookmarked(optimistic);
    startTransition(async () => {
      const res = await toggleBookmark(slug);
      if (!res.ok) {
        setBookmarked(!optimistic);
        if (res.reason === "unauthenticated") auth.open("bookmark");
        return;
      }
      if (typeof res.bookmarked === "boolean") {
        setBookmarked(res.bookmarked);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer disabled:opacity-60",
        bookmarked
          ? "border-[color:var(--accent)]/50 bg-[color:var(--accent-tint)] text-[color:var(--fg)]"
          : "border-[var(--rule)] bg-[color:var(--bg-alt)] text-[color:var(--fg-2)] hover:border-[var(--rule-strong)] hover:text-[color:var(--fg)]",
        className,
      )}
    >
      <BookmarkIcon filled={bookmarked} />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
