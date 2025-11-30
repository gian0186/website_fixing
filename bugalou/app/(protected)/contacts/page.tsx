// app/app/contacts/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ContactDeleteButton } from "@/components/ContactDeleteButton";

const prisma = new PrismaClient();

type ContactWithEvents = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  events: Array<{
    id: string;
    type: string;
    createdAt: Date;
  }>;
};

export default async function ContactsPage() {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId as string;

  const contacts = await prisma.contact.findMany({
    where: { companyId },
    include: {
      events: {
        select: { id: true, type: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Contacten</h1>
        <p className="text-sm text-slate-400">
          Overzicht van alle leads en contacten die via forms, WooCommerce of
          integraties in Bugalou zijn binnengekomen.
        </p>
      </header>

      <div className="flex justify-end">
        <Link
          href="/app/contacts/new"
          className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Nieuw contact
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-300">
          Nog geen contacten gevonden voor deze company.
          <br />
          <span className="text-slate-500">
            Voeg handmatig een contact toe of stuur een event naar{" "}
            <code>/api/events</code> om de eerste lead te zien verschijnen.
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/70 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-300">
                  Naam
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">
                  Telefoon
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">
                  Events
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">
                  Laatste event
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-300">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: ContactWithEvents) => {
                const lastEvent = contact.events[0];
                const lastEventDate = lastEvent
                  ? new Date(lastEvent.createdAt).toLocaleString("nl-NL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "—";

                return (
                  <tr
                    key={contact.id}
                    className="border-t border-slate-800 hover:bg-slate-800/60 transition-colors"
                  >
                    {/* Naam is nu GEEN link meer */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-100">
                      {contact.name || "Naam onbekend"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-200">
                      {contact.email || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-200">
                      {contact.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {contact.events.length}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{lastEventDate}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap space-x-3">
                      <Link
                        href={`/app/contacts/${contact.id}`}
                        className="text-sky-400 hover:underline"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/app/contacts/${contact.id}/edit`}
                        className="text-sky-400 hover:underline"
                      >
                        Bewerken
                      </Link>
                      <ContactDeleteButton contactId={contact.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
