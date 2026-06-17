export function SectionMarker({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div
      className="pointer-events-none absolute top-[clamp(3rem,6vw,5rem)] left-[clamp(1rem,2.5vw,2rem)] z-20 hidden lg:flex flex-col items-start gap-3"
      aria-hidden
    >
      <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--accent)]">
        .{number}
      </span>
      <span className="mt-1 font-heading text-[8.5px] uppercase tracking-[0.32em] text-[color:var(--fg-3)] [writing-mode:vertical-rl] [transform:rotate(180deg)]">
        {label}
      </span>
    </div>
  );
}
