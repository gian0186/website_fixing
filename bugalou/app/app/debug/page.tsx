import Link from "next/link";
import { requireAuth } from "@/lib/auth";

export default async function DebugIndexPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Debug & tools</h1>
      <p className="text-slate-400 text-sm">
        Handige tools om je flows, events en WhatsApp-berichten te testen.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/app/debug/test-event"
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800 transition"
        >
          <h2 className="font-medium text-slate-100">Event testen</h2>
          <p className="text-slate-400 text-sm">
            Stuur test-events alsof ze uit WooCommerce, Shopify of formulieren komen.
          </p>
        </Link>

        <Link
          href="/app/debug/run-flow"
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800 transition"
        >
          <h2 className="font-medium text-slate-100">Flow uitvoeren</h2>
          <p className="text-slate-400 text-sm">
            Test een flow direct zonder echt event.
          </p>
        </Link>

        <Link
          href="/app/debug/send-whatsapp"
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800 transition"
        >
          <h2 className="font-medium text-slate-100">WhatsApp test</h2>
          <p className="text-slate-400 text-sm">
            Simuleer berichten naar je WhatsApp-integratie.
          </p>
        </Link>

        <Link
          href="/app/debug/events"
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800 transition"
        >
          <h2 className="font-medium text-slate-100">Event logs</h2>
          <p className="text-slate-400 text-sm">
            Bekijk binnengekomen events en debug data.
          </p>
        </Link>
      </div>
    </div>
  );
}
