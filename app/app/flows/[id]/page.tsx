// app/app/flows/[id]/page.tsx
import { FlowTestForm } from "@/components/FlowTestForm";
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

type FlowDetailsPageProps = {
  params: { id: string };
};

// Simpele type voor het JSON van de builder
type JsonBlock = {
  id?: string;
  type?: "trigger" | "whatsapp" | "wait" | "condition" | string;
  label?: string;
  eventType?: string;
  template?: string;
  minutes?: number;
  expression?: string;
};

function summarizeBlock(block: JsonBlock) {
  switch (block.type) {
    case "trigger":
      return `Event: ${block.eventType ?? "onbekend"}`;
    case "whatsapp":
      return block.template ?? "";
    case "wait":
      return `Wachten ${block.minutes ?? 0} minuten`;
    case "condition":
      return block.expression ?? "";
    default:
      return "";
  }
}

export default async function FlowDetailsPage({
  params,
}: FlowDetailsPageProps) {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId as string;

  const flow = await prisma.flow.findFirst({
    where: {
      id: params.id,
      companyId,
    },
  });

  if (!flow) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Flow niet gevonden</h1>
        <p className="text-sm text-slate-400">
          Deze flow bestaat niet (meer) of je hebt er geen toegang toe.
        </p>
        <Link
          href="/app/flows"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Terug naar flows
        </Link>
      </div>
    );
  }

  // JSON uit de DB (kan null zijn)
  const definition: any = (flow as any).definition ?? null;
  const blocks: JsonBlock[] = Array.isArray(definition?.blocks)
    ? definition.blocks
    : [];

  const createdAt = flow.createdAt.toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const updatedAt = flow.updatedAt.toLocaleString("nl-NL", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{flow.name}</h1>

          {flow.description && (
            <p className="text-sm text-slate-300">{flow.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>
              Trigger:{" "}
              <span className="text-slate-100">{flow.triggerEventType}</span>
            </span>
            <span>•</span>
            <span>
              Status:{" "}
              <span
                className={
                  flow.isActive
                    ? "inline-flex items-center rounded-full bg-emerald-900 px-2 py-0.5 text-[11px] font-medium text-emerald-100"
                    : "inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-200"
                }
              >
                {flow.isActive ? "Actief" : "Inactief"}
              </span>
            </span>
            <span>•</span>
            <span>Aangemaakt: {createdAt}</span>
            <span>•</span>
            <span>Laatst gewijzigd: {updatedAt}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm">
          <Link
            href={`/app/flows/${flow.id}/edit`}
            className="rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-500"
          >
            Flow bewerken
          </Link>
          <Link
            href="/app/flows"
            className="text-xs text-sky-400 hover:underline"
          >
            ← Terug naar overzicht
          </Link>
        </div>
      </div>

      {/* WhatsApp template-voorbeeld */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 space-y-2">
        <h2 className="text-sm font-medium text-slate-100">
          WhatsApp template
        </h2>
        <p className="whitespace-pre-wrap text-xs text-slate-200">
          {flow.messageTemplate}
        </p>
      </section>

      {/* Read-only canvas van de blokken */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-100">Flow-canvas</h2>
          <span className="text-xs text-slate-500">
            {blocks.length} blok{blocks.length === 1 ? "" : "ken"}
          </span>
        </div>

        {blocks.length === 0 ? (
          <p className="text-xs text-slate-500">
            Voor deze flow is nog geen visuele definitie opgeslagen.
          </p>
        ) : (
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <div
                key={block.id ?? index}
                className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                      {block.type ?? "Onbekend"}
                    </span>
                    <span className="text-slate-300">
                      {block.label || "Naamloos blok"}
                    </span>
                  </div>

                  {index < blocks.length - 1 && (
                    <span className="text-[11px] text-slate-500">↓</span>
                  )}
                </div>

                <p className="mt-1 text-slate-400 line-clamp-2">
                  {summarizeBlock(block)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* JSON debug */}
      {definition && (
        <section className="rounded-xl border border-slate-900 bg-slate-950 px-4 py-4">
          <h2 className="mb-2 text-sm font-medium text-slate-100">
            JSON-definitie (debug)
          </h2>
          <pre className="max-h-80 overflow-auto text-[11px] text-slate-300">
            {JSON.stringify(definition, null, 2)}
          </pre>
        </section>
      )}

      {/* 🔽 Nieuw: Flow testen */}
      <FlowTestForm flowId={flow.id} />
    </div>
  );
}
