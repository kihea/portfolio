"use client";

import { useTransition, useState } from "react";
import { openCustomerPortal } from "./actions";

/**
 * Trigger that opens the Stripe Customer Portal in a new tab. Wraps the
 * server action so the client can show a pending state while Stripe
 * generates the portal URL.
 */
export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        action={() => {
          setError(null);
          startTransition(async () => {
            try {
              await openCustomerPortal();
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Could not open the portal.",
              );
            }
          });
        }}
      >
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-full border border-sand-100/15 bg-white/[0.03] px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-100/85 transition-colors hover:border-sand-100/30 hover:bg-white/[0.06] disabled:opacity-50"
        >
          {isPending ? "Opening Stripe…" : "Manage subscription →"}
        </button>
      </form>
      {error && (
        <span
          role="alert"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-oxblood-300/95"
        >
          {error}
        </span>
      )}
    </div>
  );
}
