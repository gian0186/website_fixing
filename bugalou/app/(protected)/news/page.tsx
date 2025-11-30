// app/app/news/page.tsx
import { requireAuth, isPlatformAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type News = {
  id: string;
  companyId: string;
  title: string;
  body: string;
  createdAt: Date;
  createdById: string | null;
};

type User = {
  id: string;
  email: string;
  name: string | null;
};

type NewsWithAuthor = News & { createdBy: User | null };

export default async function NewsIndexPage() {
  const session = await requireAuth();
  const userAny = session.user as any;
  const isAdmin = isPlatformAdmin(userAny); // 👈 alleen platform admins

  // Let op: nieuws is platform-breed → GEEN company filter!
  const newsItems: NewsWithAuthor[] = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      createdBy: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nieuws & updates</h1>
          <p className="text-sm text-slate-400">
            Platform-brede updates voor alle gebruikers van Bugalou.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm">
          {isAdmin && (
            <Link
              href="/app/news/new"
              className="rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-500"
            >
              + Nieuw bericht
            </Link>
          )}
          <Link href="/app" className="text-xs text-sky-400 hover:underline">
            ← Terug naar dashboard
          </Link>
        </div>
      </div>

      {/* Lijst met nieuwsberichten */}
      {newsItems.length === 0 ? (
        <p className="text-sm text-slate-500">
          Er zijn nog geen nieuwsberichten geplaatst.
        </p>
      ) : (
        <div className="space-y-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-sm font-medium text-slate-100">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span>
                      {item.createdAt.toLocaleString("nl-NL", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                    {item.createdBy && (
                      <>
                        <span>•</span>
                        <span>
                          Door {item.createdBy.name ?? item.createdBy.email}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Alleen platform admins mogen bewerken */}
                {isAdmin && (
                  <Link
                    href={`/app/news/${item.id}/edit`}
                    className="text-[11px] text-sky-400 hover:underline"
                  >
                    Bewerken
                  </Link>
                )}
              </header>

              <p className="mt-2 text-xs text-slate-200 whitespace-pre-wrap">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      )}

      {!isAdmin && (
        <p className="text-[11px] text-slate-500">
          Alleen{" "}
          <span className="font-medium text-slate-300">platform beheerders</span>{" "}
          kunnen nieuwsberichten toevoegen of bewerken.
        </p>
      )}
    </div>
  );
}
