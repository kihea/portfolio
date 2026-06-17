import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseTag  = "Systems" | "Philosophy" | "Identity" | "Community" | "Founding";
export type CourseTier = "free" | "member";
export type ModuleType = "read" | "reflect" | "excerpt" | "video" | "quiz";

export type QuizQuestion = {
  question: string;
  options: string[];
  /** Zero-based index into options[] indicating the correct answer. */
  correctIndex: number;
  /** Shown after the user submits an answer. */
  explanation?: string;
};

export type CourseModule = {
  /** Full filename minus .md, e.g. "01-what-is-a-system". Used in URLs. */
  slug: string;
  order: number;
  title: string;
  type: ModuleType;
  duration: string;
  /** true = accessible to non-members regardless of course tier */
  preview: boolean;
  pullQuote?: string;
  /** Markdown body paragraphs (read / reflect / video transcript / quiz intro) */
  body: string[];
  // excerpt-specific
  essaySlug?: string;
  excerptRange?: [number, number]; // [startIdx, endIdx] inclusive, paragraph indices
  // video-specific
  videoUrl?: string;
  // quiz-specific (loaded from sidecar <slug>.quiz.json)
  quiz?: QuizQuestion[];
};

export type Course = {
  slug: string;
  order: number;
  title: string;
  tag: CourseTag;
  tier: CourseTier;
  excerpt: string;
  /** Multi-paragraph prose from course.md body */
  description: string;
  duration: string;
  moduleCount: number;
  /** If true, displayed as FeaturedCourseHero at the top of /learn */
  featured: boolean;
  image?: string;
  outcomes: string[];
  modules: CourseModule[];
};

// ─── Parser (copied verbatim from lib/essays.ts) ──────────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const endIdx = raw.indexOf("\n---", 3);
  if (endIdx === -1) return { meta: {}, body: raw };

  const fmSection = raw.slice(3, endIdx).trim();
  const bodyRaw = raw.slice(endIdx + 4).trim();

  const meta: Record<string, string> = {};
  for (const line of fmSection.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
    }
    meta[key] = value;
  }

  return { meta, body: bodyRaw };
}

function parseBody(raw: string): string[] {
  return raw
    .split(/\r|\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0 && !block.startsWith("# "));
}

// ─── Auto-discovery ───────────────────────────────────────────────────────────

const COURSES_DIR = path.join(process.cwd(), "lib", "CourseMarkdown");

export const courses: Course[] = (() => {
  const entries = fs.readdirSync(COURSES_DIR, { withFileTypes: true });
  const courseDirs = entries.filter((e) => e.isDirectory());

  const loaded = courseDirs.map((dir) => {
    const courseDir = path.join(COURSES_DIR, dir.name);

    // ── Parse course.md ───────────────────────────────────────────────────────
    const courseRaw = fs.readFileSync(path.join(courseDir, "course.md"), "utf-8");
    const { meta: cm, body: courseBody } = parseFrontmatter(courseRaw);
    if (!cm.slug) return null;

    // ── Parse module files NN-*.md (sorted lexicographically) ────────────────
    const moduleFiles = fs
      .readdirSync(courseDir)
      .filter((f) => f.endsWith(".md") && f !== "course.md")
      .sort();

    const modules: CourseModule[] = moduleFiles.map((filename) => {
      const moduleRaw = fs.readFileSync(path.join(courseDir, filename), "utf-8");
      const { meta: mm, body: moduleBody } = parseFrontmatter(moduleRaw);

      const slug = filename.replace(/\.md$/, "");
      const orderMatch = slug.match(/^(\d+)/);
      const order = orderMatch ? parseInt(orderMatch[1], 10) : 99;
      const type = (mm.type ?? "read") as ModuleType;

      // Load quiz sidecar if present
      let quiz: QuizQuestion[] | undefined;
      if (type === "quiz") {
        const sidecarPath = path.join(courseDir, `${slug}.quiz.json`);
        if (fs.existsSync(sidecarPath)) {
          try {
            quiz = JSON.parse(fs.readFileSync(sidecarPath, "utf-8")) as QuizQuestion[];
          } catch { /* malformed sidecar — skip */ }
        }
      }

      // Parse excerptRange: "3,12" → [3, 12]
      let excerptRange: [number, number] | undefined;
      if (type === "excerpt" && mm.excerptRange) {
        const parts = mm.excerptRange.split(",").map((s) => parseInt(s.trim(), 10));
        if (parts.length === 2 && !parts.some(isNaN)) {
          excerptRange = [parts[0], parts[1]];
        }
      }

      return {
        slug,
        order,
        title: mm.title ?? "",
        type,
        duration: mm.duration ?? "",
        preview: mm.preview === "true",
        pullQuote: mm.pullQuote || undefined,
        body: parseBody(moduleBody),
        essaySlug: mm.essaySlug || undefined,
        excerptRange,
        videoUrl: mm.videoUrl || undefined,
        quiz,
      } satisfies CourseModule;
    });

    return {
      slug: cm.slug,
      _order: parseInt(cm.order ?? "999", 10),
      title: cm.title ?? "",
      tag: (cm.tag ?? "Systems") as CourseTag,
      tier: (cm.tier ?? "free") as CourseTier,
      excerpt: cm.excerpt ?? "",
      description: parseBody(courseBody).join("\n\n"),
      duration: cm.duration ?? "",
      moduleCount: modules.length,
      featured: cm.featured === "true",
      image: cm.image || undefined,
      outcomes: cm.outcomes
        ? cm.outcomes.split("|").map((s) => s.trim()).filter(Boolean)
        : [],
      modules,
    };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  loaded.sort((a, b) => a._order - b._order);

  return loaded.map(({ _order, ...c }) => c as Course);
})();

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCourseModule(
  courseSlug: string,
  moduleSlug: string,
): CourseModule | undefined {
  return getCourse(courseSlug)?.modules.find((m) => m.slug === moduleSlug);
}
