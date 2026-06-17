"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/auth/store";
import { createComment } from "@/app/writing/[slug]/comment-actions";

type Props = {
  slug: string;
  signedIn: boolean;
  isMember: boolean;
};

const BODY_MAX = 4000;

export function CommentCompose({ slug, signedIn, isMember }: Props) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <div className="rounded-[20px] border border-[var(--rule)] bg-[color:var(--bg-alt)] p-6">
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
          <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
          Want to weigh in?
        </div>
        <p className="mb-5 max-w-[52ch] font-body text-[15px] leading-[1.7] text-[color:var(--fg-2)]">
          Comments belong to Faction members. Sign in, or join — same door.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => auth.open("comment")}
            className="btn-primary btn-sm cursor-pointer"
          >
            Sign in
          </button>
          <Link
            href="/faction"
            className="btn-ghost btn-sm cursor-pointer"
          >
            About the Faction →
          </Link>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="rounded-[20px] border border-[var(--rule)] bg-[color:var(--bg-alt)] p-6">
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
          <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
          Members say their piece
        </div>
        <p className="mb-5 max-w-[52ch] font-body text-[15px] leading-[1.7] text-[color:var(--fg-2)]">
          You&rsquo;re in. The discussion is open to Faction members — $8 a month.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/faction/checkout"
            className="btn-primary btn-sm cursor-pointer"
          >
            Join the Faction →
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!body.trim()) return;
    startTransition(async () => {
      const res = await createComment(slug, body);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setBody("");
    });
  };

  const remaining = BODY_MAX - body.length;
  const overLimit = remaining < 0;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[20px] border border-[var(--rule)] bg-[color:var(--bg-alt)] p-5"
    >
      <label htmlFor="comment-body" className="sr-only">
        Comment
      </label>
      <textarea
        id="comment-body"
        rows={4}
        maxLength={BODY_MAX + 200}
        placeholder="Say something specific."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={isPending}
        className="w-full resize-y rounded-2xl border border-[var(--rule)] bg-[color:var(--bg-deep)] px-4 py-3 font-body text-[15px] leading-[1.7] text-[color:var(--fg)] placeholder:text-[color:var(--fg-3)] focus:border-[color:var(--accent)]/55 focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)]/35 disabled:opacity-60"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            overLimit ? "text-[color:var(--accent)]" : "text-[color:var(--fg-3)]"
          }`}
        >
          {body.length} / {BODY_MAX}
        </span>
        <button
          type="submit"
          disabled={isPending || !body.trim() || overLimit}
          className="btn-primary btn-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Posting…" : "Post"}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--accent)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
