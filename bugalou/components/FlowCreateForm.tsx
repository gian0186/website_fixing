// components/FlowCreateForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FlowCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState("lead_created");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState(
    "Hi {{name}}, bedankt voor je aanvraag! We nemen snel contact met je op."
  );
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          triggerType,
          description,
          template,
          isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Er ging iets mis bij het opslaan.");
      }

      // Succes → terug naar flows overzicht
      router.push("/app/flows");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Onbekende fout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && (
        <div className="rounded-lg border border-red-500/60 bg-red-900/40 px-4 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Naam van de flow
        </label>
        <input
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bijv. Lead nurture – welkomsbericht"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Trigger event type
        </label>
        <input
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
          placeholder="Bijv. lead_created, order_created"
          required
        />
        <p className="text-xs text-slate-500">
          Dit moet overeenkomen met het <code>event.type</code> dat je backend
          aanmaakt.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Beschrijving
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Korte toelichting wat deze flow doet."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          WhatsApp template / bericht
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 min-h-[120px]"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />
        <p className="text-xs text-slate-500">
          Je kunt placeholders gebruiken zoals <code>{"{{name}}"}</code> of{" "}
          <code>{"{{email}}"}</code>. Je flow-engine kan deze later vervangen.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500"
        />
        <label
          htmlFor="isActive"
          className="text-sm text-slate-200 select-none"
        >
          Flow is actief
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
      >
        {loading ? "Opslaan..." : "Flow aanmaken"}
      </button>
    </form>
  );
}
