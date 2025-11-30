// app/app/page.tsx
import { requireAuth } from "@/lib/auth";
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

export default async function AppDashboardPage() {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId as string;

  // Stats (company-specific) + laatste nieuws (platform-breed) parallel ophalen
  const [[contactsCount, eventsCount, flowsCount], latestNews] =
    await Promise.all([
      prisma.$transaction([
        prisma.contact.count({ where: { companyId } }),
        prisma.event.count({ where: { companyId } }),
        prisma.flow.count({ where: { companyId, isActive: true } }),
      ]),
      prisma.news.findMany({
        // 🔹 GEEN company-filter → globale updates
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { createdBy: true },
      }) as Promise<NewsWithAuthor[]>,
    ]);

  const stats = {
    contacts: contactsCount,
    events: eventsCount,
    flows: flowsCount,
  };

  return (
    <div className="space-y-8">
      {/* Stats-kaarten */}
      <section className="grid gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Leads / contacten"
          value={stats.contacts}
          description="Aantal unieke contacten in jouw omgeving."
          href="/app/contacts"
        />

        <DashboardCard
          title="Events"
          value={stats.events}
          description="Binnengekomen events (leads, orders, formulieren)."
          href="/app/events"
        />

        <DashboardCard
          title="Flows actief"
          value={stats.flows}
          description="Geactiveerde WhatsApp-flows gekoppeld aan events."
        />
      </section>

      {/* Navigatiekaarten */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardLink
          href="/app/settings"
          title="Instellingen"
          description="Bekijk je company details, API key en branding."
        />

        <DashboardLink
          href="/app/messages"
          title="Messages"
          description="Bekijk alle WhatsApp-berichten die via flows zijn aangemaakt."
        />

        <DashboardLink
          href="/app/flows"
          title="Flows"
          description="Beheer welke automatiseringen draaien op jouw events."
        />

        <DashboardLink
          href="/app/debug"
          title="Debug & data"
          description="Bekijk companies, contacts, events en messages."
        />
      </section>

      {/* Laatste nieuws & updates (platform-breed) */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-100">
            Laatste nieuws &amp; updates
          </h2>
          <Link
            href="/app/news"
            className="text-xs text-sky-400 hover:underline"
          >
            Alles bekijken
          </Link>
        </div>

        {latestNews.length === 0 ? (
          <p className="text-xs text-slate-500">
            Er zijn nog geen nieuwsberichten geplaatst.
          </p>
        ) : (
          <div className="space-y-3">
            {latestNews.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium text-slate-100">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {item.createdAt.toLocaleString("nl-NL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-300 whitespace-pre-line">
                  {item.body}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Geplaatst door{" "}
                  {item.createdBy?.name ??
                    item.createdBy?.email ??
                    "Bugalou team"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  href,
}: {
  title: string;
  value: number;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 hover:border-sky-500 transition-colors">
      <h2 className="text-sm font-medium mb-1">{title}</h2>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}

function DashboardLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm hover:border-sky-500 transition-colors"
    >
      <h2 className="font-medium mb-1">{title}</h2>
      <p className="text-slate-400">{description}</p>
    </Link>
  );
}
