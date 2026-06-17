"use client";

import { cn } from "@/lib/cn";

type Props = {
  items: string[];
  divider?: string;
  className?: string;
  tone?: "ink" | "volt" | "blood" | "paper";
};

export function PunchTicker({
  items,
  divider = "✦",
  className,
  tone = "ink",
}: Props) {
  const repeated = [...items, ...items, ...items];
  const toneCls =
    tone === "volt"
      ? "bg-punch-volt text-punch-ink"
      : tone === "blood"
        ? "bg-punch-blood text-punch-paper"
        : tone === "paper"
          ? "bg-punch-paper text-punch-ink"
          : "bg-punch-ink text-punch-paper";
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y-2 border-punch-ink py-3",
        toneCls,
        className,
      )}
    >
      <div className="inline-flex animate-punch-ticker whitespace-nowrap">
        {repeated.map((p, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 font-punch text-[14px] uppercase tracking-[0.18em]"
          >
            {p}
            <span aria-hidden className="text-current opacity-70">
              {divider}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
