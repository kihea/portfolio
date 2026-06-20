import type { Metadata } from "next";
import Image from "next/image";
import { TipFlow } from "@/components/faction/TipFlow";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Portfolio — Kihea Adams-Wilson",
  description:
    "Selected work by Kihea Adams-Wilson — game engines, parsers, web apps, and learning tools.",
};

type Project = {
  name: string;
  blurb: string;
  tags: string[];
  github?: string;
  demo?: string;
  /** Internal app route (e.g. /learn) → plain full-page navigation. */
  demoInternal?: boolean;
};

const projects: Project[] = [
  {
    name: "Tessera",
    blurb:
      "A learning feed that pulls excerpts from sources and weaves them together by connection, paired with a study notebook. An in-browser model does the research, and the whole thing runs client-side.",
    tags: ["React", "TypeScript", "Vite", "WebGPU / WebLLM"],
    github: "https://github.com/kihea/tessera",
    demo: "/learn",
    demoInternal: true,
  },
  {
    name: "K.Engine",
    blurb:
      "A work-in-progress game engine written in C++ with 2D/3D rendering, audio, physics, and animation, compiled to the browser with Emscripten. What started as a project intended to help me learn C++ and 3D rendering has evolved into an engine.",
    tags: ["C++", "Emscripten", "WebAssembly", "Game Engine"],
    github: "https://github.com/Bellaire-Games-Studio/K.Engine",
    demo: "https://bellaire-games-studio.github.io/K.Engine/build/bin/K.Engine.html",
  },
  {
    name: "Earley Calculator",
    blurb:
      "An arithmetic calculator that parses expressions with the Earley algorithm, building an abstract syntax tree before it computes. Implemented on PPlusParser.",
    tags: ["Lua", "PPlusParser", "Earley Parser", "AST"],
    github: "https://github.com/kihea/EarleyCalculator",
    demo: "https://kihea.github.io/EarleyCalculator/",
  },
  {
    name: "EduVenture",
    blurb:
      "A hackathon build that helps first-generation and low-income students navigate college admissions, pairing gamified milestones with an admissions-chancing tool.",
    tags: ["JavaScript", "Tailwind CSS", "Web"],
    github: "https://github.com/mustafa-nom/Empower-Hacks",
    demo: "https://devpost.com/software/eduventure",
  },
  {
    name: "Kihea.dev",
    blurb:
      "An NBA prop research tool utilizing machine learning models (namely XGBoost, LightGBM and RandomForest) to predict future targets.",
    tags: ["Python", "XGBoost", "Backend", "LightGBM"],
    github: "https://github.com/kihea/python-backend",
    demo: "https://kihea-dev-website.vercel.app/",
  },
];

const experience = [
  {
    role: "City of Houston Intern",
    org: "Microsoft",
    period: "Apr – Aug 2023",
  },
];

const education = [
  {
    role: "B.S. Computer Science",
    org: "Texas State University",
    period: "2024 – 2028",
  },
];

type IconName = "instagram" | "github" | "linkedin";

const contacts: { label: string; handle: string; href: string; icon: IconName }[] = [
  {
    label: "Instagram",
    handle: "@kihea_",
    href: "https://www.instagram.com/kihea_",
    icon: "instagram",
  },
  { label: "GitHub", handle: "kihea", href: "https://github.com/kihea", icon: "github" },
  {
    label: "LinkedIn",
    handle: "Kihea Adams-Wilson",
    href: "https://www.linkedin.com/in/kihea-adams-wilson-67600b27b",
    icon: "linkedin",
  },
];

