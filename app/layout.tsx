import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "Bugalou",
  description: "Conversational flows & WhatsApp automation",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * We maken hier een layout zonder header/footer.
 * De daadwerkelijke check (dashboard of marketing)
 * gebeurt in Header/Footer zelf via een client-component.
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body
        className={`${inter.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {/* Header (verschijnt alleen buiten dashboard) */}
        <Header />

        {/* Pagina-content */}
        {children}

        {/* Footer (verschijnt alleen buiten dashboard) */}
        <Footer />

      </body>
    </html>
  );
}
