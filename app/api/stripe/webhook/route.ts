import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook handler. Verifies the signature, then writes the event
 * through to Supabase using the service-role key (bypasses RLS, since
 * webhooks come from Stripe — there's no user session here).
 *
 * Configure in Stripe Dashboard → Developers → Webhooks → +Add endpoint:
 *   URL:    https://your-domain.com/api/stripe/webhook
 *   Events: checkout.session.completed
 *           customer.subscription.created
 *           customer.subscription.updated
 *           customer.subscription.deleted
 * Then copy the Signing Secret into STRIPE_WEBHOOK_SECRET.
 *
 * Local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
 */

export const dynamic = "force-dynamic"; // never cache webhook responses
export const runtime = "nodejs";        // Stripe SDK needs node, not edge

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service-role env vars are missing.");
  return createServiceClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return new NextResponse("Stripe webhook is not configured", { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown signature error";
    return new NextResponse(`Bad signature: ${msg}`, { status: 400 });
  }

  const sb = service();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = (session.metadata?.user_id as string | undefined) ?? null;

        // One-time tips (mode === 'payment').
        if (session.mode === "payment" && session.payment_intent) {
          const piId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent.id;
          await sb.from("tips").upsert(
            {
              user_id: userId,
              stripe_payment_intent_id: piId,
              amount_cents: session.amount_total ?? 0,
              currency: (session.currency ?? "usd").toLowerCase(),
            },
            { onConflict: "stripe_payment_intent_id" },
          );
        }

        // Subscription mode — pull the subscription details for status etc.
        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sb, sub, userId);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = (sub.metadata?.user_id as string | undefined) ?? null;
        await upsertSubscription(sb, sub, userId);
        break;
      }

      default:
        // Other event types are fine — Stripe wants 2xx for any received event.
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error", event.type, err);
    return new NextResponse("Handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Upsert a subscription row keyed on stripe_subscription_id. */
async function upsertSubscription(
  sb: ReturnType<typeof service>,
  sub: Stripe.Subscription,
  fallbackUserId: string | null,
) {
  let userId = fallbackUserId;
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // Fall back to looking up the user by their stored stripe_customer_id when
  // metadata didn't carry a user_id (e.g. for Stripe-side mutations).
  if (!userId) {
    const { data } = await sb
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    userId = data?.id ?? null;
  }

  if (!userId) {
    console.warn("[stripe-webhook] could not resolve user_id for", sub.id);
    return;
  }

  // Stripe API ≥2024-11-20 moved current_period_end onto each subscription
  // item. Read the first item — single-line subscriptions are our only shape.
  const item = sub.items?.data?.[0];
  const periodEndUnix =
    (item as { current_period_end?: number } | undefined)?.current_period_end ??
    null;

  await sb.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      current_period_end: periodEndUnix
        ? new Date(periodEndUnix * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  // When a subscription becomes active or trialing, permanently grant the user
  // access to all current member-tier courses. Grants persist after downgrade so
  // former members keep courses that existed during their paid period.
  if (["active", "trialing"].includes(sub.status)) {
    try {
      const { courses } = await import("@/lib/courses");
      const memberCourses = courses.filter((c) => c.tier === "member");
      if (memberCourses.length > 0) {
        // Look up the DB row id for this subscription so we can store granted_via.
        const { data: subRow } = await sb
          .from("subscriptions")
          .select("id")
          .eq("stripe_subscription_id", sub.id)
          .maybeSingle();

        await sb.from("course_access_grants").upsert(
          memberCourses.map((c) => ({
            user_id: userId,
            course_slug: c.slug,
            granted_via: subRow?.id ?? null,
          })),
          { onConflict: "user_id,course_slug" },
        );
      }
    } catch (err) {
      // Non-fatal — log and continue. The next subscription event will retry.
      console.error("[stripe-webhook] course grant error", err);
    }
  }
}
