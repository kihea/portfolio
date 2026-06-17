// PunchUp catalog. Hand-curated, on-brand. Numbers and copy are placeholder
// where noted; structure is real and ready to wire to a backend later.

export type PunchProduct = {
  slug: string;
  name: string;
  category: "shirts" | "hoodies" | "patches";
  price: number; // USD, integer cents kept simple as whole dollars for now
  blurb: string;          // short one-line for cards
  description: string[];  // detail body paragraphs
  spec: { weight: string; fit: string; print: string; origin: string };
  // We don't have real photography yet; we render printed graphics in CSS so
  // the page works end-to-end without external assets.
  graphic: {
    headline: string;     // big front-print phrase
    sub?: string;         // smaller line under it
    bg: "paper" | "ink" | "volt" | "blood";
    fg: "ink" | "paper" | "volt" | "blood";
    accent?: "volt" | "blood";
    style?: "stamp" | "stencil" | "ribbon" | "bold-block";
  };
};

export type PunchCategory = {
  slug: "shirts" | "hoodies" | "patches";
  label: string;
  tagline: string;
  blurb: string;
};

export const categories: PunchCategory[] = [
  {
    slug: "shirts",
    label: "Shirts",
    tagline: "the t-shirt is the leaflet",
    blurb:
      "Heavyweight cotton. One color, one argument, printed at full chest. Built to be read across a room.",
  },
  {
    slug: "hoodies",
    label: "Hoodies",
    tagline: "the hood is the cover",
    blurb:
      "Brushed-fleece blanks, oversized. Back-print first, chest mark second. For the long walk and the long meeting.",
  },
  {
    slug: "patches",
    label: "Patches",
    tagline: "small flag, any jacket",
    blurb:
      "Sew-on, iron-on. Issued in numbered runs. The mark you put on something you already own.",
  },
];

