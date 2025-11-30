// app/app/contacts/[id]/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient, Event, Message } from "@prisma/client";
import Link from "next/link";
import { ContactDeleteButton } from "@/components/ContactDeleteButton";

const prisma = new PrismaClient();

type ContactDetailPageProps = {
  params: { id: string };
};

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId as string;

  const contact = await prisma.contact.findFirst({
    where: { id: params.id, companyId },
    include: {
      events: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!contact) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Contact niet gevonden</h1>
        <p className="text-sm text-slate-400">
          Dit contact bestaat niet (meer) of je hebt er geen toegang toe.
        </p>
        <Link
          href="/app/contacts"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Terug naar contacten
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {contact.name || "Naamloos contact"}
          </h1>
          <p className="text-sm text-slate-400">
            Telefoon:{" "}
            <span className="text-slate-100">{contact.phone || "—"}</span>
            {" • "}
            E-mail:{" "}
            <span className="text-slate-100">{contact.email || "—"}</span>
          </p>
        </div>

        <div className="text-right text-xs space-y-2">
          <Link
            href="/app/contacts"
            className="block text-slate-400 hover:underline"
          >
            ← Terug naar contacten
          </Link>

          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/app/contacts/${contact.id}/edit`}
              className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-3 py-1 text-xs font-medium text-white hover:bg-sky-500"
            >
              Bewerken
            </Link>

            <ContactDeleteButton contactId={contact.id} />
          </div>
        </div>
      </div>

      {/* Laatste events */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 space-y-2">
        <h2 className="text-sm font-medium text-slate-100">Laatste events</h2>
        {contact.events.length === 0 ? (
          <p className="text-xs text-slate-500">Nog geen events gekoppeld.</p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-300">
            {contact.events.map((ev: Event) => (
              <li key={ev.id} className="flex justify-between">
                <span>{ev.type}</span>
                <span className="text-slate-500">
                  {new Date(ev.createdAt).toLocaleString("nl-NL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Laatste WhatsApp-berichten */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 space-y-2">
        <h2 className="text-sm font-medium text-slate-100">
          Laatste WhatsApp-berichten
        </h2>
        {contact.messages.length === 0 ? (
          <p className="text-xs text-slate-500">
            Nog geen berichten gekoppeld aan dit contact.
          </p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-300">
            {contact.messages.map((m: Message) => (
              <li key={m.id} className="flex justify-between">
                <span className="line-clamp-1">{m.content}</span>
                <span className="text-slate-500">
                  {new Date(m.createdAt).toLocaleString("nl-NL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
