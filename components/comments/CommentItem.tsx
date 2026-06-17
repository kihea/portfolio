"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateComment,
  deleteComment,
} from "@/app/withdepth/[slug]/comment-actions";

type Props = {
  slug: string;
  comment: {
    id: string;
    body: string;
    displayName: string | null;
    createdAt: string;
    isEdited: boolean;
    isOwner: boolean;
  };
};

const BODY_MAX = 4000;

export function CommentItem({ slug, comment }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSaveEdit = () => {
    setError(null);
    if (!draft.trim() || draft.trim() === comment.body.trim()) {
      setEditing(false);
      setDraft(comment.body);
      return;
    }
    startTransition(async () => {
      const res = await updateComment(comment.id, draft, slug);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEditing(false);
    });
  };

  const onDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteComment(comment.id, slug);
      if (!res.ok) {
        setError(res.error);
        setConfirmDelete(false);
      }
    });
  };

  const dateString = new Date(comment.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <li className="rounded-[18px] border border-[var(--rule)] bg-[color:var(--bg-alt)] p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={comment.displayName} />
          <div className="flex flex-col">
            <span className="font-display italic text-[color:var(--fg)] text-[15px] leading-[1.2]">
              {comment.displayName ?? "Anonymous"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-3)]">
              {dateString}
              {comment.isEdited && (
                <span className="ml-2 text-[color:var(--fg-3)]/60">· edited</span>
              )}
            </span>
          </div>
        </div>

        {comment.isOwner && !editing && !confirmDelete && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--fg-3)] transition-colors hover:border-[var(--rule)] hover:text-[color:var(--fg)]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--fg-3)] transition-colors hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]"
            >
              Delete
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <textarea
              rows={3}
              maxLength={BODY_MAX + 200}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={isPending}
              className="w-full resize-y rounded-xl border border-[var(--rule)] bg-[color:var(--bg-deep)] px-3 py-2.5 font-body text-[14.5px] leading-[1.7] text-[color:var(--fg)] focus:border-[color:var(--accent)]/55 focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)]/35 disabled:opacity-60"
            />
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setDraft(comment.body);
                  setError(null);
                }}
                disabled={isPending}
                className="cursor-pointer rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-3)] hover:text-[color:var(--fg)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSaveEdit}
                disabled={isPending}
                className="cursor-pointer rounded-full border border-[var(--rule)] bg-[color:var(--bg)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg)] transition-colors hover:border-[var(--rule-strong)] disabled:opacity-50"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </motion.div>
        ) : confirmDelete ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent-tint)] p-4"
          >
            <p className="mb-3 font-body text-[14px] leading-[1.6] text-[color:var(--fg)]">
              Delete this comment? This is permanent.
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={isPending}
                className="cursor-pointer rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-3)] hover:text-[color:var(--fg)] disabled:opacity-50"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isPending}
                className="cursor-pointer rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent-tint)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--accent)] hover:bg-[color:var(--accent)]/20 disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-pre-wrap font-body text-[15px] leading-[1.78] text-[color:var(--fg-2)]"
          >
            {comment.body}
          </motion.p>
        )}
      </AnimatePresence>

      {error && (
        <p
          role="alert"
          className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--accent)]"
        >
          {error}
        </p>
      )}
    </li>
  );
}

function Avatar({ name }: { name: string | null }) {
  const initials = (name ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase() || "?";
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rule)] bg-[color:var(--bg-deep)] font-display italic text-[14px] text-[color:var(--fg)]"
    >
      {initials}
    </span>
  );
}
