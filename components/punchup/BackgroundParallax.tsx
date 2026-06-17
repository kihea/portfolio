"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Background block — usually a colored panel or image. */
  bg: ReactNode;
  /** Foreground content. Sits above the parallaxed bg. */
  children: ReactNode;
  className?: string;
  /** Strength of vertical drift, in vh. Default 8. */
  strength?: number;
};

/**
 * Section with a slowly-drifting background block. Inspired by the inspiration
 * BackgroundParallax pattern but adapted to use mix-blend-difference correctly
 * inside a normal page.
 */
export function BackgroundParallax({
  bg,
  children,
  className,
  strength = 8,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${strength}%`]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-[10%] left-0 z-0 h-[120%] w-full">
        <motion.div className="relative h-full w-full" style={{ y }}>
          {bg}
        </motion.div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
