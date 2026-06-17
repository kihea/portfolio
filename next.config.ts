import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next does not infer a parent directory
  // when an unrelated package-lock.json sits above this app.
  turbopack: {
    root: path.join(__dirname),
  },
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Tessera is a bundled static Vite SPA living in public/learn/. Serve its
  // index at the clean /learn path; its hashed assets under /learn/assets/*
  // are served straight from public/ by the filesystem layer.
  async rewrites() {
    return [{ source: "/learn", destination: "/learn/index.html" }];
  },
  // The writing section moved from /withdepth to /writing.
  async redirects() {
    return [
      { source: "/withdepth", destination: "/writing", permanent: true },
      {
        source: "/withdepth/:slug*",
        destination: "/writing/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
