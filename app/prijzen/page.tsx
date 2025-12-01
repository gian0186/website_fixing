export default function PrijzenPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Titel + intro */}
        <section className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
            Prijzen voor Bugalou
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            Kies het pakket dat past bij jouw webshop. Alle pakketten zijn
            maandelijks opzegbaar en gericht op groei via WhatsApp.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="grid gap-6 md:grid-cols-4">
          {/* Starter */}
          <div className="flex flex-col rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-sm shadow-slate-200">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Starter
            </p>
            <p className="mb-4 text-2xl font-bold text-slate-900">
              €19{" "}
              <span className="text-xs font-normal text-slate-500">
                per maand
              </span>
            </p>
            <p className="mb-4 text-xs font-medium text-emerald-600">
              Voor kleine webshops
            </p>
            <ul className="mb-4 space-y-1.5 text-sm">
              <li>• Tot 200 berichten per maand</li>
              <li>• Order updates</li>
              <li>• Review requests</li>
              <li>• Basisstatistieken</li>
              <li>• E-mail support</li>
            </ul>
            <div className="mt-auto space-y-1 text-xs text-slate-500">
              <p>
                Dit geeft jou ± <span className="font-semibold">€14 marge</span>{" "}
                (minimale kosten: ± €5).
              </p>
              <p className="text-[11px] text-emerald-700">
                → Perfect instappakket zonder dat jij verlies draait.
              </p>
            </div>
          </div>

          {/* Business – meest gekozen */}
          <div className="relative flex flex-col rounded-2xl bg-slate-900 p-6 text-sm text-slate-100 shadow-lg shadow-slate-300 ring-2 ring-emerald-500">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md">
              Meest gekozen
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Business
            </p>
            <p className="mb-4 text-2xl font-bold text-white">
              €39{" "}
              <span className="text-xs font-normal text-slate-300">
                per maand
              </span>
            </p>
            <p className="mb-4 text-xs font-medium text-emerald-200">
              Ideaal voor groeiende webshops
            </p>
            <ul className="mb-4 space-y-1.5 text-sm text-slate-100">
              <li>• Tot 600 berichten</li>
              <li>• Automatische flows (ordervoorbereiding, verzending, levering)</li>
              <li>• Review flows + follow-ups</li>
              <li>• Dashboard met statistieken</li>
              <li>• Snellere support</li>
            </ul>
            <div className="mt-auto space-y-1 text-xs text-slate-200">
              <p>
                Jouw marge hier: ±{" "}
                <span className="font-semibold">€20–€25</span>.
              </p>
              <p className="text-[11px] text-emerald-200">
                → Dit is het pakket waar de meeste marge zit.
              </p>
            </div>
          </div>

          {/* Pro */}
          <div className="flex flex-col rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-sm shadow-slate-200">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pro
            </p>
            <p className="mb-4 text-2xl font-bold text-slate-900">
              €79{" "}
              <span className="text-xs font-normal text-slate-500">
                per maand
              </span>
            </p>
            <p className="mb-4 text-xs font-medium text-emerald-600">
              Voor serieuze webshops
            </p>
            <ul className="mb-4 space-y-1.5 text-sm">
              <li>• Tot 1500 berichten</li>
              <li>• Geavanceerde automatiseringen</li>
              <li>• A/B testing voor reviewberichten</li>
              <li>• Prio support</li>
              <li>• API-koppelingen</li>
            </ul>
            <div className="mt-auto space-y-1 text-xs text-slate-500">
              <p>
                → Hoge marge en klanten die dit pakket nemen blijven vaak lang
                hangen.
              </p>
            </div>
          </div>

          {/* Enterprise */}
          <div className="flex flex-col rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-sm shadow-slate-200">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Enterprise
            </p>
            <p className="mb-1 text-2xl font-bold text-slate-900">
              Vanaf €149{" "}
              <span className="text-xs font-normal text-slate-500">
                per maand
              </span>
            </p>
            <p className="mb-4 text-xs font-medium text-emerald-600">
              Voor grotere volumes & maatwerk
            </p>
            <ul className="mb-4 space-y-1.5 text-sm">
              <li>• 3000–10.000+ berichten</li>
              <li>• Volledig op maat</li>
              <li>• Persoonlijke onboarding</li>
              <li>• Integratie met CRM / WooCommerce / Magento</li>
              <li>• SLA-afspraken</li>
            </ul>
            <div className="mt-auto space-y-2 text-xs text-slate-500">
              <p>
                Perfect voor agencies, grotere shops en partijen die WhatsApp
                echt als core kanaal inzetten.
              </p>
              <button className="mt-2 w-full rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:border-slate-400">
                Plan een gesprek over Enterprise
              </button>
            </div>
          </div>
        </section>

        {/* Kleine note onderaan */}
        <section className="mt-10 text-center text-xs text-slate-500">
          <p>
            Alle prijzen zijn excl. BTW. Bepaalde WhatsApp Business API-kosten
            van Meta kunnen aanvullend zijn, afhankelijk van het volume en type
            berichten.
          </p>
        </section>
      </main>
    </div>
  );
}
