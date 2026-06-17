import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WelcomeFlow } from "./WelcomeFlow";

export const metadata: Metadata = {
  title: "Welcome — Divine Ipseity",
  description:
    "Pick a name, pick a tier. Two questions, then you're in.",
};

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session → bounce home with a soft signal the modal can read.
  if (!user) redirect("/?auth_error=expired");

  // Pre-fill the flow if they've been here before (they can re-edit their
  // name + tier intent until Stripe is wired up).
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, wants_membership_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="relative min-h-[100dvh]">
      <div className="topo-overlay relative min-h-[100dvh] overflow-hidden px-[var(--content-pad)] pb-24 pt-32 md:pt-40">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[520px] w-[520px] rounded-full bg-oxblood-700/12 blur-[80px]" />
        <div className="pointer-events-none absolute -right-[15%] bottom-[-30%] h-[420px] w-[420px] rounded-full bg-oxblood-600/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[640px]">
          <WelcomeFlow
            email={user.email ?? null}
            initialDisplayName={profile?.display_name ?? ""}
            initialTier={
              profile?.wants_membership_at ? "member" : null
            }
          />
        </div>
      </div>
    </main>
  );
}
