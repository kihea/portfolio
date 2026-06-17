import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewThreadForm } from "./NewThreadForm";

export const metadata: Metadata = {
  title: "New thread — The Faction",
};

export default async function NewThreadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_error=expired");

  // Member gate — non-members get bounced to the membership pitch.
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle();
  if (!sub) redirect("/faction?reason=members_only");

  return (
    <main className="relative min-h-[100dvh]">
      <div className="topo-overlay relative min-h-[100dvh] overflow-hidden px-[var(--content-pad)] pb-24 pt-32 md:pt-40">
        <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[460px] w-[460px] rounded-full bg-oxblood-700/12 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-[680px]">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-sand-300/65">
            <Link href="/faction/forum" className="hover:text-sand-100 transition-colors">
              ← Forum
            </Link>
            <span className="block h-[3px] w-[3px] rounded-full bg-sand-300/40" />
            <span>new thread</span>
          </div>

          <h1 className="font-display italic font-light text-sand-100 leading-[1.05] tracking-[-0.025em] text-[clamp(2rem,4.4vw,3rem)]">
            Say what you came to say.
          </h1>

          <p className="mt-4 max-w-[52ch] font-body text-[14.5px] leading-[1.78] text-sand-100/65">
            Title is what shows in the index; body is the argument. Markdown
            is left out on purpose — write the way you talk.
          </p>

          <NewThreadForm />
        </div>
      </div>
    </main>
  );
}
