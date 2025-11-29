"use client";

import { useState } from "react";

type Props = {
  initialSlug: string | null;
};

export default function CompanySlugForm({ initialSlug }: Props) {
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/company/slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? `Er ging iets mis (status ${res.status}).`);
      } else {
        setMessage("Slug opgeslagen ✅");
      }
    } catch {
      setError("Kon geen verbinding maken met de server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4 border-t border-slate-200 pt-4">
      <label className="text-xs font-medium text-slate-600">
        Slug (URL naam)
      </label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">
          /form/
        </span>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-mono"
          placeholder="bijv. boender-outdoor"
        />
      </div>
      <p className="text-[11px] text-slate-400">
        Dit bepaalt de URL van je hosted formulier. Alleen kleine letters, cijfers en koppeltekens
        zijn toegestaan (a-z, 0-9, -).
      </p>

      {message && (
        <p className="text-xs text-emerald-600">{message}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Slug opslaan..." : "Slug opslaan"}
      </button>
    </form>
  );
}
