import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured } from "@/lib/stripe";
import { startSubscriptionCheckout } from "./actions";

export const metadata: Metadata = {
  title: "The Faction · checkout — Divine Ipseity",
  description: "Continue to Stripe to start your Faction membership.",
};

/**
 * Two-mode page:
 *   - Stripe configured  → "Continue to Stripe" button (form action)
 *   - Stripe not yet     → "Spot held" placeholder (the existing message)
 *
 * The wants_membership_at column already records the intent regardless of
 * which mode renders here, so users who showed up before Stripe shipped
 * still get emailed when it goes live.
 */
export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_error=expired");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, wants_membership_at")
    .eq("id", user.id)
    .single();

  // Already a member? Send them home.
  const { data: activeSub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();
  if (activeSub) redirect("/faction?welcome=member");

  const stripeReady = isStripeConfigured();

  return (
    <main className="relative min-h-[100dvh]">
      <div className="topo-overlay relative min-h-[100dvh] overflow-hidden px-[var(--content-pad)] pb-24 pt-32 md:pt-40">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[520px] w-[520px] rounded-full bg-oxblood-700/12 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[640px]">
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-oxblood-300/95">
            <span className="block h-[3px] w-[3px] rounded-full bg-oxblood-300" />
            The Faction · {stripeReady ? "checkout" : "held"}
          </div>

          <h1 className="font-display italic font-light text-sand-100 leading-[1.04] tracking-[-0.025em] text-[clamp(2.2rem,5vw,3.6rem)]">
            {stripeReady ? "Last step." : "We’re holding your spot."}
          </h1>

          {stripeReady ? (
            <>
              <div className="mt-7 space-y-5 max-w-[58ch] font-body text-[16px] leading-[1.78] text-sand-100/80">
                <p>
                  {profile?.display_name ? (
                    <>
                      Thanks, <span className="text-sand-100">{profile.display_name}</span>.
                      One more page on Stripe to set up payment, then you&rsquo;re in.
                    </>
                  ) : (
                    "One more page on Stripe to set up payment, then you’re in."
                  )}
                </p>
                <p className="text-sand-100/65">
                  You can cancel anytime from your account &mdash; we don&rsquo;t
                  hide the leave button. Your reader access stays either way.
                </p>
              </div>

              <form action={startSubscriptionCheckout} className="mt-10 flex flex-wrap gap-3">
                <button type="submit" className="btn-primary">
                  Continue to Stripe →
                </button>
                <Link href="/faction" className="btn-ghost">
                  Not now
                </Link>
              </form>
            </>
          ) : (
            <>
              <div className="mt-7 space-y-5 max-w-[58ch] font-body text-[16px] leading-[1.78] text-sand-100/80">
                <p>
                  {profile?.display_name ? (
                    <>
                      Thanks, <span className="text-sand-100">{profile.display_name}</span>.
                      Your account is in.
                    </>
                  ) : (
                    "Your account is in."
                  )}{" "}
                  The payment side of things is still in verification with Stripe.
                  The moment that clears, we&rsquo;ll send a one-line email with the
                  link to start your membership &mdash; at the price you already
                  saw on the last page.
                </p>
                <p className="text-sand-100/65">
                  In the meantime, you have full Reader access. Read everything.
                  Comments and the Faction forum unlock as soon as the door opens.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/withdepth" className="btn-primary">
                  Read the work →
                </Link>
                <Link href="/" className="btn-ghost">
                  Home
                </Link>
              </div>
            </>
          )}

          <div className="mt-12 h-px w-12 bg-oxblood-400/65" />

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-sand-100/40">
            {stripeReady
              ? "$8/month · cancel anytime · powered by Stripe"
              : `Held since ${
                  profile?.wants_membership_at
                    ? new Date(profile.wants_membership_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "long", day: "numeric" },
                      )
                    : "today"
                }. You can change your mind anytime.`}
          </p>
        </div>
      </div>
    </main>
  );
}
