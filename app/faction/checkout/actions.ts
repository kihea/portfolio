"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getStripe,
  isStripeConfigured,
  siteUrl,
  FACTION_PRICE_ID,
} from "@/lib/stripe";

/**
 * Subscription Checkout. Reuses an existing Stripe customer for the user
 * if one is on the profile, otherwise creates one and stores the id.
 * Throws if Stripe isn't configured — the calling page only renders the
 * trigger button when isStripeConfigured() is true.
 */
export async function startSubscriptionCheckout(): Promise<never> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }
  if (!FACTION_PRICE_ID) {
    throw new Error("STRIPE_PRICE_ID_FACTION is missing.");
  }

  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe client unavailable.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_error=expired");

  // Look up (or create) the Stripe customer linked to this profile.
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, display_name")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: profile?.display_name ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: FACTION_PRICE_ID, quantity: 1 }],
    allow_promotion_codes: true,
    // Pass user_id so the webhook can associate the subscription even if
    // Stripe's customer→user mapping ever drifts.
    subscription_data: {
      metadata: { user_id: user.id },
    },
    success_url: `${siteUrl()}/faction/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/faction?checkout=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
  redirect(session.url);
}
