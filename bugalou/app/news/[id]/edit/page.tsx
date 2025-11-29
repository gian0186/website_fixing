// app/news/[id]/edit/page.tsx
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};

export default async function NewsEditPage({ params }: PageProps) {
  const session = await requireAuth();
  const userAny = session.user as any;
  const companyId = userAny.companyId as string;
  const role = (userAny.role as string | undefined) ?? "AGENT";

  const canManage = role === "OWNER" || role === "ADMIN";
  if (!canManage) {
    redirect("/app/news");
  }

  const news = await prisma.news.findFirst({
    where: { id: params.id, companyId },
  });

  if (!news) {
    notFound();
  }

  // ✅ server action voor updaten
  async function updateNews(formData: FormData) {
    "use server";

    const title = (formData.get("title") ?? "").toString().trim();
    const body = (formData.get("body") ?? "").toString().trim();

    if (!title || !body) {
      redirect(`/app/news/${news.id}/edit`);
    }

    await prisma.news.update({
      where: { id: news.id },
      data: { title, body },
    });

    redirect("/app/news");
  }

  // ✅ server action voor verwijderen (geen form.submit() aanroepen in client!)
  async function deleteNews() {
    "use server";

    await prisma.news.delete({
      where: { id: news.id },
    });

    redirect("/app/news");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nieuwsbericht bewerken</h1>
          <p className="text-sm text-slate-400">
            Pas de inhoud van dit nieuwsbericht aan of verwijder het.
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

      {/* Formulier voor updaten */}
      <form
        action={updateNews}
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
            defaultValue={news.title}
            required
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
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
            defaultValue={news.body}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Delete-knop in aparte form hieronder */}
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

      {/* 🔴 Aparte form voor VERWIJDEREN, zonder JS submit */}
      <form action={deleteNews} className="mt-2">
        <button
          type="submit"
          className="text-xs text-red-400 hover:text-red-300"
        >
          Nieuwsbericht verwijderen
        </button>
      </form>
    </div>
  );
}
