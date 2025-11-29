// app/app/contacts/new/page.tsx
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { ContactCreateForm } from "@/components/ContactCreateForm";

export default async function NewContactPage() {
  await requireAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Nieuw contact</h1>
          <p className="text-sm text-slate-400">
            Voeg handmatig een contact toe aan deze company. Dit contact kan
            later gekoppeld worden aan events en WhatsApp-berichten.
          </p>
        </div>

        <div className="text-right">
          <Link
            href="/app/contacts"
            className="text-sm text-sky-400 hover:underline"
          >
            ← Terug naar contacten
          </Link>
        </div>
      </div>

      <ContactCreateForm />
    </div>
  );
}
