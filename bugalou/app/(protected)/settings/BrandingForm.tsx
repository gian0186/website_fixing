"use client";

import { useState } from "react";

type Props = {
  initialPrimaryColor: string;
  initialAccentColor: string;
  initialIntroText: string;
};

export default function BrandingForm({
  initialPrimaryColor,
  initialAccentColor,
  initialIntroText,
}: Props) {
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [introText, setIntroText] = useState(initialIntroText);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/company/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryColor,
          accentColor,
          introText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis bij het opslaan.");
      } else {
        setMessage("Branding opgeslagen ✅");
      }
    } catch (err) {
      setError("Kon geen verbinding maken met de server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 border-t border-slate-200 pt-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Branding aanpassen
      </h3>
      <p className="text-xs text-slate-500">
        Pas hier de kleuren en introductietekst aan die gebruikt worden
        op het hosted formulier.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Primaire kleur
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-9 w-9 rounded-md border border-slate-300 bg-white cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Accentkleur
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-9 w-9 rounded-md border border-slate-300 bg-white cursor-pointer"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <label className="text-xs font-medium text-slate-600">
          Introductietekst
        </label>
        <textarea
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs"
        />
        <p className="text-[11px] text-slate-400">
          Deze tekst wordt bovenaan je hosted formulier getoond.
        </p>
      </div>

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
        {saving ? "Opslaan..." : "Branding opslaan"}
      </button>
    </form>
  );
}
