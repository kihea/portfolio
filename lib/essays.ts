import fs from "fs";
import path from "path";

export type Essay = {
  slug: string;
  issue: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
  tag: string;
  /** Optional pull-quote displayed above the body on the detail page. */
  pullQuote?: string;
  /** Optional header image path (relative to /public). */
  image?: string;
  /** Body paragraphs. Strings prefixed "## " render as h2; "---" renders a divider. */
  body: string[];
};

// ─── Frontmatter parser ───────────────────────────────────────────────────────
// Reads YAML-ish key: "value" pairs between --- delimiters. Handles single- and
// double-quoted values; unquoted values are taken as-is. No multi-line support.
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
// Reads all .md files in lib/EssayMarkdown/, parses frontmatter, sorts by the
// `order` field. To add a new essay: create a .md file with frontmatter.
export const essays: Essay[] = (() => {
  const dir = path.join(process.cwd(), "lib", "EssayMarkdown");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const loaded = files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      if (!meta.slug) return null;
      return {
        slug: meta.slug,
        issue: meta.issue ?? "",
        date: meta.date ?? "",
        read: meta.read ?? "",
        title: meta.title ?? "",
        excerpt: meta.excerpt ?? "",
        tag: meta.tag ?? "",
        pullQuote: meta.pullQuote || undefined,
        image: meta.image || undefined,
        _order: parseInt(meta.order ?? "999", 10),
        body: parseBody(body),
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  loaded.sort((a, b) => a._order - b._order);

  return loaded.map(({ _order, ...e }) => e as Essay);
})();

export function getEssay(slug: string): Essay | undefined {
  return essays.find((e) => e.slug === slug);
}
