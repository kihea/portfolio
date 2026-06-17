"use client";

import { useSyncExternalStore } from "react";
import type { PunchProduct } from "./punchup";

// ─────────────────────────────────────────────────────────────────────────
// Cart store — module-level state + a useSyncExternalStore hook. Persists
// to localStorage. Intentionally tiny: no Zustand, no Context. Components
// subscribe via `useCart(selector)`; mutations go through the `cart` API.
// ─────────────────────────────────────────────────────────────────────────

export type CartItem = {
  /** Composite id = `${slug}--${size}` so size variants are separate lines. */
  id: string;
  slug: string;
  name: string;
  category: PunchProduct["category"];
  size: string;
  price: number;
  qty: number;
};

export type CartState = {
  items: CartItem[];
  /** Drawer open/closed. */
  open: boolean;
};

const STORAGE_KEY = "punchup-cart-v1";

let state: CartState = { items: [], open: false };
const listeners = new Set<() => void>();

let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const items: CartItem[] = JSON.parse(raw);
      if (Array.isArray(items)) {
        state = { items, open: false };
      }
    }
  } catch {
    /* ignore — bad JSON or quota */
  }
  // Notify subscribers once so SSR placeholders update with hydrated state.
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    /* ignore */
  }
}

function setState(next: Partial<CartState> | ((s: CartState) => CartState)) {
  state = typeof next === "function" ? next(state) : { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

// ─────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────

export const cart = {
  add(input: Omit<CartItem, "qty"> & { qty?: number }) {
    const qty = input.qty ?? 1;
    setState((s) => {
      const existing = s.items.find((i) => i.id === input.id);
      if (existing) {
        return {
          ...s,
          items: s.items.map((i) =>
            i.id === input.id ? { ...i, qty: i.qty + qty } : i,
          ),
          open: true,
        };
      }
      return {
        ...s,
        items: [...s.items, { ...input, qty }],
        open: true,
      };
    });
  },
  remove(id: string) {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
  },
  setQty(id: string, qty: number) {
    if (qty <= 0) {
      cart.remove(id);
      return;
    }
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    }));
  },
  clear() {
    setState((s) => ({ ...s, items: [] }));
  },
  setOpen(open: boolean) {
    setState((s) => ({ ...s, open }));
  },
  toggle() {
    setState((s) => ({ ...s, open: !s.open }));
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────

const SERVER_SNAPSHOT: CartState = { items: [], open: false };

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useCart<T>(selector: (s: CartState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(SERVER_SNAPSHOT),
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Derived helpers
// ─────────────────────────────────────────────────────────────────────────

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function formatPrice(usd: number) {
  return `$${usd.toFixed(usd % 1 === 0 ? 0 : 2)}`;
}
