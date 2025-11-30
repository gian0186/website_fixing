"use client";

import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

export function UserMenu({ session }: { session: Session }) {
  const name = session.user?.name || session.user?.email || "Gebruiker";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        Ingelogd als <span className="font-medium">{name}</span>
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
      >
        Uitloggen
      </button>
    </div>
  );
}
