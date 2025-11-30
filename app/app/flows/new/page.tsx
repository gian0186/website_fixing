// app/app/flows/new/page.tsx
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { FlowCreateForm } from "@/components/FlowCreateForm";

export default async function NewFlowPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Nieuwe flow</h1>
          <p className="text-sm text-slate-400">
            Maak een automatische WhatsApp-flow aan die reageert op een
            binnenkomend event.
          </p>
        </div>

        <div className="text-right">
          <Link
            href="/app/flows"
            className="text-sm text-sky-400 hover:underline"
          >
            ← Terug naar flows
          </Link>
        </div>
      </div>

      {/* Alleen aanmaakformulier, nog geen visuele builder hier */}
      <FlowCreateForm />
    </div>
  );
}
