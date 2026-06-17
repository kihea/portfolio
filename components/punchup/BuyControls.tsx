"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidMetalCTA } from "./LiquidMetalCTA";
import { cart, formatPrice } from "@/lib/cart";
import type { PunchProduct } from "@/lib/punchup";
import { cn } from "@/lib/cn";

type Props = {
  product: PunchProduct;
  sizes: string[];
};

/**
 * Interactive buy panel — the only client island on the product page.
 * Owns size selection, quantity, and the add-to-cart action. Posts a
 * short confirmation toast inside the panel; the global cart drawer
 * (driven by the same store) opens at the same time.
 */
export function BuyControls({ product, sizes }: Props) {
  const [size, setSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [shake, setShake] = useState(0);

  const onAdd = () => {
    if (!size) return;
    cart.add({
      id: `${product.slug}--${size}`,
      slug: product.slug,
      name: product.name,
      category: product.category,
      size,
      price: product.price,
      qty,
    });
    setJustAdded(true);
    setShake((s) => s + 1);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <>
      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
            size
          </span>
          {sizes.length > 1 && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink/50">
              fits boxy
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = s === size;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={active}
                className={cn(
                  "min-w-[3rem] cursor-pointer border-2 border-punch-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all",
                  active
                    ? "bg-punch-ink text-punch-paper shadow-[5px_5px_0_0_var(--color-punch-volt)]"
                    : "bg-punch-paper text-punch-ink shadow-[3px_3px_0_0_var(--color-punch-ink)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_var(--color-punch-ink)]",
                  "active:scale-[0.97]",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-punch-ink/65">
          quantity
        </div>
        <div className="inline-flex items-center gap-1.5 border-2 border-punch-ink bg-punch-paper p-1 shadow-[3px_3px_0_0_var(--color-punch-ink)]">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 cursor-pointer items-center justify-center font-punch text-[16px] leading-none text-punch-ink hover:bg-punch-volt active:scale-[0.94]"
          >
            −
          </button>
          <span className="min-w-[28px] text-center font-mono text-[13px] tabular-nums text-punch-ink">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            aria-label="Increase quantity"
            className="flex h-9 w-9 cursor-pointer items-center justify-center font-punch text-[16px] leading-none text-punch-ink hover:bg-punch-volt active:scale-[0.94]"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-7 relative">
        <motion.div
          key={shake}
          animate={shake ? { x: [0, -6, 6, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <LiquidMetalCTA tone="volt" onClick={onAdd}>
            Add to cart · {formatPrice(product.price * qty)}
          </LiquidMetalCTA>
        </motion.div>

        <AnimatePresence>
          {justAdded && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="absolute -top-9 left-0 inline-flex items-center gap-2 border-2 border-punch-ink bg-punch-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink shadow-[3px_3px_0_0_var(--color-punch-blood)]"
            >
              <span className="block h-2 w-2 rounded-full bg-punch-blood" />
              added · size {size}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => cart.setOpen(true)}
        className="mt-3 cursor-pointer font-mono text-[10px] uppercase tracking-[0.2em] text-punch-ink/55 transition-colors hover:text-punch-ink"
      >
        View cart →
      </button>
    </>
  );
}
