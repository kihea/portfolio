"use client";

import Link from "next/link";
import { auth } from "@/lib/auth/store";

type Props = {
  signedIn: boolean;
  email: string | null;
  displayName: string | null;
  wantsMembershipAt: string | null;
  isMember: boolean;
};

/**
 * Smart CTA for the Faction page header. Branches on:
 *   - not signed in            → magic-link entry
 *   - signed in, no name       → finish onboarding
 *   - signed in, active member → "you're in" pill + sign out
 *   - signed in, intent on file (Stripe pending) → "spot held"
 *   - signed in, otherwise     → "Become a member" CTA
 */
export function FactionCTA({
  signedIn,
  email,
  displayName,
  wantsMembershipAt,
  isMember,
}: Props) {
  if (!signedIn) {
    return (
      <button
        type="button"
        onClick={() => auth.open("subscribe")}
        className="btn-primary"
      >
        Sign in / get on the list
      </button>
    );
  }

  if (!displayName) {
    return (
      <Link href="/faction/welcome" className="btn-primary">
        Finish setup →
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-full border border-sand-100/15 bg-void-900/40 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-100/85">
        Signed in · <span className="text-[color:var(--fg)]">{displayName}</span>
        {email && <span className="ml-2 text-sand-100/45">({email})</span>}
      </div>

      {isMember ? (
        <span className="btn-primary btn-sm cursor-default">
          ✓ Member
        </span>
      ) : wantsMembershipAt ? (
        <Link href="/faction/checkout" className="btn-primary btn-sm">
          ✓ Your spot is held
        </Link>
      ) : (
        <Link href="/faction/welcome" className="btn-ghost btn-sm">
          Become a member →
        </Link>
      )}

      <form action="/auth/signout" method="post">
        <button type="submit" className="btn-ghost btn-sm opacity-70">
          Sign out
        </button>
      </form>
    </div>
  );
}
