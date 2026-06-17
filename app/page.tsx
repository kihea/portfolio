import { Hero } from "@/components/hero/Hero";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { RecentWriting } from "@/components/sections/RecentWriting";
import { EcosystemGrid } from "@/components/sections/EcosystemGrid";
import { DispatchCTA } from "@/components/sections/DispatchCTA";
import { IntroOverlay } from "@/components/intro/IntroOverlay";

export default function Home() {
  return (
    <main className="relative">
      <IntroOverlay />
      <Hero />
      <AboutTeaser />
      <RecentWriting />
      <EcosystemGrid />
      <DispatchCTA />
    </main>
  );
}
