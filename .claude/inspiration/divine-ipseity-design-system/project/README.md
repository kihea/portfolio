# Divine Ipseity — Design System

> *Preserving the human race by dismantling the systems that put production above personhood.*

This design system houses the visual, verbal, and component language of **Divine Ipseity** — a philosophical and political brand for young adults inheriting a broken system. It is the operating manual for any artifact made under the Divine Ipseity master brand or its four sub‑lines.

## Source materials

This system was built from a single source document: **`uploads/Business Model.md`** — a brand strategy memo prepared for Kihea Adams‑Wilson (April 22, 2026). No codebase, Figma file, or screenshots were provided. The visual decisions in this system are *derived* from the strategy memo and explicit user direction (notably: "oxblood red, but brighter / less murky and muted"); they are recommendations, not pre‑existing brand artifacts.

> **For the reader without access to the source memo:** the strategy document defines the master brand (Divine Ipseity), four sub‑brands, target audience (18–32, leftist‑leaning, philosophically curious), archetype pair (Outlaw–Everyman primary, Sage–Magician secondary), voice (prophetic‑but‑patient), and a recommended visual direction (oxblood + ink + ivory; serif‑forward; wordmark‑first; anonymous creator). All of those are summarized below where relevant.

## Brand architecture

```
                       DIVINE  IPSEITY
              (master — philosophy, umbrella identity)
                              │
   ┌────────────────┬─────────┴─────────┬─────────────────┐
   │                │                   │                 │
PUNCHUP         WITHDEPTH         FACTION OF TRUTH    SYSTEMATIC SINS
(apparel,       (essays, video,   (community,         (recurring
 physical)       cohorts)          membership)         content series)
```

| Sub‑brand | Function | Voice |
|---|---|---|
| **Divine Ipseity** | Umbrella, manifestos, the about page | Sage–Magician |
| **PunchUp** | T‑shirts, hoodies, patches, posters — the revenue engine | Outlaw, riso‑punk |
| **WithDepth** | Long‑form essays, video, eventual courses | Sage, patient |
| **Faction of Truth** | Tiered community, reading groups, members area | Everyman, peer |
| **Systematic Sins** | Numbered content series naming systemic failures | Outlaw, prophetic |

## Index

```
README.md                     ← you are here
SKILL.md                      ← skill manifest (cross‑compatible with Claude Code)
colors_and_type.css           ← all color + type tokens
fonts/                        ← Google Fonts loader (no licensed binaries on disk)
assets/
  logos/                      ← wordmarks, sigil sketches, sub‑brand marks
  patterns/                   ← textures, riso grain, woodcut motifs
  imagery/                    ← placeholder full‑bleeds, archival stand‑ins
preview/                      ← Design System tab cards (registered assets)
ui_kits/
  divine-ipseity-web/         ← marketing site + about/manifesto
  withdepth-reader/           ← essay reader (Substack‑style)
  punchup-shop/               ← apparel store
slides/                       ← sample slide templates (16:9)
uploads/Business Model.md     ← original strategy memo (source of truth)
```

---

## CONTENT FUNDAMENTALS

Voice is **prophetic‑but‑patient**: prophetic in the Old‑Testament sense — naming what is, demanding change — never the televangelist sense. Patient in the philosopher's sense — willing to show the work, willing to be wrong, willing to let the reader arrive at the conclusion themselves.

### Pronouns & person
- **"You."** Used to address the reader directly, often at the start of a piece. *"You already know something is wrong."*
- **"We."** The brand voice is collective, even when one person writes it. The brand is anonymous; "we" is structural, not affected.
- **"They."** Reserved for systems and the ruling class — never the working class. *"They built a market for your attention."*
- **Avoid "I."** The creator is anonymous. The voice is the brand, not a person. (Exception: rare first‑person process notes signed "the editor.")

