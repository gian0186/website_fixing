// app/app/settings/page.tsx
import CompanySlugForm from "./CompanySlugForm";
import BrandingForm from "./BrandingForm";
import ApiKeySection from "./ApiKeySection";
import CopyButton from "@/components/CopyButton";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function AppSettingsPage() {
  const session = await requireAuth();
  const userAny = session.user as any;
  const companyId = userAny.companyId as string | undefined;

  if (!companyId) {
    // Zou eigenlijk niet mogen gebeuren, requireAuth vult dit normaliter.
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-red-400">Instellingen</h1>
        <p className="text-sm text-slate-400">
          We konden geen company aan je account koppelen.
        </p>
      </div>
    );
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-red-400">Instellingen</h1>
        <p className="text-sm text-slate-400">
          We konden geen company vinden voor je account.
        </p>
      </div>
    );
  }

  const hostedFormUrl = company.slug
    ? `${APP_BASE_URL}/form/${company.slug}`
    : `${APP_BASE_URL}/form/${company.id}`;

  const primaryColor = company.primaryColor ?? "#0f172a";
  const accentColor = company.accentColor ?? "#38bdf8";
  const introText =
    company.introText ??
    `Vul dit formulier in om rechtstreeks een aanvraag te doen bij ${company.name}.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Instellingen</h1>
          <p className="text-sm text-slate-400">
            Basisinstellingen voor jouw Bugalou account.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Je bent ingelogd bij:{" "}
            <span className="font-medium text-slate-100">
              {company.name}
            </span>
          </p>
        </div>
      </header>

      {/* Company kaart */}
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
              Company
            </p>
            <h2 className="text-lg font-semibold text-slate-100">
              {company.name ?? "Naamloos bedrijf"}
            </h2>
            <p className="text-xs text-slate-500">
              ID: <span className="font-mono">{company.id}</span>
              {company.slug && (
                <>
                  {" · "}slug:{" "}
                  <span className="font-mono">{company.slug}</span>
                </>
              )}
            </p>
          </div>

          {company.logoUrl && (
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logoUrl}
                alt={company.name ?? "Logo"}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Slug bewerken */}
        <CompanySlugForm initialSlug={company.slug ?? null} />

        {/* API key beheer */}
        <ApiKeySection initialApiKey={company.apiKey} />

        {/* Hosted form */}
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-200">
              Hosted form URL
            </span>
            <CopyButton value={hostedFormUrl} label="Kopieer URL" />
          </div>
          <a
            href={hostedFormUrl}
            target="_blank"
            rel="noreferrer"
            className="block overflow-x-auto rounded-md bg-slate-950 px-3 py-2 text-xs font-mono text-sky-400 hover:bg-slate-900"
          >
            {hostedFormUrl}
          </a>
          <p className="mt-1 text-[11px] text-slate-500">
            Deze URL kun je plaatsen op je website, in advertenties of in een
            QR-code. Leads komen direct in Bugalou terecht.
          </p>
        </div>
      </section>

      {/* Branding kaart + bewerkbaar formulier */}
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
              Branding
            </p>
            <h2 className="text-lg font-semibold text-slate-100">
              Hosted form styling
            </h2>
            <p className="text-sm text-slate-400">
              Kleuren en introductietekst die worden gebruikt op het hosted
              formulier.
            </p>
          </div>
        </div>

        {/* huidige weergave */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-300">
              Primaire kleur
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-full border border-slate-700"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="text-xs font-mono text-slate-200">
                {primaryColor}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-300">
              Accentkleur
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-full border border-slate-700"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-xs font-mono text-slate-200">
                {accentColor}
              </span>
            </div>
          </div>

          <div className="md:col-span-1">
            <p className="mb-1 text-xs font-medium text-slate-300">
              Introductietekst
            </p>
            <p className="text-xs text-slate-200 line-clamp-3">{introText}</p>
          </div>
        </div>

        {/* edit-form */}
        <BrandingForm
          initialPrimaryColor={primaryColor}
          initialAccentColor={accentColor}
          initialIntroText={introText}
        />
      </section>

      {/* WhatsApp instellingen kaart */}
      <WhatsAppSettingsCard />
    </div>
  );
}

/**
 * Extra kaart onderaan voor de WhatsApp-instellingen
 */
function WhatsAppSettingsCard() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
      <h2 className="text-sm font-semibold text-slate-100">
        WhatsApp instellingen
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Koppel je WhatsApp Business account zodat Bugalou berichten namens jouw
        bedrijf kan versturen. Beheer hier je telefoonnummer, Phone number ID,
        Business ID en access token.
      </p>

      <div className="mt-3">
        <Link
          href="/app/settings/whatsapp"
          className="inline-flex items-center rounded-full border border-emerald-500 bg-emerald-600/90 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition"
        >
          Open WhatsApp instellingen
        </Link>
      </div>

      <p className="mt-2 text-[11px] text-slate-500">
        Gebruik deze pagina om de gegevens uit Meta / WhatsApp Business in te
        vullen. Daarna kun je WhatsApp-flows aan events koppelen.
      </p>
    </section>
  );
}
