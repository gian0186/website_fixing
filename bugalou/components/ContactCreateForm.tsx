// components/ContactCreateForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactCreateForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Telefoonnummer is verplicht.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || null,
          phone: phone.trim(),
          email: email.trim() || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Er ging iets mis bij het opslaan.");
      }

      router.push("/app/contacts");
      router.refresh();
    } catch (err: any) {
      console.error("[ContactCreateForm] error:", err);
      setError(err.message || "Er ging iets mis bij het opslaan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-5"
    >
      {error && (
        <div className="rounded-md border border-red-500 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Naam (optioneel)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bijv. Gian"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Telefoonnummer *
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Bijv. 0612345678"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
          required
        />
        <p className="text-[11px] text-slate-500">
          Per company + telefoonnummer is één contact uniek.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          E-mail (optioneel)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Bijv. naam@domein.nl"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
        >
          {loading ? "Bezig met opslaan..." : "Contact opslaan"}
        </button>
      </div>

      <p className="text-[11px] text-slate-500">
        Na opslaan verschijnt het contact in het overzicht.
      </p>
    </form>
  );
}
