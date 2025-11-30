// app/flows/[id]/page.tsx

// Dit maakt het bestand een Client Component
"use client"; 

import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

type FlowPageProps = {
  params: { id: string };
};

export default async function FlowDetailPage({ params }: FlowPageProps) {
  const session = await requireAuth();
  const user = session.user as any;
  const companyId = user.companyId as string;

  const flow = await prisma.flow.findFirst({
    where: { id: params.id, companyId },
  });

  if (!flow) {
    return <div>Flow niet gevonden.</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{flow.name}</h1>
          <p className="text-sm text-slate-500">
            Trigger: <span className="font-mono">{flow.triggerEventType}</span>
          </p>
        </div>
        <Link
          href={`/app/flows/${flow.id}/edit`}
          className="rounded bg-sky-600 px-3 py-1.5 text-sm text-white"
        >
          Flow bewerken
        </Link>
      </div>

      {/* eventueel andere flow-info hier... */}

      <TestFlowSection flowId={flow.id} />
    </div>
  );
}

// --- Test sectie (client component) ---
function TestFlowSection({ flowId }: { flowId: string }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("Test contact");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTest(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/flows/${flowId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Onbekende fout");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err?.message || "Er ging iets mis");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-4">
      <h2 className="text-lg font-semibold">Flow testen</h2>
      <p className="text-sm text-slate-400">
        Stuur een testbericht naar je eigen telefoonnummer om te controleren of
        de flow en WhatsApp-koppeling goed werken.
      </p>

      <form onSubmit={handleTest} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Test-telefoonnummer</label>
          <input
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            placeholder="Bijv. 0643201748 of +31643201748"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Naam (optioneel)</label>
          <input
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !phone}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Flow testen..." : "Test deze flow"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-400">
          Fout bij testen: {error}
        </p>
      )}

      {result && (
        <div className="text-xs text-slate-400 space-y-1">
          <p>
            <span className="font-semibold">Triggered flows:</span>{" "}
            {result.triggeredFlows}
          </p>
          <p>
            <span className="font-semibold">Messages sent:</span>{" "}
            {result.messagesSent}
          </p>
        </div>
      )}
    </div>
  );
}