export const products: PunchProduct[] = [
  // ── Shirts ──
  {
    slug: "punch-up-tee",
    name: "Punch Up Tee",
    category: "shirts",
    price: 38,
    blurb: "The flag tee. Front of house.",
    description: [
      "The phrase comes from the brand: it is so easy to punch down. This goes the other direction.",
      "Printed at full chest in a single dense run so it survives a hundred washes and stays legible from across a room.",
    ],
    spec: {
      weight: "8.5 oz heavyweight cotton",
      fit: "Boxy, true to size",
      print: "Single-color plastisol, full chest",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "PUNCH UP",
      sub: "the other direction",
      bg: "paper",
      fg: "ink",
      accent: "volt",
      style: "bold-block",
    },
  },
  {
    slug: "definition-is-limitation-tee",
    name: "Definition Is Limitation",
    category: "shirts",
    price: 38,
    blurb: "A line from the manifesto, set in stencil.",
    description: [
      "From the founding text: definition is limitation; we encourage humans to be unlimited.",
      "Stencil-set on the back, small mark at the chest.",
    ],
    spec: {
      weight: "8.5 oz heavyweight cotton",
      fit: "Boxy, true to size",
      print: "Two-pass discharge on the back",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "DEFINITION IS LIMITATION",
      sub: "be unlimited",
      bg: "ink",
      fg: "paper",
      accent: "volt",
      style: "stencil",
    },
  },
  {
    slug: "are-you-not-exhausted-tee",
    name: "Are You Not Exhausted",
    category: "shirts",
    price: 38,
    blurb: "A question worn out loud.",
    description: [
      "An honest question, set in display type, printed once and only once on the front.",
      "If you have to ask, you already answered it.",
    ],
    spec: {
      weight: "8.5 oz heavyweight cotton",
      fit: "Boxy, true to size",
      print: "Single-color discharge",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "ARE YOU NOT EXHAUSTED?",
      bg: "blood",
      fg: "paper",
      accent: "volt",
      style: "stamp",
    },
  },
  {
    slug: "preservation-tee",
    name: "Preservation Tee",
    category: "shirts",
    price: 38,
    blurb: "The one-word brand. Preservation of the human.",
    description: [
      "One word, set in display type at the chest. The word the brand is built on.",
    ],
    spec: {
      weight: "8.5 oz heavyweight cotton",
      fit: "Boxy, true to size",
      print: "Single-color plastisol",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "PRESERVATION",
      sub: "of the human",
      bg: "volt",
      fg: "ink",
      style: "ribbon",
    },
  },
  {
    slug: "no-middle-class-tee",
    name: "No Middle Class",
    category: "shirts",
    price: 38,
    blurb: "Systematic Sins, volume one.",
    description: [
      "From Systematic Sins #1: the middle class was manufactured to divide the working class.",
      "Stencil set, two-color print on the back.",
    ],
    spec: {
      weight: "8.5 oz heavyweight cotton",
      fit: "Boxy, true to size",
      print: "Two-color plastisol on the back",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "THERE IS NO MIDDLE CLASS",
      sub: "systematic sins · vol. 01",
      bg: "paper",
      fg: "ink",
      accent: "blood",
      style: "stencil",
    },
  },
  {
    slug: "you-belong-to-yourself-tee",
    name: "You Belong To Yourself",
    category: "shirts",
    price: 38,
    blurb: "The closing argument, on a shirt.",
    description: [
      "The line we close every page with. Worn at the chest, set big.",
    ],
    spec: {
      weight: "8.5 oz heavyweight cotton",
      fit: "Boxy, true to size",
      print: "Single-color discharge",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "YOU BELONG TO YOURSELF",
      bg: "ink",
      fg: "paper",
      accent: "volt",
      style: "bold-block",
    },
  },

  // ── Hoodies ──
  {
    slug: "faction-hoodie",
    name: "Faction Hoodie",
    category: "hoodies",
    price: 92,
    blurb: "Back-print: FACTION OF TRUTH.",
    description: [
      "The community line, on heavy fleece. Back-print is the public statement; chest mark stays small.",
    ],
    spec: {
      weight: "14 oz brushed fleece",
      fit: "Oversized, size down for trim",
      print: "Three-color, full back",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "FACTION OF TRUTH",
      sub: "we are the call list",
      bg: "ink",
      fg: "paper",
      accent: "blood",
      style: "stencil",
    },
  },
  {
    slug: "withdepth-hoodie",
    name: "WithDepth Hoodie",
    category: "hoodies",
    price: 92,
    blurb: "For the long read, the long walk.",
    description: [
      "WithDepth is the reading and watching arm. This is the jacket you wear to the library.",
    ],
    spec: {
      weight: "14 oz brushed fleece",
      fit: "Oversized, size down for trim",
      print: "Single-color discharge on the back",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "WITH DEPTH",
      sub: "the reading arm",
      bg: "paper",
      fg: "ink",
      accent: "volt",
      style: "bold-block",
    },
  },
  {
    slug: "preservation-hoodie",
    name: "Preservation Hoodie",
    category: "hoodies",
    price: 92,
    blurb: "The one-word brand, in fleece.",
    description: [
      "The word the project is built on, printed across the back at full size.",
    ],
    spec: {
      weight: "14 oz brushed fleece",
      fit: "Oversized, size down for trim",
      print: "Single-color discharge",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "PRESERVATION",
      sub: "of the human",
      bg: "blood",
      fg: "paper",
      style: "stamp",
    },
  },
  {
    slug: "systematic-sins-hoodie",
    name: "Systematic Sins Hoodie",
    category: "hoodies",
    price: 96,
    blurb: "Numbered series. Each drop is a named critique.",
    description: [
      "Each Systematic Sins hoodie names a specific systemic failure. Run sizes are small and numbered.",
    ],
    spec: {
      weight: "14 oz brushed fleece",
      fit: "Oversized, size down for trim",
      print: "Two-color, back",
      origin: "Cut and printed in the US",
    },
    graphic: {
      headline: "SYSTEMATIC SINS",
      sub: "vol. 01 · the middle class",
      bg: "ink",
      fg: "volt",
      accent: "blood",
      style: "stencil",
    },
  },

  // ── Patches ──
  {
    slug: "pa-volt-patch",
    name: "Volt Punch Patch",
    category: "patches",
    price: 12,
    blurb: "3-inch sew-on. Loud.",
    description: [
      "Iron-on backing, but sew it. Made to outlive the jacket.",
    ],
    spec: {
      weight: "Embroidered twill, 3 inch",
      fit: "Sew-on or iron-on",
      print: "Embroidered, two-color",
      origin: "Made in the US",
    },
    graphic: {
      headline: "PUNCH UP",
      bg: "volt",
      fg: "ink",
      style: "bold-block",
    },
  },
  {
    slug: "pa-faction-patch",
    name: "Faction Patch",
    category: "patches",
    price: 12,
    blurb: "Members-only mark.",
    description: [
      "For Faction of Truth members. Numbered, small, intentional.",
    ],
    spec: {
      weight: "Embroidered twill, 2.5 inch",
      fit: "Sew-on or iron-on",
      print: "Embroidered, single-color",
      origin: "Made in the US",
    },
    graphic: {
      headline: "FACTION",
      sub: "of truth",
      bg: "ink",
      fg: "paper",
      style: "stencil",
    },
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function productsIn(category: string) {
  return products.filter((p) => p.category === category);
}
