import "server-only";

import Stripe from "stripe";

/**
 * Server-side Stripe client. Lazily constructed so the rest of the app can
 * import this module even when Stripe isn't configured yet (e.g. while the
 * account is still in verification). Call `getStripe()` from within Server
 * Actions / Route Handlers; if it returns null, the caller decides how to
 * gracefully degrade.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (_stripe) return _stripe;
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Use the SDK's default API version (matches the installed package).
    // Bump the SDK with intent — every major SDK release pins a new API
    // version which is locked-in for new accounts.
    typescript: true,
    appInfo: {
      name: "Divine Ipseity",
      version: "0.1.0",
    },
  });
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/** The faction subscription price id, configured in Stripe dashboard. */
export const FACTION_PRICE_ID = process.env.STRIPE_PRICE_ID_FACTION;
