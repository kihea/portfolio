import Link from "next/link";
import type { Course } from "@/lib/courses";

type Props = {
  course: Course;
  currentModuleSlug: string;
  completedSlugs: string[];
  canAccess: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  read: "Read",
  reflect: "Reflect",
  excerpt: "Excerpt",
  video: "Watch",
  quiz: "Quiz",
};

export function CourseProgressSidebar({
  course,
  currentModuleSlug,
  completedSlugs,
  canAccess,
}: Props) {
  const completedSet = new Set(completedSlugs);
  const progress = Math.round((completedSlugs.length / course.moduleCount) * 100);

  return (
    <aside className="hidden w-[240px] shrink-0 lg:block">
      <div className="sticky top-28">
        {/* Course title */}
        <div className="mb-5">
          <Link
            href={`/learn/${course.slug}`}
            className="mb-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--accent)] hover:text-[color:var(--fg)] transition-colors cursor-pointer"
          >
            ← Back to course
          </Link>
          <p className="font-display italic text-[color:var(--fg)] text-[13px] leading-[1.3]">
            {course.title}
          </p>
        </div>

        {/* Progress bar */}
        {completedSlugs.length > 0 && (
          <div className="mb-5">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[color:var(--rule)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--accent)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
              {completedSlugs.length}/{course.moduleCount} complete
            </p>
          </div>
        )}

        {/* Module list */}
        <ol className="space-y-1">
          {course.modules.map((mod, i) => {
            const isCurrent = mod.slug === currentModuleSlug;
            const isCompleted = completedSet.has(mod.slug);
            const isAccessible = canAccess || mod.preview;

            return (
              <li key={mod.slug}>
                {isAccessible ? (
                  <Link
                    href={`/learn/${course.slug}/${mod.slug}`}
                    className={`group flex items-start gap-2.5 rounded-[8px] px-3 py-2 transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-[color:var(--accent-tint)] text-[color:var(--fg)]"
                        : "text-[color:var(--fg-2)] hover:bg-[color:var(--bg-alt)] hover:text-[color:var(--fg)]"
                    }`}
                  >
                    <span className={`mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[7px] ${
                      isCompleted
                        ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                        : isCurrent
                        ? "border-[color:var(--fg)] text-[color:var(--fg)]"
                        : "border-[var(--rule)] text-[color:var(--fg-3)]"
                    }`}>
                      {isCompleted ? "✓" : String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-body text-[11.5px] leading-[1.4]">{mod.title}</p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--fg-3)] mt-0.5">
                        {TYPE_LABELS[mod.type]} · {mod.duration}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-start gap-2.5 rounded-[8px] px-3 py-2 opacity-40">
                    <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-[color:var(--fg-3)]">
                      <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-body text-[11.5px] leading-[1.4] text-[color:var(--fg-2)]">{mod.title}</p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--fg-3)] mt-0.5">
                        {TYPE_LABELS[mod.type]} · {mod.duration}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
