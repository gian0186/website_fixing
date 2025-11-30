// app/app/debug/events/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Event = {
  id: string;
  companyId: string;
  type: string;
  data: any;
  createdAt: Date;
};

type Company = {
  id: string;
  name: string;
};

type Contact = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

type EventWithRelations = Event & {
  company: Company;
  contact: Contact | null;
};

export const dynamic = "force-dynamic";

export default async function DebugEventsPage() {
  const events: EventWithRelations[] = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      company: true,
      contact: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Debug · Events</h1>
            <p className="text-sm text-slate-500">
              Laatste events over alle companies (max. 200).
            </p>
          </div>
          <Link
            href="/app/debug"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Terug naar debug overzicht
          </Link>
        </header>

        <section className="rounded-lg border bg-white p-4">
          {events.length === 0 ? (
            <p className="text-sm text-slate-500">
              Er zijn nog geen events opgeslagen.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs font-semibold text-slate-500">
                    <th className="px-3 py-2">Datum</th>
                    <th className="px-3 py-2">Company</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e: EventWithRelations) => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="px-3 py-2 align-top text-xs text-slate-600 whitespace-nowrap">
                        {e.createdAt.toLocaleString("nl-NL", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-3 py-2 align-top text-xs text-slate-700">
                        <div className="font-medium">{e.company.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {e.companyId}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-xs">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {e.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-xs text-slate-700">
                        {e.contact ? (
                          <div className="space-y-0.5">
                            <div className="font-medium">
                              {e.contact.name || "Onbekend"}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {e.contact.phone}
                            </div>
                            {e.contact.email && (
                              <div className="text-[11px] text-slate-500">
                                {e.contact.email}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Geen contact gekoppeld
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top text-xs">
                        <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-50 p-2 text-[11px] text-slate-700">
                          {JSON.stringify(e.data, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
