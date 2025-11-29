"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

type Props = {
  initialApiKey: string | null;
};

export default function ApiKeySection({ initialApiKey }: Props) {
  const [apiKey, setApiKey] = useState(initialApiKey ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/company/api-key", {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? `Er ging iets mis (status ${res.status}).`);
        return;
      }

      if (data.apiKey) {
        setApiKey(data.apiKey);
        setMessage("Nieuwe API key gegenereerd ✅");
      } else {
        setError("Server gaf geen API key terug.");
      }
    } catch {
      setError("Kon geen verbinding maken met de server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">
          API key
        </span>

        {apiKey && (
          <CopyButton value={apiKey} label="Kopieer API key" />
        )}
      </div>

      <div className="rounded-md bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 overflow-x-auto">
        {apiKey || <span className="text-slate-400">Geen API key ingesteld</span>}
      </div>

      <p className="mt-1 text-[11px] text-slate-400">
        Gebruik deze key in de <span className="font-mono">x-api-key</span>{" "}
        header wanneer je events naar{" "}
        <span className="font-mono">/api/events</span> stuurt.
      </p>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Nieuwe API key genereren"}
        </button>

        <p className="text-[11px] text-slate-400">
          Let op: oude API key werkt niet meer nadat je een nieuwe hebt
          aangemaakt.
        </p>
      </div>

      {message && (
        <p className="text-xs text-emerald-600">{message}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
