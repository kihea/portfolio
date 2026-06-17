"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** Final scale when fully scrolled. Default 1.6. */
  maxScale?: number;
};

/**
 * Container that scales its child up while you scroll past it. Used on the
 * product detail page so the front-print graphic blooms toward the reader.
 */
export function ZoomParallax({ children, className, maxScale = 1.6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, maxScale]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <div
      ref={ref}
      className={cn("relative h-[160vh] w-full", className)}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, y }}
          className="relative w-[min(82vw,720px)] origin-center"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
