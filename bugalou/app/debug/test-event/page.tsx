// app/app/debug/test-event/page.tsx
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EventTestForm } from "@/components/EventTestForm";

export default async function TestEventPage() {
  const session = await requireAuth();
  const user = session.user as any;
  const companyId = user.companyId as string;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      name: true,
      apiKey: true,
    },
  });

  if (!company) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-red-400">
          Company niet gevonden
        </h1>
        <p className="text-sm text-slate-400">
          We konden je company niet laden. Neem contact op met support.
        </p>
        <Link href="/app" className="text-sm text-sky-400 hover:underline">
          ← Terug naar dashboard
        </Link>
      </div>
    );
  }

  if (!company.apiKey) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Test events</h1>
        <p className="text-sm text-slate-400">
          Er is nog geen <span className="font-semibold">API key</span>{" "}
          ingesteld voor deze omgeving, dus het debug-endpoint{" "}
          <code className="rounded bg-slate-800 px-1 py-0.5 text-[11px]">
            /api/events
          </code>{" "}
          kan niet gebruikt worden.
        </p>
        <p className="text-sm text-slate-400">
          Ga eerst naar{" "}
          <Link
            href="/app/settings"
            className="text-sky-400 hover:underline"
          >
            Instellingen
          </Link>{" "}
          om de API key te bekijken of aan te maken.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Events testen</h1>
          <p className="text-sm text-slate-400">
            Stuur een test-event naar{" "}
            <code className="rounded bg-slate-800 px-1 py-0.5 text-[11px]">
              /api/events
            </code>{" "}
            alsof het vanuit WooCommerce, Shopify of een formulier komt.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-xs">
          <Link href="/app" className="text-sky-400 hover:underline">
            ← Terug naar dashboard
          </Link>
        </div>
      </div>

      {/* Uitleg */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-300 space-y-1">
        <p>
          - We gebruiken dezelfde endpoint als externe systemen:{" "}
          <code className="rounded bg-slate-800 px-1 py-0.5">
            POST /api/events
          </code>
        </p>
        <p>
          - De juiste{" "}
          <code className="bg-slate-800 px-1 py-0.5 rounded">
            x-api-key
          </code>{" "}
          header wordt automatisch meegestuurd.
        </p>
        <p>
          - Alle actieve flows die luisteren op het gekozen event-type worden
          uitgevoerd (bijv. <code>lead_created</code>,{" "}
          <code>order_created</code>, …).
        </p>
      </section>

      {/* Formulier */}
      <EventTestForm apiKey={company.apiKey} />
    </div>
  );
}
