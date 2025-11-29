"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FlowEditFormProps = {
  flowId: string;
  initialName: string;
  initialTriggerType: string;
  initialDescription: string | null;
  initialTemplate: string;
  initialIsActive: boolean;
};

export function FlowEditForm({
  flowId,
  initialName,
  initialTriggerType,
  initialDescription,
  initialTemplate,
  initialIsActive,
}: FlowEditFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [triggerType, setTriggerType] = useState(initialTriggerType);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [template, setTemplate] = useState(initialTemplate);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/flows/${flowId}`, {
        method: "PATCH",
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

      // Terug naar flow details
      router.push(`/app/flows/${flowId}`);
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
          <code>{"{{email}}"}</code>.
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
        <label htmlFor="isActive" className="text-sm text-slate-200 select-none">
          Flow is actief
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
      >
        {loading ? "Opslaan..." : "Wijzigingen opslaan"}
      </button>
    </form>
  );
}
