// app/app/debug/contacts/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Message, Event } from "@prisma/client";

type Props = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export default async function DebugContactDetailPage({ params }: Props) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      events: {
        orderBy: { createdAt: "desc" },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!contact) return notFound();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Debug · Contact · {contact.name || "Onbekend"}
            </h1>
            <p className="text-sm text-slate-500">
              {contact.email || contact.phone || "Geen contactgegevens"} · Company:{" "}
              <span className="font-medium">{contact.company.name}</span>
            </p>
          </div>
          <Link
            href="/app/debug/messages"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Terug naar messages
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
          {/* Thread (messages) */}
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              Conversation
            </h2>
            <div className="space-y-3">
              {contact.messages.length === 0 && (
                <p className="text-sm text-slate-500">
                  Nog geen messages voor dit contact.
                </p>
              )}

              {contact.messages.map((m: Message) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                    m.direction === "OUTBOUND"
                      ? "ml-auto bg-emerald-50"
                      : "mr-auto bg-slate-50"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                    <span>{m.direction}</span>
                    <span>
                      {m.createdAt.toLocaleString("nl-NL", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-slate-800">
                    {m.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Events + meta */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                Contact info
              </h2>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Naam</dt>
                  <dd className="font-medium">{contact.name || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">E-mail</dt>
                  <dd className="font-medium">{contact.email || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Telefoon</dt>
                  <dd className="font-medium">{contact.phone || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Aangemaakt</dt>
                  <dd className="font-medium">
                    {contact.createdAt.toLocaleString("nl-NL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                Events ({contact.events.length})
              </h2>
              <ul className="space-y-2 text-sm">
                {contact.events.map((e: Event) => (
                  <li
                    key={e.id}
                    className="rounded border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                        {e.type}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {e.createdAt.toLocaleString("nl-NL", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    {e.data && (
                      <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words text-[11px] text-slate-600">
                        {JSON.stringify(e.data, null, 2)}
                      </pre>
                    )}
                  </li>
                ))}

                {contact.events.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Nog geen events voor dit contact.
                  </p>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