### Casing
- **Sentence case** for headlines. *"How the middle class was manufactured."*
- **Title Case** only for proper sub‑brand names: *Divine Ipseity, PunchUp, WithDepth, Faction of Truth, Systematic Sins*.
- **ALL CAPS** sparingly — only for series labels (`SYSTEMATIC SIN №07`) and apparel graphics.
- Numbers: prefer numerals over words past nine; use **№** (numero) before series numbers, not `#`.

### Punctuation & rhythm
- Em‑dashes are part of the voice — used as the strategy doc does, to graft a clarification onto a claim without breaking the sentence's prophetic rhythm.
- Bible‑adjacent cadence is allowed. *"Are you not exhausted?"* lands. *"Tired? Same!"* does not.
- Citations live in the running prose. Show the book. Link the study. Quote the source.

### What we don't do
- **No emoji.** None. Emoji are the visual vocabulary of the platforms we critique.
- **No engagement bait.** No "Like if you agree." No cliffhanger hooks that punish readers for wanting context.
- **No rage‑bait.** Sharp on systems, warm on people.
- **No corporate softening.** Don't say "challenges" when you mean "extraction."
- **No "amazing/awesome/insane."** Adjectives must earn their place.

### Tone reference — examples (drawn directly from the strategy memo, except where marked)

> "Are you not exhausted?"
> "Definition is limitation. Be unlimited."
> "We help young adults who sense the system is failing them but can't name how."
> "Warmth toward individuals, sharpness toward systems."

Bad — would never ship:
> ~~"Hey friends 👋 quick thread on why capitalism is kinda broken lol"~~
> ~~"5 mind‑blowing facts about late‑stage capitalism (you won't believe №3)"~~

### Series naming
Numbered series carry the № prefix and a colon‑separated subject:
> *SYSTEMATIC SIN №07 — The myth of the ethical landlord*
> *WITHDEPTH №14 — Marx vs. Lenin, what each actually said*

---

## VISUAL FOUNDATIONS

The brand is anonymous, so the visual system has to do the work a face usually does. Everything below is engineered for **fluency = trust**: same aspect ratios, same margin rules, same type stack across every artifact, so a reader recognizes a Divine Ipseity piece in half a second.

### Color
A disciplined three‑color palette plus one accent.

- **Oxblood** `#B11226` — primary. Brightened from traditional oxblood per user direction; vivid enough to read on a screen, classical enough to feel like a printed pamphlet. Used for marks, key callouts, drop caps, sub‑brand stripes.
- **Ink** `#181412` — warm near‑black. Body text, rules, fine line work. Never pure `#000`.
- **Ivory** `#F4ECDA` — primary background. Warm, slightly aged paper; never pure white.
- **Bone** `#E8DEC6` — secondary surface, dividers, subtle cards.
- **Sand dollar** `#D9B98A` — *the only accent.* Reserved for the master Divine Ipseity mark and the manifesto. Sub‑brands do not use it.
- **Foxing** `#7A0E1F` — deeper oxblood for hovers, pressed states, dark mode primary.
- **Char** `#3D332D` — secondary text, muted captions.

There is **no blue, no green, no purple** in the system. Color discipline is part of the brand. Sub‑brand differentiation comes from typography and density, not new hues.

### Type stack
Serif‑forward. The body is set in a humanist serif because the brand is descended from books, not from product UI.

- **Display / wordmark**: *EB Garamond* (700 italic for the master wordmark, 400 for headlines). Wide tracking on small caps.
- **Body serif**: *EB Garamond* 400/500 — long‑form essays.
- **Sans (UI, captions, metadata)**: *Public Sans* 400/500/600 — quiet, governmental, the voice of receipts and footnotes.
- **Mono (citations, code, technical asides)**: *IBM Plex Mono* 400.
- **Blackletter (Systematic Sins masthead ONLY)**: *Pirata One* — modern blackletter, cleaner edges, used at large sizes, never for running text.

