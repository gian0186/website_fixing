// app/debug/messages/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DebugMessagesPage() {
  const messages = await prisma.message.findMany({
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
          <h1 className="text-2xl font-semibold">Debug · Messages</h1>
          <Link
            href="/debug/events"
            className="text-sm text-blue-600 hover:underline"
          >
            Ga naar events →
          </Link>
        </header>

        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Direction</th>
                {/* Als je een status-veld hebt, kun je deze kolom gebruiken */}
                {/* <th className="px-3 py-2">Status</th> */}
                <th className="px-3 py-2">Content</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium">
                      {m.company?.name ?? "—"}
                    </div>
                    <div className="text-xs text-slate-500">{m.companyId}</div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    {m.contact ? (
                      <div className="space-y-0.5">
                        <Link
                          href={`/debug/contacts/${m.contact.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {m.contact.name || "Onbekend"}
                        </Link>
                        <div className="text-xs text-slate-500">
                          {m.contact.email || m.contact.phone || "—"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Geen contact</span>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.direction === "outbound"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {m.direction}
                    </span>
                  </td>
                  {/* <td className="px-3 py-2 align-top text-xs text-slate-600">
                    {(m as any).status ?? "—"}
                  </td> */}
                  <td className="px-3 py-2 align-top max-w-xs text-xs text-slate-800">
                    <pre className="whitespace-pre-wrap break-words">
                      {m.body}
                    </pre>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-500">
                    {m.createdAt.toISOString()}
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-slate-500"
                  >
                    Nog geen messages gevonden.
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
