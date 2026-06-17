"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth/store";
import { markModuleComplete, unmarkModuleComplete } from "@/app/learn/[slug]/[module]/actions";

type Props = {
  courseSlug: string;
  moduleSlug: string;
  initialCompleted: boolean;
  signedIn: boolean;
};

export function ModuleCompleteButton({
  courseSlug,
  moduleSlug,
  initialCompleted,
  signedIn,
}: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = () => {
    if (!signedIn) {
      auth.open("default");
      return;
    }

    const optimistic = !completed;
    setCompleted(optimistic);

    startTransition(async () => {
      const res = optimistic
        ? await markModuleComplete(courseSlug, moduleSlug)
        : await unmarkModuleComplete(courseSlug, moduleSlug);

      if (!res.ok) {
        setCompleted(!optimistic); // revert
        if (res.reason === "unauthenticated") auth.open("default");
        return;
      }

      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={completed}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer disabled:opacity-60 ${
        completed
          ? "border-[color:var(--accent)]/50 bg-[color:var(--accent-tint)] text-[color:var(--fg)]"
          : "border-[var(--rule)] bg-[color:var(--bg-alt)] text-[color:var(--fg-2)] hover:border-[var(--rule-strong)] hover:text-[color:var(--fg)]"
      }`}
    >
      {completed ? <CheckIcon /> : <CircleIcon />}
      <span>{completed ? "Completed" : "Mark complete"}</span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
