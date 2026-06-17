"use client";

import { motion } from "framer-motion";

interface WordPullUpProps {
  words: string[];
  className?: string;
  delay?: number;
  stagger?: number;
}

export function WordPullUp({
  words,
  className = "",
  delay = 0.05,
  stagger = 0.08,
}: WordPullUpProps) {
  return (
    <h2
      className={`flex flex-wrap ${className}`}
      aria-label={words.join(" ")}
    >
      {words.map((w, i) => (
        <span key={i} className="overflow-overlay inline-block mr-[0.25em]">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
