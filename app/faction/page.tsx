import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured } from "@/lib/stripe";
import { FactionCTA } from "./FactionCTA";
import { TipFlow } from "@/components/faction/TipFlow";
import { ManageSubscriptionButton } from "./ManageSubscriptionButton";

export const metadata: Metadata = {
  title: "The Faction — Divine Ipseity",
  description:
    "The Faction is the membership room. Comments, early drops, and the dispatch. One tier, one room.",
};

export default async function FactionPage() {
  // Read the session + profile on the server so the CTA can reflect onboarding
  // state. If Supabase isn't configured yet, fall back to the logged-out view.
  let user: { id: string; email?: string | null } | null = null;
  let profile:
    | { display_name: string | null; wants_membership_at: string | null }
    | null = null;
  let isMember = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user
      ? { id: data.user.id, email: data.user.email }
      : null;
    if (user) {
      // Run profile + subscription lookups in parallel — they're independent
      // and each is a network round-trip on its own.
      const [profileRes, subRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, wants_membership_at")
          .eq("id", user.id)
          .single(),
        supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .in("status", ["active", "trialing"])
          .maybeSingle(),
      ]);
      profile = profileRes.data;
      isMember = Boolean(subRes.data);
    }
  } catch {
    user = null;
  }

  const stripeReady = isStripeConfigured();

  return (
    <main className="relative">
      <header className="topo-overlay relative overflow-hidden border-b border-sand-100/8 px-[var(--content-pad)] pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-oxblood-700/12 blur-[80px]" />
        <div className="pointer-events-none absolute -right-[10%] bottom-[-30%] h-[400px] w-[400px] rounded-full bg-oxblood-600/8 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[820px]">
          <div className="mb-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-oxblood-300/95">
            <span className="block h-[3px] w-[3px] rounded-full bg-oxblood-300" />
            The Faction · membership
          </div>

          <h1 className="font-display italic font-light text-[color:var(--fg)] leading-[1.02] tracking-[-0.025em] text-[clamp(2.4rem,6vw,72px)]">
            The room is small on purpose.
          </h1>

          <p className="mt-7 max-w-[60ch] font-body text-[16.5px] leading-[1.78] text-[color:var(--fg-2)] md:text-[17px]">
            The Faction is the membership tier of Divine Ipseity. One price,
            one room. Members get the comment privilege on every essay, the
            dispatch before it goes wide, and early access to PunchUp drops.
            The list is never sold and the door is never crowded.
          </p>

          <p className="mt-4 max-w-[60ch] font-body text-[15.5px] leading-[1.78] text-[color:var(--fg-2)] md:text-[16px]">
            We are still building the membership flow. Sign in now and you&rsquo;ll
            be on the call list when the door opens — no payment yet.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <FactionCTA
              signedIn={!!user}
              email={user?.email ?? null}
              displayName={profile?.display_name ?? null}
              wantsMembershipAt={profile?.wants_membership_at ?? null}
              isMember={isMember}
            />
            <Link href="/withdepth" className="btn-ghost">
              Read first →
            </Link>
          </div>
          {isMember && (
            <div className="mt-6">
              <ManageSubscriptionButton />
            </div>
          )}

          <div className="mt-12 h-px w-12 bg-oxblood-400/65" />
        </div>
      </header>

      {/* What members get */}
      <section className="relative overflow-hidden bg-[var(--bg-deep)] py-[clamp(3rem,7vw,6rem)]">
        <div className="mx-auto max-w-[820px] px-[var(--content-pad)]">
          <div className="mb-10 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-3)]">
            <span className="block h-px w-8 bg-[var(--fg-3)]" />
            What you get
          </div>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                title: "The comment thread",
                body:
                  "Member-gated. Every essay opens to a small, named room of people you can actually argue with.",
              },
              {
                title: "The dispatch",
                body:
                  "Early reads and notes that don’t go on the public site. Sent when there’s something to send.",
              },
              {
                title: "PunchUp early access",
                body:
                  "Numbered drops open to the Faction first. The runs are short — this is how you catch them.",
              },
              {
                title: "A door that stays open",
                body:
                  "Cancel any time, in two clicks. We don’t hide the leave button.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="glass-card rounded-[20px] border border-sand-100/8 bg-[color:var(--bg-alt)] p-6"
              >
                <div className="font-display italic text-[color:var(--fg)] leading-[1.2] text-[clamp(1.05rem,1.5vw,1.25rem)]">
                  {item.title}
                </div>
                <p className="mt-2 font-body text-[14.5px] leading-[1.7] text-[color:var(--fg-2)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* One-time tip flow */}
      <section className="relative border-t border-sand-100/8 bg-[var(--bg)] py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto max-w-[820px] px-[var(--content-pad)] text-center">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg-2)]">
            <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/65" />
            Or just leave a tip
          </div>
          <h2 className="font-display italic font-light text-[color:var(--fg)] leading-[1.05] tracking-[-0.02em] text-[clamp(1.6rem,3vw,2rem)]">
            One-time, no commitment.
          </h2>
          <p className="mx-auto mt-4 mb-8 max-w-[44ch] font-body text-[15px] leading-[1.7] text-[color:var(--fg-3)]">
            If membership isn&rsquo;t right for you, you can still support the work directly.
          </p>
          <TipFlow enabled={stripeReady} />
        </div>
      </section>
    </main>
  );
}
