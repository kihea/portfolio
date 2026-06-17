import Link from "next/link";
import type { CourseModule } from "@/lib/courses";

type Props = {
  modules: CourseModule[];
  courseSlug: string;
  canAccess: boolean;
  completedSlugs: string[];
};

const TYPE_LABELS: Record<string, string> = {
  read: "Read",
  reflect: "Reflect",
  excerpt: "Excerpt",
  video: "Watch",
  quiz: "Quiz",
};

export function ModuleList({ modules, courseSlug, canAccess, completedSlugs }: Props) {
  const completedSet = new Set(completedSlugs);

  return (
    <ol className="divide-y divide-[var(--rule)]">
      {modules.map((mod, i) => {
        const isAccessible = canAccess || mod.preview;
        const isCompleted = completedSet.has(mod.slug);
        const href = `/learn/${courseSlug}/${mod.slug}`;

        return (
          <li
            key={mod.slug}
            className={`grid grid-cols-[32px_1fr_auto] items-start gap-4 py-4 transition-colors ${
              isCompleted ? "bg-[color:var(--accent-tint)]" : ""
            } ${!isAccessible ? "opacity-50" : ""}`}
          >
            {/* Order number / checkmark */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[color:var(--bg-alt)]">
              {isCompleted ? (
                <CheckIcon />
              ) : (
                <span className="font-mono text-[10px] text-[color:var(--fg-3)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Title + meta */}
            <div>
              {isAccessible ? (
                <Link
                  href={href}
                  className="group block cursor-pointer"
                >
                  <span className="font-body text-[14.5px] text-[color:var(--fg)] leading-[1.4] group-hover:text-[color:var(--accent)] transition-colors">
                    {mod.title}
                  </span>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-full border border-[var(--rule)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                      {TYPE_LABELS[mod.type] ?? mod.type}
                    </span>
                    {mod.preview && (
                      <span className="inline-block rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent-tint)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
                        Preview
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div>
                  <span className="flex items-center gap-2 font-body text-[14.5px] text-[color:var(--fg-2)] leading-[1.4]">
                    <LockIcon />
                    {mod.title}
                  </span>
                  <div className="mt-1">
                    <span className="inline-block rounded-full border border-[var(--rule)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
                      {TYPE_LABELS[mod.type] ?? mod.type}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <span className="shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--fg-3)]">
              {mod.duration}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--accent)]" aria-label="Completed">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 opacity-50">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
