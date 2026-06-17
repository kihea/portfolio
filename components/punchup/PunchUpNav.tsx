"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { cart, useCart, cartCount } from "@/lib/cart";

const links = [
  { href: "/store/shirts", label: "Shirts" },
  { href: "/store/hoodies", label: "Hoodies" },
  { href: "/store/patches", label: "Patches" },
];

export function PunchUpNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed left-0 right-0 z-[100] flex justify-center px-3 md:px-6",
          "transition-[top] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "top-3" : "top-5",
        )}
      >
        <nav
          className={cn(
            "pointer-events-auto flex items-center justify-between border-2 border-punch-ink bg-punch-paper",
            "shadow-[6px_6px_0_0_var(--color-punch-ink)]",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled
              ? "w-full max-w-[820px] px-3 py-2"
              : "w-full max-w-[1180px] px-4 py-3 md:px-6",
          )}
        >
          <Link
            href="/store"
            className="flex items-center gap-2 px-2 py-1 transition-opacity hover:opacity-70"
          >
            {/* Glove glyph */}
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center border-2 border-punch-ink bg-punch-volt font-punch text-[14px] text-punch-ink"
            >
              ✊
            </span>
            <span className="font-punch text-[18px] uppercase tracking-tight text-punch-ink md:text-[20px]">
              PunchUp
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-punch-ink/55 md:inline">
              · by Divine Ipseity
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink/65 transition-colors hover:text-punch-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="ml-1 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-punch-ink/65 transition-colors hover:text-punch-ink"
            >
              ← Divine Ipseity
            </Link>
            <button
              type="button"
              onClick={() => cart.setOpen(true)}
              className="relative ml-2 inline-flex cursor-pointer items-center gap-2 border-2 border-punch-ink bg-punch-volt px-4 py-2 font-punch text-[10px] uppercase tracking-[0.18em] text-punch-ink shadow-[3px_3px_0_0_var(--color-punch-ink)] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_var(--color-punch-ink)] active:scale-[0.97]"
              aria-label={`View cart, ${count} items`}
            >
              <span aria-hidden>⌗</span>
              Cart · {count}
              {count > 0 && (
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-punch-ink bg-punch-blood font-mono text-[9px] font-bold text-punch-paper shadow-[1.5px_1.5px_0_0_var(--color-punch-ink)]"
                >
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile cart button — sits next to hamburger */}
          <button
            type="button"
            aria-label={`View cart, ${count} items`}
            onClick={() => cart.setOpen(true)}
            className="relative ml-auto mr-2 inline-flex cursor-pointer items-center gap-1.5 border-2 border-punch-ink bg-punch-volt px-3 py-1.5 font-punch text-[10px] uppercase tracking-[0.16em] text-punch-ink shadow-[2px_2px_0_0_var(--color-punch-ink)] md:hidden"
          >
            <span aria-hidden>⌗</span>
            {count}
          </button>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex flex-col gap-[5px] p-2 md:hidden"
          >
            <span
              className={cn(
                "block h-[2px] w-5 bg-punch-ink transition-transform duration-300",
                open && "translate-y-[6.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-[2px] w-5 bg-punch-ink transition-transform duration-300",
                open && "-translate-y-[6.5px] -rotate-45",
              )}
            />
          </button>
        </nav>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[95] flex flex-col gap-0 bg-punch-paper px-7 pb-8 pt-28 transition-opacity duration-500",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="border-b-2 border-punch-ink py-5 font-punch text-3xl uppercase tracking-tight text-punch-ink"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-punch-ink/65"
        >
          ← Back to Divine Ipseity
        </Link>
      </div>
    </>
  );
}
