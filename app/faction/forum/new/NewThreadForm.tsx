"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createThread } from "../actions";

const TITLE_MAX = 140;
const BODY_MAX = 8000;

export function NewThreadForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3 || body.trim().length < 1) {
      setError("Title needs at least 3 characters; the body can't be empty.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("body", body.trim());
    startTransition(async () => {
      const res = await createThread(fd);
      // createThread redirect()s on success — we only see this branch on
      // failure since redirect throws.
      if (res && !res.ok) {
        setError(res.message ?? "Couldn't post. Try again in a moment.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <div>
        <label
          htmlFor="thread-title"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-sand-100/55"
        >
          Title
        </label>
        <input
          id="thread-title"
          type="text"
          maxLength={TITLE_MAX}
          autoFocus
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's this thread about?"
          className="w-full rounded-2xl border border-sand-100/14 bg-void-900/50 px-5 py-4 font-display italic text-[20px] text-sand-100 placeholder:text-sand-100/30 focus:border-oxblood-300/60 focus:outline-none focus:ring-1 focus:ring-oxblood-300/40"
        />
        <div className="mt-1.5 text-right font-mono text-[9.5px] tabular-nums text-sand-100/40">
          {title.length}/{TITLE_MAX}
        </div>
      </div>

      <div>
        <label
          htmlFor="thread-body"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-sand-100/55"
        >
          Body
        </label>
        <textarea
          id="thread-body"
          maxLength={BODY_MAX}
          required
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the argument. Cite a source if you can."
          className="w-full resize-y rounded-2xl border border-sand-100/14 bg-void-900/50 px-5 py-4 font-body text-[15.5px] leading-[1.75] text-sand-100 placeholder:text-sand-100/30 focus:border-oxblood-300/60 focus:outline-none focus:ring-1 focus:ring-oxblood-300/40"
        />
        <div className="mt-1.5 text-right font-mono text-[9.5px] tabular-nums text-sand-100/40">
          {body.length}/{BODY_MAX}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-oxblood-300/95"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
        >
          {isPending ? "Posting…" : "Post thread"}
        </button>
        <Link href="/faction/forum" className="btn-ghost btn-sm">
          Cancel
        </Link>
      </div>
    </form>
  );
}
