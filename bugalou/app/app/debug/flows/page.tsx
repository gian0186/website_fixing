// app/debug/flows/page.tsx
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// SERVER ACTIONS
async function updateFlow(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const triggerEventType = (formData.get("triggerType") as string) || "";
  const messageTemplate = (formData.get("template") as string) || "";
  const isActive = formData.get("isActive") === "on";

  await prisma.flow.update({
    where: { id },
    data: {
      triggerEventType,
      messageTemplate,
      isActive,
    },
  });

  revalidatePath("/debug/flows");
}

async function createFlow(formData: FormData) {
  "use server";

  const companyId = formData.get("companyId") as string;
  const name = (formData.get("name") as string) || "Nieuwe flow";
  const triggerEventType = (formData.get("triggerType") as string) || "";
  const messageTemplate = (formData.get("template") as string) || "";

  if (!companyId) return;

  await prisma.flow.create({
    data: {
      companyId,
      name,
      triggerEventType,
      messageTemplate,
      isActive: true,
    },
  });

  revalidatePath("/debug/flows");
}

// PAGE
export default async function DebugFlowsPage() {
  const flows = await prisma.flow.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Debug · Flows</h1>
          <p className="text-sm text-slate-500">
            Eenvoudige “no-code” editor om triggers & templates te tweaken.
          </p>
        </header>

        {/* Nieuwe flow */}
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Nieuwe flow aanmaken
          </h2>
          <form action={createFlow} className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Company
              </label>
              <select
                name="companyId"
                className="w-full rounded border px-2 py-1.5 text-sm"
                required
              >
                <option value="">Kies company…</option>
                {companies.map((c: (typeof companies)[number]) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Flow naam
              </label>
              <input
                name="name"
                className="w-full rounded border px-2 py-1.5 text-sm"
                placeholder="Bijv. Lead created → Welkomstbericht"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Trigger event type
              </label>
              <input
                name="triggerType"
                className="w-full rounded border px-2 py-1.5 text-sm"
                placeholder="bijv. lead_created"
                required
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-slate-600">
                WhatsApp template
              </label>
              <textarea
                name="template"
                rows={3}
                className="w-full rounded border px-2 py-1.5 text-sm"
                placeholder="Bijv: Hoi {{contact.name}}, bedankt voor je aanvraag…"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded bg-black px-4 py-1.5 text-sm font-medium text-white"
              >
                Flow aanmaken
              </button>
            </div>
          </form>
        </section>

        {/* Bestaande flows */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Bestaande flows ({flows.length})
          </h2>

          <div className="space-y-3">
            {flows.map((flow: (typeof flows)[number]) => (
              <form
                key={flow.id}
                action={updateFlow}
                className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1.4fr,1fr]"
              >
                <input type="hidden" name="id" value={flow.id} />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">
                        {flow.name || "Naamloze flow"}
                      </div>
                      <div className="text-xs text-slate-500">
                        Company: {flow.company?.name ?? "—"} ({flow.companyId})
                      </div>
                    </div>
                    <label className="flex items-center gap-1 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={flow.isActive}
                        className="h-3 w-3"
                      />
                      Actief
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Trigger event type
                    </label>
                    <input
                      name="triggerType"
                      defaultValue={flow.triggerEventType}
                      className="w-full rounded border px-2 py-1.5 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">
                      Template
                    </label>
                    <textarea
                      name="template"
                      defaultValue={flow.messageTemplate}
                      rows={3}
                      className="w-full rounded border px-2 py-1.5 text-sm"
                    />
                    <p className="text-[11px] text-slate-500">
                      Je kunt variabelen gebruiken zoals{" "}
                      <code className="rounded bg-slate-100 px-1">
                        {"{{contact.name}}"}
                      </code>{" "}
                      of{" "}
                      <code className="rounded bg-slate-100 px-1">
                        {"{{company.name}}"}
                      </code>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3 text-xs text-slate-500">
                  <div>
                    <div>
                      Aangemaakt: {flow.createdAt.toLocaleString()}
                    </div>
                    <div>Laatst gewijzigd: {flow.updatedAt.toLocaleString()}</div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Flow opslaan
                    </button>
                  </div>
                </div>
              </form>
            ))}

            {flows.length === 0 && (
              <p className="text-sm text-slate-500">
                Nog geen flows. Maak er één bovenaan aan om je eerste
                automatisering te testen.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
