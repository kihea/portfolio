# Icons

Functional UI icons in this system are loaded from **Lucide** via CDN — `https://unpkg.com/lucide-static@latest/icons/<name>.svg` — chosen for its hairline (1.5 px) stroke, consistent geometry, and minimal personality. Lucide is appropriate for the brand's quiet UI surfaces.

## ⚠ Substitution flag

Lucide is a **substitution** for a custom icon set. The brand's intended iconography is woodcut‑adjacent, typographic, and printed‑pamphlet in feel — Lucide does the *opposite* of that personality. We use it because:

1. No custom icon set was provided.
2. Hand‑rolling SVG icons in this system would be worse than Lucide.
3. Most UI surfaces in this system rely on **typographic ornaments** (§, ¶, †, ‡, №, ※) instead of icons whenever possible.

Replace Lucide with a custom set as soon as a designer is engaged.

## Allowed Lucide icons

Use sparingly. Approved for the existing UI kits:

| Icon | Usage |
|---|---|
| `menu` | Mobile nav |
| `x` | Close / dismiss |
| `search` | Site/shop search |
| `arrow-right` | "Read on" / pagination |
| `arrow-up-right` | External link |
| `shopping-bag` | PunchUp cart |
| `book-open` | WithDepth essay marker |
| `users` | Faction of Truth member icon |
| `mail` | Newsletter subscribe |
| `rss` | Feed link |
| `quote` | Pull‑quote opener (used very rarely; prefer typographic " ") |

## Forbidden in this brand

- Emoji of any kind.
- Filled, rounded, "playful" icons (Hugeicons, Phosphor Fill, etc.).
- Multi‑color or gradient icons.
- The fist emoji ✊ — when a fist is needed, use `assets/logos/punchup-fist.svg`.

## Usage example

```html
<img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg"
     width="16" height="16" alt="" style="filter: brightness(0);" />
```

In React, prefer `lucide-react` if the project supports it, with `strokeWidth={1.5}`.
