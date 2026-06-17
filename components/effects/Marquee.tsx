interface MarqueeProps {
  items: string[];
  divider?: string;
  className?: string;
}

export function Marquee({ items, divider = "·", className = "" }: MarqueeProps) {
  const repeated = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-flex animate-marquee">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 font-heading text-[10px] tracking-[0.28em] uppercase text-[color:var(--fg-2)]"
          >
            {item}
            <span className="text-[var(--accent)]" aria-hidden>
              {divider}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
