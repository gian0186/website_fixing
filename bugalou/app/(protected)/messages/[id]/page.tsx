// app/app/messages/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MessageWithContact = {
  id: string;
  content: string;
  createdAt: Date;
  contact: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

export default async function MessagesPage() {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId;

  const messages = await prisma.message.findMany({
    where: { companyId },
    include: {
      contact: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-slate-400">
          Overzicht van WhatsApp-berichten die door Bugalou zijn aangemaakt.
          Momenteel nog fake verzending, later gekoppeld aan een echte provider.
        </p>
      </header>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-300">
          Nog geen messages gevonden voor deze company.
          <br />
          <span className="text-slate-500">
            Maak een flow aan of stuur een test-event dat een WhatsApp-flow
            triggert om hier berichten te zien.
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          {messages.map((message: MessageWithContact) => {
            const m = message as any; // flexibel t.o.v. veldnamen
            const created = new Date(message.createdAt).toLocaleString("nl-NL", {
              dateStyle: "short",
              timeStyle: "short",
            });

            const direction = m.direction ?? "OUTBOUND";
            const status = m.status ?? "CREATED";
            const content = m.content ?? "";

            return (
              <div
                key={message.id}
                className="flex flex-col gap-2 border-b border-slate-800 last:border-b-0 pb-3 last:pb-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
                        <span className="text-slate-500">Geen content</span>
                      )}
                    </p>

                    {message.contact && (
                      <p className="text-xs text-slate-400">
                        Voor:{" "}
                        <a
                          href={`/app/contacts/${message.contact.id}`}
                          className="hover:text-sky-400"
                        >
                          {message.contact.name || "Naam onbekend"}
                        </a>
                        {message.contact.email && ` • ${message.contact.email}`}
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <a
                      href={`/app/messages/${message.id}`}
                      className="text-xs text-sky-400 hover:underline"
                    >
                      Bekijk details →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
