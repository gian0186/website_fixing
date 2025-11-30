// app/debug/events/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type EventWithRelations = {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
  } | null;
  contact: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string;
  } | null;
  type: string;
  payload: any;
  createdAt: Date;
};

export default async function DebugEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      company: { select: { id: true, name: true } },
      contact: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Debug · Events</h1>
          <Link
            href="/debug/messages"
            className="text-sm text-blue-600 hover:underline"
          >
            Ga naar messages →
          </Link>
        </header>

        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Payload</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e: EventWithRelations) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium">
                      {e.company?.name ?? "—"}
                    </div>
                    <div className="text-xs text-slate-500">{e.companyId}</div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    {e.contact ? (
                      <div className="space-y-0.5">
                        <Link
                          href={`/debug/contacts/${e.contact.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {e.contact.name || "Onbekend"}
                        </Link>
                        <div className="text-xs text-slate-500">
                          {e.contact.email || e.contact.phone || "—"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Geen contact</span>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {e.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top max-w-xs text-xs text-slate-700">
                    <pre className="whitespace-pre-wrap break-words">
                      {e.payload ? JSON.stringify(e.payload, null, 2) : "—"}
                    </pre>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-500">
                    {e.createdAt.toISOString()}
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-slate-500"
                  >
                    Nog geen events gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
