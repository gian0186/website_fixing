// components/ContactEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContactEditFormProps = {
  contactId: string;
  initialName: string | null;
  initialPhone: string;
  initialEmail: string | null;
};

export function ContactEditForm({
  contactId,
  initialName,
  initialPhone,
  initialEmail,
}: ContactEditFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName ?? "");
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
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

      router.push(`/app/contacts/${contactId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Onbekende fout.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <div className="rounded-md bg-red-900/40 border border-red-700 px-3 py-2 text-xs text-red-200">
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
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
          placeholder="Bijv. Gian"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-300">
          Telefoonnummer *
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
          placeholder="Bijv. 0612345678"
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
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
          placeholder="Bijv. naam@domein.nl"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
      >
        {submitting ? "Opslaan..." : "Wijzigingen opslaan"}
      </button>
    </form>
  );
}
