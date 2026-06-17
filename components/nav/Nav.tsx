"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links: { href: string; label: string; hard?: boolean }[] = [
  { href: "/writing", label: "Writing" },
  { href: "/learn", label: "Tessera", hard: true },
  { href: "/portfolio", label: "Portfolio" },
];

export function Nav() {
  const pathname = usePathname();
  // PunchUp store owns its own light-mode chrome.
  if (pathname?.startsWith("/store")) return null;
  return <NavInner />;
}

function NavInner() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
            "pointer-events-auto flex items-center justify-between rounded-full",
            "border border-[var(--rule)] backdrop-blur-xl",
            "bg-[color-mix(in_oklab,var(--bg)_72%,transparent)]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.20)]",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled
              ? "w-full max-w-[820px] px-3 py-2"
              : "w-full max-w-[1180px] px-4 py-3 md:px-6",
          )}
        >
          <Link
            href="/"
            className="px-2 py-1 font-display italic text-[18px] tracking-tight text-[color:var(--fg)] transition-opacity hover:opacity-70 md:text-[20px]"
          >
            Divine Ipseity
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) =>
              l.hard ? (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-4 py-2 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)] transition-colors hover:text-[color:var(--fg)]"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-4 py-2 font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)] transition-colors hover:text-[color:var(--fg)]"
                >
                  {l.label}
                </Link>
              ),
            )}
            <ThemeToggle className="ml-2" />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex flex-col gap-[5px] p-2"
            >
              <span
                className={cn(
                  "block h-[1.5px] w-5 bg-[color:var(--fg)] transition-transform duration-300",
                  open && "translate-y-[6.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-5 bg-[color:var(--fg)] transition-transform duration-300",
                  open && "-translate-y-[6.5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </nav>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[95] flex flex-col gap-0 bg-[color-mix(in_oklab,var(--bg)_95%,transparent)] px-7 pb-8 pt-28 backdrop-blur-l transition-opacity duration-500",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        {links.map((l) =>
          l.hard ? (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--rule)] py-5 font-display italic text-3xl text-[color:var(--fg)] transition-colors hover:text-[color:var(--fg-2)]"
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--rule)] py-5 font-display italic text-3xl text-[color:var(--fg)] transition-colors hover:text-[color:var(--fg-2)]"
            >
              {l.label}
            </Link>
          ),
        )}
      </div>
    </>
  );
}
