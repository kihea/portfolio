"use client";

import { useSyncExternalStore } from "react";

// ─────────────────────────────────────────────────────────────────────────
// Auth modal store — module-level state + a useSyncExternalStore hook.
// Mirrors the pattern in lib/cart.ts. The modal can be opened from any
// client component (nav, comment box, "Begin" button, etc.) by calling
// `auth.open(reason)`.
// ─────────────────────────────────────────────────────────────────────────

export type AuthOpenReason =
  | "begin"
  | "comment"
  | "subscribe"
  | "tip"
  | "bookmark"
  | "forum"
  | "default";

export type AuthState = {
  open: boolean;
  reason: AuthOpenReason;
};

let state: AuthState = { open: false, reason: "default" };
const listeners = new Set<() => void>();

function setState(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export const auth = {
  open(reason: AuthOpenReason = "default") {
    setState({ open: true, reason });
  },
  close() {
    setState({ open: false });
  },
};

const SERVER_SNAPSHOT: AuthState = { open: false, reason: "default" };

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useAuthModal<T>(selector: (s: AuthState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(SERVER_SNAPSHOT),
  );
}
