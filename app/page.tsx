/* app/page.tsx */

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
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
          </div>

          {/* Nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#solutions" className="hover:text-slate-900">
              Oplossingen
            </a>
            <a href="/prijzen" className="hover:text-slate-900">
              Prijzen
            </a>
            <a href="#resources" className="hover:text-slate-900">
              Resources
            </a>
          </nav>

          {/* CTA rechts */}
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Inloggen
            </button>
            <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600">
              Start gratis proefperiode
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 md:flex-row md:items-center md:gap-14 md:pb-20 md:pt-16">
            {/* Tekst */}
            <div className="flex-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                WhatsApp voor bedrijven
              </p>
              <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-[2.8rem]">
                Laat je bedrijf groeien met{" "}
                <span className="text-emerald-600">WhatsApp automatisering</span>
              </h1>
              <p className="mb-5 max-w-xl text-sm text-slate-600 md:text-base">
                Bugalou helpt teams om marketing, service en sales via WhatsApp
                te automatiseren. Eén shared inbox, slimme flows en realtime
                rapportages – allemaal in één platform.
              </p>

              {/* Trust badge */}
              <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                  ✓ Gebouwd voor WhatsApp Business API
                </span>
                <span>Geen creditcard nodig. Altijd opzegbaar.</span>
              </div>

              {/* CTA buttons */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-600">
                  Start 14 dagen gratis proef
                </button>
                <button className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-300">
                  Bekijk live demo
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Gemiddeld +32% meer conversies via WhatsApp campagnes.
              </p>
            </div>

            {/* Mockup / visuals */}
            <div className="flex-1">
              <div className="relative mx-auto max-w-md">
                {/* Achtergrond blur */}
                <div className="absolute inset-0 -z-10 scale-110 bg-gradient-to-tr from-emerald-100 via-white to-sky-100 blur-2xl" />

                <div className="flex gap-4">
                  {/* Shared inbox kaart */}
                  <div className="flex flex-1 flex-col rounded-2xl bg-white p-3 shadow-xl shadow-slate-200/70">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Shared Team Inbox
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Live
                      </span>
                    </div>
                    <div className="space-y-2">
                      {["Nieuwe lead", "Orderstatus", "Supportticket"].map(
                        (label, idx) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1.5"
                          >
                            <div>
                              <p className="text-xs font-medium text-slate-800">
                                {label}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Automatisch toegewezen aan team
                              </p>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {idx === 0 ? "nu" : `${idx * 3} min`}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Campagne & flow kaarten */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-xl shadow-slate-300/60">
                      <p className="mb-2 text-xs font-semibold">
                        Campagne-rapport
                      </p>
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <div className="flex flex-col items-center">
                          <span className="text-base font-semibold text-emerald-400">
                            92%
                          </span>
                          <span>Bezorgd</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-base font-semibold text-emerald-300">
                            78%
                          </span>
                          <span>Geopend</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-base font-semibold text-emerald-200">
                            31%
                          </span>
                          <span>Geklikt</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3 shadow-xl shadow-slate-200/70">
                      <p className="mb-2 text-xs font-semibold text-slate-700">
                        No-code WhatsApp flows
                      </p>
                      <div className="space-y-2 text-[11px] text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                            Trigger: Nieuw bericht
                          </span>
                          <span>→ Stuur welkomstbericht</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-sky-50 px-2 py-1 font-medium text-sky-700">
                            Vraag klantgegevens
                          </span>
                          <span>→ Maak deal in CRM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700">
                            Geen reactie
                          </span>
                          <span>→ Automatische follow-up</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3 py-1 shadow-lg shadow-slate-200">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-center text-xs font-bold text-white">
                    WA
                  </div>
                  <p className="text-[11px] font-medium text-slate-700">
                    Gemiddelde responstijd: <span className="text-emerald-600">3 min</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logo strip */}
          <div className="mx-auto max-w-6xl px-4 pb-12">
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
              Vertrouwd door marketing & sales teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 md:gap-12">
              <span>RetailPro</span>
              <span>ShipFast Logistics</span>
              <span>HealthConnect</span>
              <span>FoodLab Delivery</span>
              <span>RealEstate360</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-4 py-14 md:py-20"
        >
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900">
              Alles wat je nodig hebt om WhatsApp op te schalen
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-600">
              Combineer campagnes, 1-op-1 gesprekken en automatisering in één
              overzichtelijk platform. Gebouwd voor teams die snel willen
              schakelen zonder ruis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                01 · Shared Inbox
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Eén inbox voor je hele team
              </h3>
              <p className="text-sm text-slate-600">
                Beheer alle WhatsApp gesprekken vanuit één centrale inbox met
                tags, notities en automatische toewijzing aan collega&apos;s.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                02 · Automatisering
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                No-code conversatieflows
              </h3>
              <p className="text-sm text-slate-600">
                Bouw welkomstflows, leadkwalificatie en after-sales funnels
                zonder één regel code. Sleep &amp; drop, activeer en schaal.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                03 · Rapportage
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Heldere inzichten & KPI&apos;s
              </h3>
              <p className="text-sm text-slate-600">
                Zie direct welke campagnes omzet opleveren, welke flows
                converteren en waar gesprekken blijven hangen.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing teaser */}
        <section
          id="pricing"
          className="border-y border-slate-200 bg-slate-900 py-14 md:py-16"
        >
          <div className="mx-auto max-w-6xl px-4 text-center text-slate-50">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight">
              Eerlijk prijsmodel. Start klein, schaal op wanneer jij wilt.
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-slate-300">
              Betaal per actieve WhatsApp-nummer en teamlid. Geen verborgen
              kosten, geen lange contracten.
            </p>
            <div className="inline-flex flex-col items-center gap-3 rounded-2xl bg-slate-800 px-6 py-4 text-sm sm:flex-row">
              <span className="text-slate-200">
                Vanaf <strong>€49 p/m</strong> voor groeiende teams.
              </span>
              <span className="hidden h-4 w-px bg-slate-700 sm:block" />
              <span className="text-slate-400">
                Inclusief 14 dagen gratis proefperiode.
              </span>
              <button className="mt-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 sm:mt-0">
                Bekijk prijzen
              </button>
            </div>
          </div>
        </section>

        {/* Resources / footer */}
        <section
          id="resources"
          className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 md:py-12"
        >
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Klaar om WhatsApp serieuzer in te zetten?
              </h3>
              <p className="mb-4 max-w-xl">
                Plan een korte demo met ons team en ontdek hoe Bugalou in jouw
                bestaande stack past. Binnen 24 uur kun je je eerste
                geautomatiseerde flow live hebben staan.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
                  Plan een demo
                </button>
                <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-300">
                  Documentatie bekijken
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <p className="font-semibold text-slate-900">Support</p>
              <p>Direct support via WhatsApp & e-mail.</p>
              <p>Gemiddelde reactietijd: &lt; 1 werkuur.</p>
            </div>
          </div>

          <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 md:flex-row">
            <span>© {new Date().getFullYear()} Bugalou. Alle rechten voorbehouden.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-600">
                Voorwaarden
              </a>
              <a href="#" className="hover:text-slate-600">
                Cookiebeleid
              </a>
            </div>
          </footer>
        </section>
      </main>

      {/* WhatsApp floating button (rechts onder) */}
      <button
        className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl shadow-lg shadow-emerald-300 hover:bg-emerald-600"
        aria-label="Chat met sales via WhatsApp"
      >
        💬
      </button>
    </div>
  );
}
