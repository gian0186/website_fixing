// components/ContactDeleteButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ContactDeleteButtonProps = {
  contactId: string;
};

export function ContactDeleteButton({ contactId }: ContactDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Weet je zeker dat je dit contact wilt verwijderen?")) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Er ging iets mis bij het verwijderen.");
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || "Er ging iets mis bij het verwijderen van het contact.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-60"
    >
      {loading ? "Verwijderen..." : "Verwijderen"}
    </button>
  );
}
