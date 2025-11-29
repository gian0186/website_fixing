// app/form/test/page.tsx
"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function TestHostedFormPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Form ref opslaan vóór de eerste await (anders wordt e.currentTarget later null)
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
          // apiKey van je test-company (uit .env.local)
          "x-api-key":
            process.env.NEXT_PUBLIC_TEST_API_KEY ?? "test-api-key",
        },
        body: JSON.stringify({
          type: "lead_created",
          contact: {
            name,
            email,
            phone,
          },
          payload: {
            source: "hosted-form-test",
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

      // formulier leegmaken via de opgeslagen ref
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
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-2">
          Bugalou · Test formulier
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Vul dit formulier in om een{" "}
          <code className="bg-slate-100 px-1 rounded">lead_created</code>{" "}
          event te sturen naar je Bugalou backend. Je ziet de resultaten terug
          in <span className="font-medium">/debug/events</span> en{" "}
          <span className="font-medium">/debug/messages</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Naam
            </label>
            <input
              name="name"
              type="text"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
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
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
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
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
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
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="Optioneel: waar gaat je aanvraag over?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-md bg-slate-900 text-white text-sm font-medium py-2.5 disabled:opacity-60"
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

        <p className="mt-4 text-xs text-slate-400">
          Deze pagina is alleen voor interne tests. Later kun je per company een
          eigen hosted form URL genereren.
        </p>
      </div>
    </main>
  );
}
