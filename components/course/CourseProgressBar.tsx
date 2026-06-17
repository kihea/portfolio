type Props = {
  completed: number;
  total: number;
  className?: string;
};

export function CourseProgressBar({ completed, total, className = "" }: Props) {
  if (total === 0 || completed === 0) return null;
  const pct = Math.min(100, Math.round((completed / total) * 100));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[color:var(--rule)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--accent)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
        {completed}/{total}
      </span>
    </div>
  );
}
