"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe";

const TIP_PRESET_CENTS = [300, 700, 2000] as const; // $3, $7, $20
const TIP_MIN_CENTS = 100;     // $1
const TIP_MAX_CENTS = 100_000; // $1,000

/**
 * Opens the Stripe Customer Portal for the signed-in user. They land on
 * Stripe's hosted UI for changing card / cancelling / viewing invoices,
 * then return to /faction when done.
 */
export async function openCustomerPortal(): Promise<never> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe client unavailable.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_error=expired");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    throw new Error("No Stripe customer on file.");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl()}/faction`,
  });

  redirect(session.url);
}

/**
 * One-time tip checkout. Anonymous-friendly (no auth required) — the
 * webhook will associate the tip to a user only if they're signed in
 * when this action runs. We pass the user_id in metadata so the webhook
 * can find them later.
 *
 * Accepts either a preset amount (one of TIP_PRESET_CENTS) or a custom
 * dollar amount the visitor typed.
 */
export async function startTipCheckout(formData: FormData): Promise<never> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe client unavailable.");

  // Parse amount.
  const presetRaw = formData.get("preset_cents");
  const customRaw = formData.get("custom_dollars");

  let amountCents: number | null = null;
  if (presetRaw != null) {
    const cents = Number(presetRaw);
    if (
      Number.isInteger(cents) &&
      (TIP_PRESET_CENTS as readonly number[]).includes(cents)
    ) {
      amountCents = cents;
    }
  }
  if (amountCents === null && customRaw != null) {
    const dollars = parseFloat(String(customRaw));
    if (!Number.isNaN(dollars) && dollars > 0) {
      amountCents = Math.round(dollars * 100);
    }
  }

  if (amountCents === null) {
    throw new Error("Pick or enter an amount.");
  }
  if (amountCents < TIP_MIN_CENTS) {
    throw new Error(`Minimum tip is $${TIP_MIN_CENTS / 100}.`);
  }
  if (amountCents > TIP_MAX_CENTS) {
    throw new Error(`Maximum tip is $${TIP_MAX_CENTS / 100}.`);
  }

  // Try to attach the user (and reuse their customer id) if signed in.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let customerId: string | undefined;
  let customerEmail: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();
    customerId = profile?.stripe_customer_id ?? undefined;
    customerEmail = customerId ? undefined : (user.email ?? undefined);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    customer_email: customerEmail,
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: "Tip — Divine Ipseity",
            description: "One-time gift, no subscription.",
          },
        },
      },
    ],
    metadata: user ? { user_id: user.id } : {},
    payment_intent_data: {
      metadata: user ? { user_id: user.id } : {},
    },
    success_url: `${siteUrl()}/faction?tip=thanks`,
    cancel_url: `${siteUrl()}/faction?tip=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
  redirect(session.url);
}