export default function PortfolioPage() {
  const stripeReady = isStripeConfigured();

  return (
    <main className="relative">
      {/* ───────── Masthead / bio ───────── */}
      <header className="topo-overlay relative overflow-hidden border-b border-[var(--rule)] px-[var(--content-pad)] pb-16 pt-36 md:pb-20 md:pt-44">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-[color:var(--accent)]/8 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[var(--max-width)]">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
            <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
            <span>Portfolio</span>
            <Dot />
            <span>Computer Science · Texas State University</span>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-[var(--rule-strong)] bg-[var(--bg-alt)] shadow-[var(--card-shadow)] md:h-36 md:w-36">
              <Image
                src="/images/kihea-headshot.jpg"
                alt="Portrait of Kihea Adams-Wilson"
                fill
                sizes="(max-width: 768px) 112px, 144px"
                className="object-cover object-top"
                priority
              />
            </div>
            <h1 className="font-display italic font-light text-[color:var(--fg)] leading-[1.02] tracking-[-0.025em] text-[clamp(2.5rem,6vw,68px)] tura-wordmark">
              Kihea Adams-Wilson
            </h1>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
            <div className="max-w-[60ch] space-y-5 font-body text-[16px] leading-[1.85] text-[color:var(--fg-2)] md:text-[17px]">
              <p>
                I&rsquo;m a 20-year-old computer science student at Texas State
                University, with a passion for using the beautiful language of
                technology to advance human endeavors. I was first introduced to
                programming at 12 with the Roblox game engine, where I started by
                building games, then branched out into other facets of software
                engineering, primarily PPlusParser (which the Earley Calculator
                is implemented with) and 3D rendering.
              </p>
              <p>
                I&rsquo;ve worked on plenty of projects since then: websites,
                machine-learning apps, data synthesizers, full-scale apps, and
                more. I believe technology is one of the best ways for human
                effort to be realized, and with the development of modern AI, the
                world is starting to share that belief. I&rsquo;m avid about
                self-education &mdash; information is the key to complexity
                &mdash; and you can always find me within arm&rsquo;s reach of a
                book. Outside of code, I&rsquo;m working out, playing basketball
                or chess, and writing.
              </p>
            </div>

            {/* Experience + Education */}
            <div className="flex flex-col gap-8">
              <ResumeBlock title="Experience" items={experience} />
              <ResumeBlock title="Education" items={education} />
            </div>
          </div>
        </div>
      </header>

      {/* ───────── Projects ───────── */}
      <section className="relative bg-[var(--bg-deep)] px-[var(--content-pad)] py-[clamp(3.5rem,7vw,6rem)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="mb-10 flex flex-col gap-4 border-b border-[var(--rule)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
                <span className="block h-px w-8 bg-[var(--rule-strong)]" />
                <span>Selected Work</span>
              </div>
              <h2 className="font-display italic font-light text-[color:var(--fg)] leading-[1.05] tracking-[-0.025em] text-[clamp(2rem,4vw,44px)]">
                Things I&rsquo;ve built.
              </h2>
            </div>
            <p className="max-w-[40ch] font-body text-[14.5px] leading-[1.8] text-[color:var(--fg-2)]">
              Engines, parsers, web apps, and learning tools. Source and live
              demos linked on each.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {projects.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Contacts ───────── */}
      <section className="relative border-t border-[var(--rule)] bg-[var(--bg)] px-[var(--content-pad)] py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="mb-8 flex items-center gap-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
            <span className="block h-px w-8 bg-[var(--rule-strong)]" />
            <span>Elsewhere</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-[var(--rule-strong)] bg-[color:var(--bg-alt)] px-5 py-3 transition-colors hover:border-[var(--fg)]"
              >
                <ContactIcon
                  name={c.icon}
                  className="shrink-0 text-[color:var(--fg-3)] transition-colors group-hover:text-[color:var(--fg)]"
                />
                <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-3)] group-hover:text-[color:var(--fg)]">
                  {c.label}
                </span>
                <span className="font-body text-[13.5px] text-[color:var(--fg-2)] group-hover:text-[color:var(--fg)]">
                  {c.handle}
                </span>
                <span className="text-[color:var(--fg-3)] transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--fg)]">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Support ───────── */}
      <section
        id="support"
        className="relative scroll-mt-24 border-t border-[var(--rule)] bg-[var(--bg-deep)] py-[clamp(3rem,6vw,5rem)]"
      >
        <div className="mx-auto max-w-[820px] px-[var(--content-pad)] text-center">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-2)]">
            <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--accent)]" />
            Support the work
          </div>
          <h2 className="font-display italic font-light text-[color:var(--fg)] leading-[1.05] tracking-[-0.02em] text-[clamp(1.6rem,3vw,2rem)]">
            If something here was useful, you can leave a tip.
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-[44ch] font-body text-[15px] leading-[1.7] text-[color:var(--fg-3)]">
            One-time, no account required. A dollar, five, or a number of your
            own.
          </p>
          <TipFlow enabled={stripeReady} />
        </div>
      </section>
    </main>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const { name, blurb, tags, github, demo, demoInternal } = project;
  return (
    <article className="group gloss-card relative flex h-full flex-col overflow-hidden rounded-[20px] p-[clamp(1.5rem,3vw,32px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] -top-[40%] h-[160%] w-[140%] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, color-mix(in oklab, var(--accent) 9%, transparent) 0%, transparent 55%)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <h3 className="font-display italic text-[color:var(--fg)] leading-[1.05] tracking-[-0.02em] text-[clamp(1.6rem,3vw,30px)]">
          {name}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--rule)] bg-[color-mix(in_oklab,var(--fg)_5%,transparent)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--fg-3)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="my-5 h-px w-12 bg-[var(--rule-strong)]" />

        <p className="max-w-[52ch] font-body text-[14.5px] leading-[1.78] text-[color:var(--fg-2)]">
          {blurb}
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5 pt-1">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-strong)] px-3.5 py-2 font-heading text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-2)] transition-colors hover:border-[var(--fg)] hover:text-[color:var(--fg)]"
            >
              <GitHubIcon className="shrink-0" />
              GitHub
            </a>
          )}
          {demo &&
            (demoInternal ? (
              <a
                href={demo}
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent)]/45 px-3.5 py-2 font-heading text-[10px] uppercase tracking-[0.16em] text-[color:var(--accent)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent-hover)]"
              >
                Open the app →
              </a>
            ) : (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent)]/45 px-3.5 py-2 font-heading text-[10px] uppercase tracking-[0.16em] text-[color:var(--accent)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent-hover)]"
              >
                Live demo ↗
              </a>
            ))}
        </div>
      </div>
    </article>
  );
}

