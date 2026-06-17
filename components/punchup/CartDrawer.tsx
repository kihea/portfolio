"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cart, useCart, cartSubtotal, cartCount, formatPrice } from "@/lib/cart";
import { getProduct } from "@/lib/punchup";
import { ProductGraphic } from "./ProductGraphic";
import { LiquidMetalCTA } from "./LiquidMetalCTA";
import { cn } from "@/lib/cn";

/**
 * Slide-out cart drawer. Reads from the module-level `cart` store via the
 * `useCart` hook. Locks page scroll while open and closes on Escape or on
 * backdrop click. Designed to feel hand-set: hard offset shadow, ink border,
 * mono labels, halftone wash, single volt CTA at the bottom.
 */
export function CartDrawer() {
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);

  // Body-scroll lock + Escape handler.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const subtotal = cartSubtotal(items);
  const count = cartCount(items);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-punch-ink/40 backdrop-blur-[2px]"
            onClick={() => cart.setOpen(false)}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Your cart"
            aria-modal="true"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed right-0 top-0 z-[160] flex h-[100dvh] w-full max-w-[440px] flex-col border-l-2 border-punch-ink bg-punch-paper shadow-[-12px_0_0_0_var(--color-punch-ink)]"
          >
            {/* Header */}
            <div className="relative flex items-start justify-between border-b-2 border-punch-ink px-6 pb-5 pt-7">
              <div className="punch-halftone absolute inset-0 opacity-30" aria-hidden />
              <div className="relative">
                <div className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
                  <span className="block h-2 w-2 rounded-full bg-punch-blood" />
                  your cart
                </div>
                <div className="font-punch text-[2.4rem] uppercase leading-[0.9] tracking-[-0.02em] text-punch-ink">
                  {count === 0 ? "Empty" : `${count} item${count === 1 ? "" : "s"}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => cart.setOpen(false)}
                aria-label="Close cart"
                className="relative cursor-pointer border-2 border-punch-ink bg-punch-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink shadow-[3px_3px_0_0_var(--color-punch-ink)] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_var(--color-punch-ink)] active:scale-[0.97]"
              >
                Close ✕
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="font-punch text-[1.6rem] uppercase leading-[1] tracking-[-0.02em] text-punch-ink/80">
                  Nothing in here yet.
                </div>
                <p className="max-w-[28ch] font-body text-[14px] leading-[1.7] text-punch-ink/65">
                  Pick an argument worth wearing. The list is short on purpose.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-3">
                  <Link
                    href="/store/shirts"
                    onClick={() => cart.setOpen(false)}
                    className="border-2 border-punch-ink bg-punch-volt px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink shadow-[3px_3px_0_0_var(--color-punch-ink)] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_var(--color-punch-ink)]"
                  >
                    Shirts →
                  </Link>
                  <Link
                    href="/store/hoodies"
                    onClick={() => cart.setOpen(false)}
                    className="border-2 border-punch-ink bg-punch-paper px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink shadow-[3px_3px_0_0_var(--color-punch-ink)] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_var(--color-punch-ink)]"
                  >
                    Hoodies →
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const product = getProduct(item.slug);
                    return (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
                        className="mb-4 grid grid-cols-[88px_1fr_auto] gap-4 border-2 border-punch-ink bg-punch-paper p-3 shadow-[4px_4px_0_0_var(--color-punch-ink)]"
                      >
                        <Link
                          href={`/store/${item.category}/${item.slug}`}
                          onClick={() => cart.setOpen(false)}
                          className="block w-[88px] cursor-pointer"
                          aria-label={`Open ${item.name}`}
                        >
                          {product && (
                            <div className="border-2 border-punch-ink">
                              <ProductGraphic product={product} />
                            </div>
                          )}
                        </Link>
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/store/${item.category}/${item.slug}`}
                            onClick={() => cart.setOpen(false)}
                            className="font-punch text-[15px] uppercase leading-[1] tracking-[-0.01em] text-punch-ink hover:text-punch-blood"
                          >
                            {item.name}
                          </Link>
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink/55">
                            size · {item.size}
                          </div>
                          <div className="mt-auto flex items-center gap-1.5">
                            <QtyButton
                              label="−"
                              ariaLabel="Decrease quantity"
                              onClick={() => cart.setQty(item.id, item.qty - 1)}
                            />
                            <span className="min-w-[24px] text-center font-mono text-[12px] tabular-nums text-punch-ink">
                              {item.qty}
                            </span>
                            <QtyButton
                              label="+"
                              ariaLabel="Increase quantity"
                              onClick={() => cart.setQty(item.id, item.qty + 1)}
                            />
                            <button
                              type="button"
                              onClick={() => cart.remove(item.id)}
                              className="ml-3 cursor-pointer font-mono text-[9px] uppercase tracking-[0.18em] text-punch-ink/55 transition-colors hover:text-punch-blood"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between text-right">
                          <span className="font-punch text-[18px] leading-[1] tracking-[-0.01em] text-punch-ink">
                            {formatPrice(item.price * item.qty)}
                          </span>
                          {item.qty > 1 && (
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-punch-ink/45">
                              {formatPrice(item.price)} ea
                            </span>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}

            {/* Footer */}
            <div className="relative border-t-2 border-punch-ink px-6 pb-7 pt-5">
              <div className="punch-halftone absolute inset-0 opacity-25" aria-hidden />
              <div className="relative">
                <ul className="mb-5 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-punch-ink/65">
                  <li className="flex justify-between">
                    <span>subtotal</span>
                    <span className="text-punch-ink">{formatPrice(subtotal)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>shipping</span>
                    <span className="text-punch-ink/55">at checkout</span>
                  </li>
                  <li className="flex items-baseline justify-between border-t border-punch-ink/25 pt-2 font-punch text-[16px] tracking-[-0.01em] text-punch-ink">
                    <span>total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </li>
                </ul>

                <div className={cn("flex flex-col gap-2", items.length === 0 && "opacity-40 pointer-events-none")}>
                  <LiquidMetalCTA tone="ink" onClick={() => alert("Checkout coming soon — wire to Stripe / Shopify next.")}>
                    Checkout
                  </LiquidMetalCTA>
                  <button
                    type="button"
                    onClick={() => cart.clear()}
                    className="cursor-pointer self-center font-mono text-[10px] uppercase tracking-[0.2em] text-punch-ink/55 transition-colors hover:text-punch-blood"
                  >
                    Clear cart
                  </button>
                </div>

                <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-punch-ink/45">
                  Workers paid first. Numbered runs. No tail.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function QtyButton({
  label,
  ariaLabel,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-7 w-7 cursor-pointer items-center justify-center border-2 border-punch-ink bg-punch-paper font-punch text-[14px] leading-none text-punch-ink shadow-[2px_2px_0_0_var(--color-punch-ink)] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--color-punch-ink)] active:scale-[0.94]"
    >
      {label}
    </button>
  );
}