> ⚠ **Font substitution flag:** No proprietary font files were provided. Every face above is loaded from Google Fonts and is the *closest free match* to the strategy memo's intent. If you want a more distinctive wordmark, replace EB Garamond with a licensed face (e.g. GT Sectra, Tiempos Headline, or Söhne for sans) and drop the `.ttf`/`.woff2` files into `fonts/`. The strategy memo originally suggested Playfair Display + Inter — both are deliberately **not** used here: Inter is on the project's avoid list, and Playfair is overused in the genre.

### Spacing
A 4 px base. Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Body line‑length capped at **62ch** for essays — the strategy memo's prose is meant to breathe.

### Backgrounds
- **Default surface is ivory paper, not white.** Most layouts are a single ivory plane.
- **No gradient backgrounds.** None. (Gradient is the vocabulary of SaaS, which is what we are not.)
- **Optional grain overlay**: a low‑opacity riso‑print grain (`assets/patterns/grain.svg`) at ~3% opacity multiplied over hero blocks. Off by default.
- **Full‑bleed photography** is rare and reserved for archival imagery (woodcut, public‑domain protest photography, scanned book pages). When used, photography is **monochromed in oxblood + ivory** — a duotone — never full‑color. Warm, slightly over‑exposed, never glossy or stocky.
- **Repeating motifs**: a hand‑drawn radial sand‑dollar emblem (master brand only) and a small "PunchUp fist" mark for the apparel arm.

### Borders, rules, and dividers
- Hairline rules: **1 px** ink, 60% opacity. Used between essay sections and at the foot of the page (like a printed broadsheet).
- Heavier rules: **2 px** oxblood, used as a sub‑brand stripe across the top of any sub‑brand artifact.
- **No rounded containers larger than 4 px radius.** Cards, fields, and buttons get *zero radius* by default; small UI chrome (badges, pills) may go up to 4 px. Tall radii are SaaS body‑language and read wrong on this brand.

### Shadows & elevation
- **No drop shadows on cards by default.** Elevation is communicated by paper texture and a 1 px ink rule, not by Material‑style blurred shadow.
- One permitted shadow: a small `0 1px 0 0 ink/8%` "engraved" rule under the master wordmark on dark surfaces.
- Inner shadows are **never** used.

### Hover, press, focus states
- **Hover**: oxblood text shifts to *foxing* (`#7A0E1F`); underline appears at 1 px, 2 px below baseline. No color fades.
- **Press**: 2 % darken filter on the whole hit‑area, no scale transform. Feels like pressing a stamp.
- **Focus**: 2 px oxblood outline, 2 px offset. No glow.
- Sub‑brand surfaces (PunchUp) may use a stronger press: a 1 px translate down‑right, like a wood‑block stamp landing.

### Animation
- **Easing**: prefer `cubic-bezier(0.2, 0.7, 0.2, 1)` ("editorial ease" — slow start, settled finish). 220–360 ms range.
- **Fades**, not bounces. Things appear, they do not arrive.
- **No spring physics.** No parallax. No scroll‑hijack.
- Page transitions are static — the brand's pace is reading pace.
- One signature motion: a **drop‑cap slow reveal** on the first letter of a long‑form essay (350 ms fade + 4 px translate up).

### Transparency & blur
- **No backdrop blur.** None. (Blur is iOS chrome; we are paper.)
- Transparency only for: paper grain overlays, hairline rules, photo duotone overlays.

### Imagery vibe
- **Warm**, slightly **over‑exposed**, **archival**.
- Color treatment: duotone oxblood + ivory, or pure black on ivory.
- Subjects: hands, crowds, books, chairs, machines — *people in their work*, never product shots, never lifestyle, never AI illustration.
- A small **grain pass** is mandatory on photographic imagery so it sits flush with the paper plane.

### Layout rules
- **Left‑aligned text only.** Centered text is reserved for the master wordmark and section titles.
- One column for essays, capped at 62ch.
- Two‑column for product surfaces; three columns only for shop grids.
- The sub‑brand stripe (2 px oxblood) sits at the **top** of every artifact and runs the full bleed.
- The master wordmark sits **bottom‑left** in the footer of every artifact, set in EB Garamond italic at small caps.

