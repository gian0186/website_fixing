import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

// ------------------------------
//  Helpers
// ------------------------------

/**
 * Check of een user platform-brede admin is (sitebeheerder).
 * Wordt gebruikt voor nieuws-updates en globale instellingen.
 */
export function isPlatformAdmin(user: { email?: string | null }) {
  const raw = process.env.PLATFORM_ADMIN_EMAILS || "";
  const emails = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!user?.email) return false;
  return emails.includes(user.email.toLowerCase());
}

// ------------------------------
//  Auth Guards
// ------------------------------

/**
 * Vereist dat iemand is ingelogd.
 */
export async function requireAuth(): Promise<Session> {
  // ✅ Geen authOptions meer nodig hier
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Vereist dat user OWNER is binnen zijn eigen company.
 * (Wordt gebruikt voor bedrijfsspecifieke toegang.)
 */
export async function requireOwner(): Promise<Session> {
  const session = await requireAuth();
  const userAny = session.user as any;

  if (userAny?.role !== "OWNER") {
    redirect("/app");
  }

  return session;
}

/**
 * Vereist dat user PLATFORM ADMIN is (beheerders van Bugalou platform).
 * Bijvoorbeeld voor globale Nieuws & Updates.
 */
export async function requirePlatformAdmin(): Promise<Session> {
  const session = await requireAuth();
  const userAny = session.user as any;

  if (!isPlatformAdmin(userAny)) {
    redirect("/app");
  }

  return session;
}
