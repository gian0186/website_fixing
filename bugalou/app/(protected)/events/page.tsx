// app/app/events/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function EventsPage() {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId;

  const events = await prisma.event.findMany({
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
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="text-sm text-slate-400">
          Binnengekomen events zoals leads, orders en formulierinzendingen.
        </p>
      </header>

      {events.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-300">
          Nog geen events gevonden voor deze company.
          <br />
          <span className="text-slate-500">
            Test je hosted form of stuur een event naar <code>/api/events</code>.
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 space-y-4">
          {events.map((event) => {
            const created = new Date(event.createdAt).toLocaleString("nl-NL", {
              dateStyle: "short",
              timeStyle: "short",
            });

            return (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 last:border-b-0 pb-3 last:pb-0 gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-200">
                      {event.type}
                    </span>
                    <span className="text-xs text-slate-500">{created}</span>
                  </div>

                  {event.contact && (
                    <p className="text-sm text-slate-200">
                      {event.contact.name || "Naam onbekend"}
                      {event.contact.email && (
                        <span className="text-slate-400">
                          {" "}
                          • {event.contact.email}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="sm:text-right">
                  <a
                    href={`/app/events/${event.id}`}
                    className="text-xs text-sky-400 hover:underline"
                  >
                    Bekijk details →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