### Cards
- Ivory background, 1 px ink rule (60% opacity), 0 px radius, 0 elevation.
- Hover: rule darkens to 100% opacity. No transform.
- Press: 1 px ink translate down‑right (PunchUp surfaces only).

---

## ICONOGRAPHY

Iconography on this brand is **typographic and woodcut‑adjacent**, not the SaaS‑standard Lucide line‑icon vocabulary. The brand is descended from printed pamphlets, broadsheets, and political posters.

### Approach
- **Most "icons" are typographic.** A § for sections, a ¶ for paragraphs, a № for series numbers, an em‑dash for separators. The character set itself is the icon set.
- **Custom SVG sigils** for the brand marks only — wordmark, sand‑dollar emblem, PunchUp fist. These are stored in `assets/logos/` and were drawn for this system; they are placeholders meant to be replaced by a designer's final marks.
- **Functional UI icons** (close, search, menu, cart for PunchUp shop, etc.) are loaded from **Lucide** via CDN — chosen for its 1.5 px stroke and minimal personality. Lucide is a *substitution* — when the user produces a custom icon set this should be replaced. The substitution is documented in `assets/icons/README.md`.
- **No emoji.** Anywhere. (Emoji belong to the platforms we critique.)
- **No flag, hammer, or fist emoji as a fallback.** When a fist is needed, use the PunchUp fist SVG.
- **Unicode marks** used as ornament: ¶ § † ‡ № ※ ☞ — the editorial register. These are part of the brand's quiet vocabulary.

### What lives in `assets/`
- `logos/divine-ipseity-wordmark.svg` — the master wordmark
- `logos/sand-dollar.svg` — accent emblem (master brand only)
- `logos/punchup-fist.svg` — PunchUp sub‑brand mark
- `logos/withdepth-mark.svg` — WithDepth sub‑brand mark
- `logos/systematic-sins-tag.svg` — series tag, blackletter
- `logos/faction-of-truth-mark.svg` — Faction of Truth seal
- `patterns/grain.svg` — riso grain overlay
- `patterns/rule-ornament.svg` — editorial fleuron
- `imagery/` — duotone photo placeholders (slot in real archival imagery)

---

## File index (manifest)

| File | What it is |
|---|---|
| `README.md` | This document — brand context + content + visual + iconography |
| `SKILL.md` | Skill manifest (cross-compatible with Claude Code Agent Skills) |
| `colors_and_type.css` | All design tokens — colors, type, spacing, motion |
| `assets/logos/` | Master wordmark, sand-dollar, PunchUp fist, sub-brand marks (SVG) |
| `assets/imagery/` | Duotone placeholder photography (replace with real archival) |
| `assets/patterns/` | Riso grain, editorial fleuron |
| `assets/icons/README.md` | Lucide CDN policy + substitution flag |
| `preview/` | 25 design-system cards rendered in the Design System tab |
| `ui_kits/divine-ipseity-web/` | Marketing site (Header, Hero, EssayList, Subscribe, Manifesto, Archive, Faction, Shop) |
| `ui_kits/withdepth-reader/` | Long-form essay reader (drop cap, footnotes, pull-quote, sources) |
| `ui_kits/punchup-shop/` | Apparel store (numbered drop, grid, cart drawer) |
| `uploads/Business Model.md` | Source strategy memo |

## How to use this system

1. Always start from `colors_and_type.css` — never invent new colors.
2. Match the voice rules in CONTENT FUNDAMENTALS exactly. No emoji, no engagement bait, no "I."
3. Use the sub‑brand stripe + bottom‑left wordmark on every artifact. That's the recognition pattern.
4. When in doubt, choose **paper over screen** — fewer shadows, fewer animations, more rule.

— *Definition is limitation. Be unlimited.*
