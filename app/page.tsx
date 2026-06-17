import { Hero } from "@/components/hero/Hero";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { RecentWriting } from "@/components/sections/RecentWriting";
import { Mission } from "@/components/sections/Mission";
import { DispatchCTA } from "@/components/sections/DispatchCTA";
import { IntroOverlay } from "@/components/intro/IntroOverlay";

export default function Home() {
  return (
    <main className="relative">
      <IntroOverlay />
      <Hero />
      <AboutTeaser />
      <RecentWriting />
      <Mission />
      <DispatchCTA />
    </main>
  );
}
