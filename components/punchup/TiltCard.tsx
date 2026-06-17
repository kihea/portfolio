"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  tiltLimit?: number;
  scale?: number;
  perspective?: number;
  /** "evade" tilts away from cursor, "gravitate" follows it. */
  effect?: "gravitate" | "evade";
  spotlight?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function TiltCard({
  tiltLimit = 12,
  scale = 1.03,
  perspective = 1100,
  effect = "evade",
  spotlight = true,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
  );
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);
  const dir = effect === "evade" ? -1 : 1;

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const xRot = (py - 0.5) * (tiltLimit * 2) * dir;
      const yRot = (px - 0.5) * -(tiltLimit * 2) * dir;
      setTransform(
        `perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale},${scale},${scale})`,
      );
      if (spotlight) setPos({ x: px * 100, y: py * 100 });
    },
    [tiltLimit, scale, perspective, dir, spotlight],
  );

  const onLeave = useCallback(() => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
    );
    setHover(false);
  }, [perspective]);

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("will-change-transform relative overflow-hidden", className)}
      style={{
        transform,
        transition: "transform 0.18s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: hover ? 1 : 0, transition: "opacity 0.25s" }}
        >
          <div
            className="absolute h-[200%] w-[200%] rounded-full"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(195,255,0,0.30) 0%, transparent 38%)",
              mixBlendMode: "multiply",
            }}
          />
        </div>
      )}
    </div>
  );
}
