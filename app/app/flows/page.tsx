// app/app/flows/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { FlowToggleActive } from "@/components/FlowToggleActive";
import { FlowDeleteButton } from "@/components/FlowDeleteButton";

const prisma = new PrismaClient();

export default async function FlowsPage() {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId;

  const flows = await prisma.flow.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header + knop nieuwe flow */}
      <div className="flex items-start justify-between gap-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Flows</h1>
          <p className="text-sm text-slate-400">
            Overzicht van automatische WhatsApp-flows die reageren op
            binnenkomende events.
          </p>
        </header>

        <a
          href="/app/flows/new"
          className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Nieuwe flow
        </a>
      </div>

      {flows.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-300">
          Nog geen flows gevonden voor deze company.
          <br />
          <span className="text-slate-500">
            Voeg een flow toe via de backend of je toekomstige flow-builder om
            hier flows te zien.
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          {flows.map((flow) => {
            const f = flow as any;
            const name = f.name ?? "Naamloze flow";
            const description =
              f.description ?? f.note ?? "Geen beschrijving toegevoegd.";
            const isActive = f.isActive ?? f.enabled ?? f.active ?? false;
            const trigger =
              f.triggerEventType ??
              f.triggerType ??
              f.eventType ??
              f.trigger ??
              "Onbekende trigger";

            const createdAt = new Date(flow.createdAt).toLocaleString("nl-NL", {
              dateStyle: "short",
              timeStyle: "short",
            });

            return (
              <div
                key={flow.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 last:border-b-0 pb-3 last:pb-0 gap-2"
              >
                {/* Linkerkant: naam, status, switch, meta, beschrijving */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-slate-100">
                      {name}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        isActive
                          ? "bg-emerald-900 text-emerald-100"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {isActive ? "Actief" : "Inactief"}
                    </span>

                    <FlowToggleActive
                      flowId={flow.id}
                      initialActive={isActive}
                    />
                  </div>

                  <p className="text-xs text-slate-400">
                    Trigger: <span className="text-slate-200">{trigger}</span>
                    {" • "}
                    Aangemaakt op{" "}
                    <span className="text-slate-300">{createdAt}</span>
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {description}
                  </p>
                </div>

                {/* Rechterkant: actions */}
                <div className="sm:text-right text-xs space-x-2 text-slate-300">
                  <a
                    href={`/app/flows/${flow.id}`}
                    className="text-sky-400 hover:underline"
                  >
                    Details
                  </a>
                  <span>·</span>
                  <a
                    href={`/app/flows/${flow.id}/edit`}
                    className="text-sky-400 hover:underline"
                  >
                    Bewerken
                  </a>
                  <span>·</span>
                  <FlowDeleteButton flowId={flow.id} flowName={name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
