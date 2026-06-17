import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Syne,
  Space_Mono,
  Archivo_Black,
  Bebas_Neue,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Nav } from "@/components/nav/Nav";
import { CinematicFooter } from "@/components/footer/CinematicFooter";
import { RouteThemeBody } from "@/components/effects/RouteThemeBody";
import { themeInitScript } from "@/lib/theme";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = localFont({
  src: "../public/fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Divine Ipseity — for the people inheriting a broken system",
  description:
    "A philosophical and political project built to preserve the human, not the machine.",
  openGraph: {
    title: "Divine Ipseity",
    description: "For the people inheriting a broken system.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${syne.variable} ${spaceMono.variable} ${inter.variable} ${archivoBlack.variable} ${bebas.variable}`}
    >
      <head>
        {/* Sets data-theme before paint to avoid flash of wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="body-grain min-h-screen overflow-x-clip bg-[var(--bg-inverse)] text-[var(--fg)]">
        <RouteThemeBody />
        <Nav />
        {children}
        <CinematicFooter />
      </body>
    </html>
  );
}
