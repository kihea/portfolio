"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  url: string;
  title: string;
};

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function ModuleVideoEmbed({ url, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Intersection Observer: lazy-load the iframe only when in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-[8px] border border-[var(--rule)] bg-[color:var(--bg-alt)]"
      style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
    >
      {visible ? (
        isDirectVideo(url) ? (
          <video
            src={url}
            controls
            className="absolute inset-0 h-full w-full"
            title={title}
          />
        ) : (
          <iframe
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        )
      ) : (
        // Placeholder while not yet in viewport
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--fg-3)]">
            Loading video…
          </span>
        </div>
      )}
    </div>
  );
}
