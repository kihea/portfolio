"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  once?: boolean;
};

/**
 * "Tracking in": text starts wide-tracked + blurred, settles to tight + sharp
 * on enter. Default tag is `span` so it can sit safely inside any heading;
 * pass `as="h1"` etc. when using it as the heading itself.
 */
export function TrackingIn({
  text,
  className,
  as: Tag = "span",
  once = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });

  return (
    <Tag className={cn("inline-block", className)}>
      <motion.span
        ref={ref}
        className="inline-block"
        initial={{ letterSpacing: "0.6em", filter: "blur(14px)", opacity: 0 }}
        animate={
          inView
            ? { letterSpacing: "-0.02em", filter: "blur(0px)", opacity: 1 }
            : { letterSpacing: "0.6em", filter: "blur(14px)", opacity: 0 }
        }
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}
