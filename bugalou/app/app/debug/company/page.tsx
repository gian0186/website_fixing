import { prisma } from "@/lib/prisma";
import CopyButton from "@/components/CopyButton";

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function DebugCompanyPage() {
  // Voor nu: gewoon alle companies laten zien (waarschijnlijk 1)
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Debug · Company</h1>
            <p className="text-sm text-slate-500">
              Overzicht van companies met API key & hosted form URL.
            </p>
          </div>

          <a
            href="/debug/messages"
            className="text-sm text-blue-600 hover:underline"
          >
            Ga naar messages →
          </a>
        </div>

        {companies.length === 0 && (
          <p className="text-sm text-slate-500">
            Er zijn nog geen companies in de database.
          </p>
        )}

        <div className="space-y-4">
          {companies.map((company: any) => {
            const hostedFormUrl = company.slug
              ? `${APP_BASE_URL}/form/${company.slug}`
              : `${APP_BASE_URL}/form/${company.id}`;

            return (
              <section
                key={company.id}
                className="rounded-xl bg-white p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {company.name ?? "Naamloos bedrijf"}
                    </h2>
                    <p className="text-xs text-slate-400">
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
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={company.logoUrl}
                        alt={company.name ?? "Logo"}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* API key blok */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-600">
                      API key
                    </span>
                    {company.apiKey && (
                      <CopyButton
                        value={company.apiKey}
                        label="Kopieer API key"
                      />
                    )}
                  </div>
                  <div className="rounded-md bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 overflow-x-auto">
                    {company.apiKey ?? (
                      <span className="text-slate-400">Geen API key ingesteld</span>
                    )}
                  </div>
                </div>

                {/* Hosted form blok */}
                <div className="mb-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-600">
                      Hosted form URL
                    </span>
                    <CopyButton
                      value={hostedFormUrl}
                      label="Kopieer URL"
                    />
                  </div>
                  <a
                    href={hostedFormUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-md bg-slate-50 px-3 py-2 text-xs font-mono text-blue-600 hover:bg-slate-100 overflow-x-auto"
                  >
                    {hostedFormUrl}
                  </a>
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                  Gebruik deze API key in{" "}
                  <span className="font-mono">x-api-key</span> headers, en de
                  hosted form URL voor websites, advertenties en QR-codes.
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
