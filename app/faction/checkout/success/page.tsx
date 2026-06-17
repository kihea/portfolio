import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Welcome to the Faction — Divine Ipseity",
  description: "You're in. The room just got one person sharper.",
};

/**
 * Stripe redirects here after a successful subscription Checkout. By the
 * time this renders, the webhook has typically already inserted the
 * `subscriptions` row — but Stripe's redirect can race the webhook, so we
 * check `?session_id=` and re-fetch the subscription if needed.
 *
 * For now, we trust the webhook and just show the confirmation. The
 * Faction page itself reads `subscriptions` to gate features.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await searchParams; // reserved for future use (e.g. show invoice link)

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_error=expired");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="relative min-h-[100dvh]">
      <div className="topo-overlay relative min-h-[100dvh] overflow-hidden px-[var(--content-pad)] pb-24 pt-32 md:pt-40">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[520px] w-[520px] rounded-full bg-oxblood-700/15 blur-[80px]" />
        <div className="pointer-events-none absolute -right-[15%] bottom-[-30%] h-[420px] w-[420px] rounded-full bg-oxblood-600/12 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[640px]">
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-oxblood-300/95">
            <span className="block h-[3px] w-[3px] rounded-full bg-oxblood-300" />
            The Faction · welcome
          </div>

          <h1 className="font-display italic font-light text-sand-100 leading-[1.04] tracking-[-0.025em] text-[clamp(2.4rem,5.6vw,4rem)]">
            You&rsquo;re in,{" "}
            <span className="italic text-oxblood-300/95">
              {profile?.display_name ?? "friend"}
            </span>
            .
          </h1>

          <div className="mt-7 space-y-5 max-w-[58ch] font-body text-[16px] leading-[1.78] text-sand-100/80">
            <p>
              The room just got one person sharper. Comments are open on every
              essay, the Faction forum is yours, and the next dispatch will
              land in your inbox before it goes wide.
            </p>
            <p className="text-sand-100/65">
              Stripe will email you a receipt. You can cancel any time from
              the Faction page &mdash; the leave button is right next to the
              door.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/withdepth"
              className="cursor-pointer rounded-full border border-oxblood-300/30 bg-gradient-to-b from-oxblood-600 to-oxblood-800 px-7 py-3.5 font-heading text-[10.5px] uppercase tracking-[0.18em] text-sand-100 shadow-[0_4px_18px_rgba(107,30,30,0.35),inset_0_1px_0_rgba(255,255,255,0.10)] transition-all hover:from-oxblood-700 hover:to-oxblood-900 active:scale-[0.97]"
            >
              Start with the writing →
            </Link>
            <Link
              href="/faction"
              className="cursor-pointer rounded-full border border-sand-100/15 bg-white/[0.03] px-7 py-3.5 font-heading text-[10.5px] uppercase tracking-[0.18em] text-sand-100/85 transition-colors hover:border-sand-100/30 hover:bg-white/[0.06]"
            >
              Faction home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
