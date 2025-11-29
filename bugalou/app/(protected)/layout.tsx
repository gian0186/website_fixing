//app/layout.tsx
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Icons
import {
  LayoutDashboard,
  Users,
  Activity,
  MessageCircle,
  GitBranch,
  Settings,
  Bug,
  PlayCircle,
  MessageCircleMore,
  ListTree,
} from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAuth();
  const userAny = session.user as any;

  // 🔐 Role ophalen
  const role = (userAny.role as string | undefined) ?? "AGENT";
  const canSeeDebug = role === "OWNER" || role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-6">
        <h1 className="text-lg font-semibold px-2">Bugalou</h1>

        <nav className="flex flex-col text-sm gap-1">
          <SidebarLink href="/app" icon={LayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/app/contacts" icon={Users}>
            Contacts
          </SidebarLink>
          <SidebarLink href="/app/events" icon={Activity}>
            Events
          </SidebarLink>
          <SidebarLink href="/app/messages" icon={MessageCircle}>
            Messages
          </SidebarLink>
          <SidebarLink href="/app/flows" icon={GitBranch}>
            Flows
          </SidebarLink>
          <SidebarLink href="/app/settings" icon={Settings}>
            Settings
          </SidebarLink>

          {/* 🔧 DEBUG — alleen zichtbaar als role OWNER of ADMIN */}
          {canSeeDebug && (
            <div className="mt-4 pt-4 border-t border-slate-800/70 flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wider text-slate-500 px-2 mb-1">
                Debug
              </p>

              <SidebarLink href="/app/debug/test-event" icon={Bug}>
                Test Event
              </SidebarLink>
              <SidebarLink href="/app/debug/run-flow" icon={PlayCircle}>
                Run Flow
              </SidebarLink>
              <SidebarLink
                href="/app/debug/send-whatsapp"
                icon={MessageCircleMore}
              >
                Fake WhatsApp
              </SidebarLink>
              <SidebarLink href="/app/debug/events" icon={ListTree}>
                Event Logs
              </SidebarLink>
            </div>
          )}
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

type SidebarLinkProps = {
  href: string;
  children: ReactNode;
  icon: LucideIcon;
};

function SidebarLink({ href, children, icon: Icon }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition"
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}
