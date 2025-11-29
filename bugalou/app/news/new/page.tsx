// app/news/new/page.tsx
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewsCreatePage() {
  const session = await requireAuth();
  const userAny = session.user as any;
  const companyId = userAny.companyId as string;
  const userId = userAny.id as string | undefined;
  const role = (userAny.role as string | undefined) ?? "AGENT";

  const canManage = role === "OWNER" || role === "ADMIN";

  if (!canManage) {
    // Geen toegang → terug naar overzicht
    redirect("/app/news");
  }

  async function createNews(formData: FormData) {
    "use server";

    const title = (formData.get("title") ?? "").toString().trim();
    const body = (formData.get("body") ?? "").toString().trim();

    if (!title || !body) {
      // Simpel: als er niks is, gewoon terug naar formulier.
      // (voor nu geen fancy error messaging)
      redirect("/app/news/new");
    }

    await prisma.news.create({
      data: {
        title,
        body,
        companyId,
        createdById: userId ?? null,
      },
    });

    redirect("/app/news");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nieuw nieuwsbericht</h1>
          <p className="text-sm text-slate-400">
            Dit bericht wordt getoond op het dashboard onder &quot;Laatste
            nieuws & updates&quot;.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm">
          <Link
            href="/app/news"
            className="text-xs text-sky-400 hover:underline"
          >
            ← Terug naar nieuws
          </Link>
        </div>
      </div>

      {/* Formulier */}
      <form
        action={createNews}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-4"
      >
        <div className="space-y-1">
          <label
            htmlFor="title"
            className="text-xs font-medium text-slate-300"
          >
            Titel
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            placeholder="Bijv. Nieuwe functie: WhatsApp flows"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="body"
            className="text-xs font-medium text-slate-300"
          >
            Bericht
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={6}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            placeholder="Beschrijf hier kort de update of het nieuws..."
          />
          <p className="text-[11px] text-slate-500">
            Dit bericht is zichtbaar voor alle gebruikers binnen deze omgeving.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/app/news"
            className="text-xs text-slate-400 hover:underline"
          >
            Annuleren
          </Link>

          <button
            type="submit"
            className="rounded-full border border-emerald-500 bg-emerald-600/90 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}
