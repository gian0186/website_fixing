// app/app/messages/[id]/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

type MessageDetailPageProps = {
  params: { id: string };
};

export default async function MessageDetailPage({
  params,
}: MessageDetailPageProps) {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId;

  const message = await prisma.message.findFirst({
    where: {
      id: params.id,
      companyId,
    },
    include: {
      contact: true,
    },
  });

  if (!message) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Message niet gevonden</h1>
        <p className="text-sm text-slate-400">
          Dit bericht bestaat niet (meer) of je hebt er geen toegang toe.
        </p>
        <Link
          href="/app/messages"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Terug naar messages
        </Link>
      </div>
    );
  }

  const m = message as any; // voor optionele velden
  const createdAt = new Date(message.createdAt).toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const direction = m.direction ?? "OUTBOUND";
  const status = m.status ?? "CREATED";
  const content = m.content ?? "";

  return (
    <div className="space-y-8">
      {/* Header + meta */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Message details</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                direction === "INBOUND"
                  ? "bg-emerald-900 text-emerald-100"
                  : "bg-sky-900 text-sky-100"
              }`}
            >
              {direction}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 font-medium text-slate-200">
              {status}
            </span>
            <span className="text-slate-400">Aangemaakt op: {createdAt}</span>
          </div>
        </div>

        <div className="text-right">
          <Link
            href="/app/messages"
            className="text-sm text-sky-400 hover:underline"
          >
            ← Terug naar messages
          </Link>
        </div>
      </div>

      {/* Contact info */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Contact</h2>
        {message.contact ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 space-y-1">
            <p>
              Naam:{" "}
              <Link
                href={`/app/contacts/${message.contact.id}`}
                className="text-sky-400 hover:underline"
              >
                {message.contact.name || "Naam onbekend"}
              </Link>
            </p>
            {message.contact.email && (
              <p>
                E-mail:{" "}
                <span className="text-slate-100">{message.contact.email}</span>
              </p>
            )}
            {message.contact.phone && (
              <p>
                Telefoon:{" "}
                <span className="text-slate-100">{message.contact.phone}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            Dit bericht is niet gekoppeld aan een contact.
          </p>
        )}
      </section>

      {/* Message content */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Berichtinhoud</h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 whitespace-pre-wrap">
          {content || (
            <span className="text-slate-500">Geen content beschikbaar.</span>
          )}
        </div>
      </section>
    </div>
  );
}
