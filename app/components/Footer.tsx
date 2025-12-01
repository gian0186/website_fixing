// app/components/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr,repeat(4,1fr)]">
          {/* Social + brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                B
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Bugalou</span>
                <span className="text-[11px] text-slate-400">
                  WhatsApp Automation
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-xs">
              Bugalou helpt groeiende webshops om marketing, service en sales
              via WhatsApp schaalbaar te maken.
            </p>
          </div>

          {/* Company */}
          <div className="space-y-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Company
            </p>
            <FooterLink href="/over-ons">Over ons</FooterLink>
            <FooterLink href="/roadmap">Roadmap</FooterLink>
            <FooterLink href="/partner">Partnerprogramma</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </div>

          {/* Platform */}
          <div className="space-y-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Platform
            </p>
            <FooterLink href="/oplossingen">Oplossingen</FooterLink>
            <FooterLink href="/prijzen">Prijzen</FooterLink>
            <FooterLink href="/use-cases">Use cases</FooterLink>
            <FooterLink href="/integraties">Integraties</FooterLink>
          </div>

          {/* Guides */}
          <div className="space-y-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              WhatsApp Guides
            </p>
            <FooterLink href="/guides/whatsapp-business-api">
              WhatsApp Business API
            </FooterLink>
            <FooterLink href="/guides/flows">Automatische flows</FooterLink>
            <FooterLink href="/guides/reviews">
              Reviews & klanttevredenheid
            </FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </div>

          {/* Legal */}
          <div className="space-y-2 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Security & Legal
            </p>
            <FooterLink href="/privacy">Privacybeleid</FooterLink>
            <FooterLink href="/cookies">Cookiebeleid</FooterLink>
            <FooterLink href="/voorwaarden">Algemene voorwaarden</FooterLink>
            <FooterLink href="/security">Security</FooterLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-4 text-[11px] text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Bugalou. Alle rechten voorbehouden.</p>
          <p className="text-slate-600">
            Gebouwd voor webshops die WhatsApp serieus willen inzetten.
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="block text-slate-300 hover:text-slate-100 hover:underline underline-offset-4"
    >
      {children}
    </Link>
  );
}
