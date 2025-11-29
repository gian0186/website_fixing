// components/FlowDeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FlowDeleteButtonProps = {
  flowId: string;
  flowName?: string;
};

export function FlowDeleteButton({ flowId, flowName }: FlowDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (loading) return;

    const ok = window.confirm(
      `Weet je zeker dat je de flow "${
        flowName ?? ""
      }" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`
    );

    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/flows/${flowId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to delete flow:", data);
        alert(
          data?.error ||
            "Er ging iets mis bij het verwijderen van deze flow."
        );
        return;
      }

      router.refresh();
    } catch (err) {
      console.error("Error deleting flow:", err);
      alert("Er ging iets mis bij het verwijderen van deze flow.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      Verwijderen
    </button>
  );
}
