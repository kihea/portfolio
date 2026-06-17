"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets a `data-route` attribute on <body> based on the current pathname.
 * The `/store` sub-tree (PunchUp) flips the body to a light-mode theme via
 * `body[data-route="punchup"]` rules in globals.css.
 */
export function RouteThemeBody() {
  const pathname = usePathname();
  useEffect(() => {
    const isPunchup = pathname?.startsWith("/store");
    const value = isPunchup ? "punchup" : "default";
    document.body.dataset.route = value;
    document.documentElement.dataset.route = value;
    return () => {
      document.body.dataset.route = "default";
      document.documentElement.dataset.route = "default";
    };
  }, [pathname]);
  return null;
}
