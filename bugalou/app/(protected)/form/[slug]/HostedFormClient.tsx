"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

type HostedFormClientProps = {
  companyId: string;
  companyName: string;
  apiKey: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  introText: string;
};

export default function HostedFormClient({
  companyId,
  companyName,
  apiKey,
  logoUrl,
  primaryColor,
  accentColor,
  introText,
}: HostedFormClientProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    setStatus("submitting");
    setMessage(null);

    const formData = new FormData(form);

    const name = (formData.get("name") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";
    const note = (formData.get("note") as string) ?? "";

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          type: "lead_created",
          contact: { name, email, phone },
          payload: {
            source: `hosted-form-${companyId}`,
            note,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with ${res.status}`);
      }

      setStatus("success");
      setMessage("Bedankt! Je aanvraag is ontvangen 🙌");
      form.reset();
    } catch (err: any) {
      console.error("Error submitting form", err);
      setStatus("error");
      setMessage(
        err?.message ||
          "Er ging iets mis bij het versturen. Probeer het opnieuw."
      );
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: `${primaryColor}0d` }} // lichte tint van primary
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-md p-6 md:p-8 border border-slate-100">
        {/* Header met logo + titel */}
        <div className="flex items-center gap-3 mb-4">
          {logoUrl && (
            <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={companyName}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <div>
            <h1 className="text-xl font-semibold">
              {companyName} · Aanvraagformulier
            </h1>
            <p className="text-xs text-slate-500">
              Gehost door <span className="font-medium">Bugalou</span>
            </p>
          </div>
        </div>

        {/* Intro uit database */}
        <p className="text-sm text-slate-600 mb-6">{introText}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Naam
            </label>
            <input
              name="name"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:border-transparent"
              placeholder="Bijv. Gian Tester"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:border-transparent"
              placeholder="jij@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefoon
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:border-transparent"
              placeholder="+31612345678"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bericht / notitie
            </label>
            <textarea
              name="note"
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:border-transparent"
              placeholder="Optioneel: waar gaat je aanvraag over?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-md text-white text-sm font-medium py-2.5 disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
          >
            {status === "submitting" ? "Verzenden..." : "Aanvraag versturen"}
          </button>

          {message && (
            <p
              className={`text-sm mt-2 ${
                status === "success" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-xs text-slate-400 flex items-center gap-1">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          Dit formulier wordt gehost door Bugalou voor {companyName}. Je
          gegevens worden gebruikt om je aanvraag op te volgen.
        </p>
      </div>
    </main>
  );
}