function ResumeBlock({
  title,
  items,
}: {
  title: string;
  items: { role: string; org: string; period: string }[];
}) {
  return (
    <div>
      <div className="mb-3 font-heading text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
        {title}
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li
            key={`${it.org}-${it.role}`}
            className="rounded-[16px] border border-[var(--rule)] bg-[color:var(--bg-alt)] px-5 py-4"
          >
            <div className="font-display italic text-[color:var(--fg)] leading-[1.2] text-[clamp(1.05rem,1.6vw,1.25rem)]">
              {it.role}
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <span className="font-body text-[13.5px] text-[color:var(--fg-2)]">
                {it.org}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-3)]">
                {it.period}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dot() {
  return (
    <span className="block h-[3px] w-[3px] rounded-full bg-[color:var(--fg-3)]/60" />
  );
}

// ─── Icons (inline SVG, inherit currentColor) ──────────────────────────────

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function ContactIcon({ name, className }: { name: IconName; className?: string }) {
  if (name === "github") return <GitHubIcon className={className} />;
  if (name === "linkedin") {
    return (
      <svg
        className={className}
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.25 8h4.5v12.5H.25V8zm7.5 0h4.31v1.71h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9v6.23h-4.5v-5.52c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92v5.62h-4.5V8z" />
      </svg>
    );
  }
  // instagram
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
