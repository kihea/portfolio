"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  /** Delay between words, in seconds. */
  staggerDelay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  /** Trigger only once on enter. */
  once?: boolean;
};

/**
 * Word-by-word slide-up reveal from inside a clipped mask. Re-implemented in
 * framer-motion so it works inline (no Remotion player required). Default tag
 * is `span` so it can sit inside any heading without nesting.
 */
export function MaskedSlideReveal({
  text,
  staggerDelay = 0.08,
  className,
  as: Tag = "span",
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <Tag className={cn("inline-block", className)}>
      <span ref={ref} className="inline-block">
        {words.map((w, i) => (
          <span
            key={i}
            className="inline-block align-bottom"
            style={{
              overflow: "hidden",
              // Give descenders + italic slant room inside the clip box.
              lineHeight: 1.1,
              paddingTop: "0.05em",
              paddingBottom: "0.18em",
              paddingRight: "0.15em",
              // Pull the surrounding layout back up so the extra padding
              // doesn't shift the rest of the page.
              marginBottom: "-0.18em",
              marginRight: "0.18em",
            }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: "115%" }}
              animate={inView ? { y: "0%" } : { y: "115%" }}
              transition={{
                duration: 0.85,
                delay: i * staggerDelay,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
