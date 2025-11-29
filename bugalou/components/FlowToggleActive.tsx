// components/FlowToggleActive.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type FlowToggleActiveProps = {
  flowId: string;
  initialActive: boolean;
};

export function FlowToggleActive({
  flowId,
  initialActive,
}: FlowToggleActiveProps) {
  const [checked, setChecked] = useState(initialActive);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleToggle() {
    const newValue = !checked;

    // Optimistic update
    setChecked(newValue);

    try {
      const res = await fetch(`/api/flows/${flowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newValue }),
      });

      if (!res.ok) {
        // rollback bij error
        setChecked(!newValue);
        const data = await res.json().catch(() => ({}));
        console.error("Toggle flow failed:", data);
        alert(
          data?.error ||
            "Er ging iets mis bij het aan/uit zetten van deze flow."
        );
        return;
      }

      // Server components opnieuw laten renderen
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("Error toggling flow:", err);
      setChecked(!newValue);
      alert("Er ging iets mis bij het aan/uit zetten van deze flow.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
        checked
          ? "bg-emerald-500/80 border-emerald-400"
          : "bg-slate-700 border-slate-500"
      } ${pending ? "opacity-60" : ""}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transform transition ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
