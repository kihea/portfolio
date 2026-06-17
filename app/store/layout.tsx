import type { Metadata } from "next";
import { PunchUpNav } from "@/components/punchup/PunchUpNav";
import { PunchUpFooter } from "@/components/punchup/PunchUpFooter";
import { CursorHalo } from "@/components/punchup/CursorHalo";
import { CartDrawer } from "@/components/punchup/CartDrawer";

export const metadata: Metadata = {
  title: "PunchUp — Wear the argument",
  description:
    "PunchUp is the apparel arm of Divine Ipseity. Numbered runs, heavyweight cotton, one argument per piece.",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-punch-paper text-punch-ink">
      <CursorHalo />
      <PunchUpNav />
      {children}
      <PunchUpFooter />
      <CartDrawer />
    </div>
  );
}
