---
name: divine-ipseity-design
description: Use this skill to generate well-branded interfaces and assets for Divine Ipseity, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **Brand** Divine Ipseity — philosophical/political publishing project; anonymous creator; sub-brands PunchUp (apparel), WithDepth (essays), Faction of Truth (community), Systematic Sins (content series).
- **Tokens** `colors_and_type.css` — every artifact should `@import` it before its own styles.
- **Palette** Oxblood `#B11226` · Ink `#181412` · Ivory `#F4ECDA` · Bone `#E8DEC6` · Sand-dollar `#D9B98A` (master only). No blue, no green, no purple. Ever.
- **Type** EB Garamond (display + body), Public Sans (UI), IBM Plex Mono (citations), Pirata One (Systematic Sins masthead only). All Google-Fonts, flagged for substitution with licensed faces.
- **Voice** Prophetic-but-patient. Second person, "we" not "I", no emoji, no engagement bait, sharp on systems / warm on people. See README → CONTENT FUNDAMENTALS.
- **Visual cues** 2 px oxblood stripe top of every artifact · italic Divine Ipseity wordmark bottom-left · zero radius on cards/buttons · paper not material (no shadows) · duotone imagery only.

## Files in this skill

- `README.md` — full brand guide
- `colors_and_type.css` — tokens
- `assets/logos/` — wordmarks + sub-brand marks (SVG)
- `assets/imagery/` — duotone placeholders
- `assets/patterns/` — grain, fleuron
- `assets/icons/README.md` — Lucide CDN substitution policy
- `ui_kits/divine-ipseity-web/` — marketing site
- `ui_kits/withdepth-reader/` — long-form essay reader
- `ui_kits/punchup-shop/` — apparel store
- `preview/` — design-system tab cards (don't edit; reference only)
- `uploads/Business Model.md` — original strategy memo (source of truth)
