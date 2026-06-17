"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth/store";
import { replyToThread } from "../actions";

const BODY_MAX = 8000;

type Props = {
  threadId: string;
  signedIn: boolean;
  isMember: boolean;
};

export function ReplyForm({ threadId, signedIn, isMember }: Props) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Two non-member states get their own inline panels rather than a form.
  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-sand-100/12 bg-white/[0.03] px-5 py-6 text-center">
        <p className="font-display italic text-sand-100/85 text-[clamp(1.05rem,1.8vw,1.25rem)]">
          The room is open to members.
        </p>
        <p className="mt-2 max-w-[40ch] mx-auto font-body text-[14px] leading-[1.7] text-sand-100/65">
          Sign in to reply. Reading is open to anyone.
        </p>
        <button
          type="button"
          onClick={() => auth.open("forum")}
          className="btn-primary btn-sm mt-5 inline-flex"
        >
          Sign in
        </button>
      </div>
    );
  }
  if (!isMember) {
    return (
      <div className="rounded-2xl border border-sand-100/12 bg-white/[0.03] px-5 py-6 text-center">
        <p className="font-display italic text-sand-100/85 text-[clamp(1.05rem,1.8vw,1.25rem)]">
          Members reply here.
        </p>
        <p className="mt-2 max-w-[44ch] mx-auto font-body text-[14px] leading-[1.7] text-sand-100/65">
          You can read every thread without joining. Replying is open to active
          Faction members.
        </p>
        <Link href="/faction" className="btn-primary btn-sm mt-5 inline-flex">
          Join the Faction
        </Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 1) {
      setError("Reply can't be empty.");
      return;
    }
    setError(null);
    const fd = new FormData();
    fd.set("body", body.trim());
    startTransition(async () => {
      const res = await replyToThread(threadId, fd);
      if (!res.ok) {
        setError(res.message ?? "Couldn't post reply.");
        return;
      }
      setBody("");
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-sand-300/65">
        Reply
      </div>
      <textarea
        maxLength={BODY_MAX}
        required
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add to it."
        className="w-full resize-y rounded-2xl border border-sand-100/14 bg-void-900/50 px-5 py-4 font-body text-[15px] leading-[1.75] text-sand-100 placeholder:text-sand-100/30 focus:border-oxblood-300/60 focus:outline-none focus:ring-1 focus:ring-oxblood-300/40"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[9.5px] tabular-nums text-sand-100/40">
          {body.length}/{BODY_MAX}
        </div>
        {error && (
          <p
            role="alert"
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-oxblood-300/95"
          >
            {error}
          </p>
        )}
        <button type="submit" disabled={isPending} className="btn-primary btn-sm">
          {isPending ? "Posting…" : "Post reply"}
        </button>
      </div>
    </form>
  );
}
