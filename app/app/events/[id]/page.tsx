// app/app/events/[id]/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

type EventDetailPageProps = {
  params: { id: string };
};

type MessageWithFields = {
  id: string;
  createdAt: Date;
  direction?: string;
  status?: string;
  content?: string;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId;

  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
      companyId,
    },
    include: {
      contact: true,
    },
  });

  if (!event) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Event niet gevonden</h1>
        <p className="text-sm text-slate-400">
          Dit event bestaat niet (meer) of je hebt er geen toegang toe.
        </p>
        <Link
          href="/app/events"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Terug naar events
        </Link>
      </div>
    );
  }

  // Messages ophalen die aan dit event gekoppeld zijn
  // We gaan er vanuit dat je Message model een eventId heeft.
  const messages = await prisma.message.findMany({
    where: { eventId: params.id } as any, // cast naar any om TS niet te laten zeuren als eventId anders heet
    orderBy: { createdAt: "asc" },
  });

  const createdAt = new Date(event.createdAt).toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const e = event as any;
  const payload = e.data ?? null; // optioneel: data JSON van het event

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-200">
              {event.type}
            </span>
            <span className="text-xs text-slate-400">
              Binnengekomen op: {createdAt}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">Event details</h1>

          {event.contact && (
            <p className="text-sm text-slate-300">
              Contact:{" "}
              <Link
                href={`/app/contacts/${event.contact.id}`}
                className="text-sky-400 hover:underline"
              >
                {event.contact.name || "Naam onbekend"}
              </Link>
              {event.contact.email && (
                <span className="text-slate-400">
                  {" "}
                  • {event.contact.email}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="text-right">
          <Link
            href="/app/events"
            className="text-sm text-sky-400 hover:underline"
          >
            ← Terug naar events
          </Link>
        </div>
      </div>

      {/* Optioneel: raw event data */}
      {payload && (
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Event payload</h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-200 whitespace-pre-wrap">
            {JSON.stringify(payload, null, 2)}
          </div>
        </section>
      )}

      {/* Messages timeline */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Messages voor dit event</h2>

        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">
            Er zijn (nog) geen messages aangemaakt vanuit dit event.
          </p>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
            {messages.map((message: MessageWithFields) => {
              const m = message as any;
              const created = new Date(message.createdAt).toLocaleString(
                "nl-NL",
                {
                  dateStyle: "short",
                  timeStyle: "short",
                }
              );

              const direction = m.direction ?? "OUTBOUND";
              const status = m.status ?? "CREATED";
              const content = m.content ?? "";

              return (
                <div
                  key={message.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 last:border-b-0 pb-3 last:pb-0 gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          direction === "INBOUND"
                            ? "bg-emerald-900 text-emerald-100"
                            : "bg-sky-900 text-sky-100"
                        }`}
                      >
                        {direction}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-200">
                        {status}
                      </span>
                      <span className="text-xs text-slate-500">{created}</span>
                    </div>

                    <p className="text-sm text-slate-200 line-clamp-2">
                      {content || (
                        <span className="text-slate-500">
                          Geen content beschikbaar.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <Link
                      href={`/app/messages/${message.id}`}
                      className="text-xs text-sky-400 hover:underline"
                    >
                      Bekijk message →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
