import type { Metadata } from "next";
import { LearnThemeEnforcer } from "./LearnThemeEnforcer";

export const metadata: Metadata = {
  title: "The Long Study — Divine Ipseity",
  description:
    "Structured courses on systems, identity, and community. Free for Readers. Every course for Faction members.",
  openGraph: {
    title: "The Long Study",
    description:
      "Structured courses on systems, identity, and community. Free for Readers. Every course for Faction members.",
    type: "website",
  },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LearnThemeEnforcer />
      {children}
    </>
  );
}
