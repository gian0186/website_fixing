"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bugalou",
  description: "Conversational flows & WhatsApp automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body
        className={`${inter.variable} antialiased bg-slate-50 text-slate-900`}
        suppressHydrationWarning
      >
        {/* Globale header – nu op alle pagina's */}
        <header className="border-b border-slate-200 bg-white backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                B
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold tracking-tight">
                  Bugalou
                </span>
                <span className="text-xs text-slate-500">
                  WhatsApp Automation
                </span>
              </div>
            </Link>

            {/* Navigatie */}
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                <a href="/#features" className="hover:text-slate-900">
    Features
  </a>
  <a href="/#solutions" className="hover:text-slate-900">
    Oplossingen
  </a>
  <a href="/prijzen" className="hover:text-slate-900">
    Prijzen
  </a>
  <a href="/#resources" className="hover:text-slate-900">
    Resources
  </a>
</nav>


            {/* CTA rechts */}
            <div className="flex items-center gap-3">
              <a
              href="login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Inloggen
              </a>
              <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600">
                Start gratis proefperiode
              </button>
            </div>
          </div>
        </header>

        {/* Pagina-inhoud */}
        {children}

        {/* Globale WhatsApp floating button */}
        <button
          className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl shadow-lg shadow-emerald-300 hover:bg-emerald-600"
          aria-label="Chat met sales via WhatsApp"
        >
          💬
        </button>
      </body>
    </html>
  );
}
