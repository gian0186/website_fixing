// components/FlowBuilderForm.tsx
"use client";

import { useMemo, useState } from "react";
import { EVENT_TYPES } from "@/lib/eventTypes";

type FlowBlockType = "trigger" | "whatsapp" | "wait" | "condition";

type BaseBlock = {
  id: string;
  type: FlowBlockType;
  label: string;
};

type TriggerBlock = BaseBlock & {
  type: "trigger";
  eventType: string;
};

type WhatsAppBlock = BaseBlock & {
  type: "whatsapp";
  template: string;
};

type WaitBlock = BaseBlock & {
  type: "wait";
  minutes: number;
};

type ConditionBlock = BaseBlock & {
  type: "condition";
  expression: string;
};

export type FlowBlock =
  | TriggerBlock
  | WhatsAppBlock
  | WaitBlock
  | ConditionBlock;

type FlowBuilderFormProps = {
  flowId: string;
  initialDefinition: any | null; // JSON uit de DB (mag null zijn)
};

function createDefaultBlocks(): FlowBlock[] {
  return [
    {
      id: "trigger-1",
      type: "trigger",
      label: "Trigger",
      eventType: "lead_created",
    },
    {
      id: "whatsapp-1",
      type: "whatsapp",
      label: "WhatsApp bericht",
      template:
        "Hi {{contact.name}}, bedankt voor je aanvraag! We nemen snel contact met je op.",
    },
    {
      id: "wait-1",
      type: "wait",
      label: "Wacht stap",
      minutes: 15,
    },
  ];
}

function parseInitialBlocks(initialDefinition: any | null): FlowBlock[] {
  if (
    initialDefinition &&
    typeof initialDefinition === "object" &&
    Array.isArray(initialDefinition.blocks)
  ) {
    return initialDefinition.blocks as FlowBlock[];
  }

  return createDefaultBlocks();
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function FlowBuilderForm({
  flowId,
  initialDefinition,
}: FlowBuilderFormProps) {
  const [blocks, setBlocks] = useState<FlowBlock[]>(() =>
    parseInitialBlocks(initialDefinition)
  );

  const [selectedId, setSelectedId] = useState<string | null>(() =>
    parseInitialBlocks(initialDefinition)[0]?.id ?? null
  );

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedId) ?? blocks[0] ?? null,
    [blocks, selectedId]
  );

  const selectedIndex = useMemo(
    () =>
      selectedBlock ? blocks.findIndex((b) => b.id === selectedBlock.id) : -1,
    [blocks, selectedBlock]
  );

  const canDelete = selectedIndex > 0;

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 🔹 Canvas-helpers
  function handleSelectBlock(id: string) {
    setSelectedId(id);
  }

  function addWhatsAppBlock() {
    const block: WhatsAppBlock = {
      id: generateId("whatsapp"),
      type: "whatsapp",
      label: "WhatsApp bericht",
      template:
        "Hi {{name}}, bedankt voor je aanvraag! We nemen snel contact met je op.",
    };
    setBlocks((prev) => [...prev, block]);
    setSelectedId(block.id);
  }

  function addWaitBlock() {
    const block: WaitBlock = {
      id: generateId("wait"),
      type: "wait",
      label: "Wacht stap",
      minutes: 15,
    };
    setBlocks((prev) => [...prev, block]);
    setSelectedId(block.id);
  }

  function addConditionBlock() {
    const block: ConditionBlock = {
      id: generateId("if"),
      type: "condition",
      label: "Voorwaarde",
      expression: "contact.tags bevat 'VIP'",
    };
    setBlocks((prev) => [...prev, block]);
    setSelectedId(block.id);
  }

  function updateBlock<K extends keyof FlowBlock>(
    id: string,
    key: K,
    value: FlowBlock[K]
  ) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  }

  // 🔹 Blok verwijderen
  function handleDeleteBlock() {
    if (!selectedBlock) return;

    // Trigger (eerste blok) mag niet weg
    if (selectedIndex === 0) {
      alert("Je kunt de trigger niet verwijderen.");
      return;
    }

    if (selectedIndex === -1) return;

    const newBlocks = blocks.filter((b) => b.id !== selectedBlock.id);

    setBlocks(newBlocks);

    // Selectie naar vorige blok (of eerste als er geen vorige is)
    const newIndex = Math.min(selectedIndex - 1, newBlocks.length - 1);
    setSelectedId(newBlocks[newIndex]?.id ?? null);
  }

  // 🔹 Opslaan naar backend (/api/flows/[id])
  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const res = await fetch(`/api/flows/${flowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          definition: {
            blocks,
          },
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Onbekende fout bij opslaan.");
      }

      setSaveMessage("Flow opgeslagen.");
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Er ging iets mis bij het opslaan.");
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSaveMessage(null);
        setSaveError(null);
      }, 4000);
    }
  }

  const blockCount = blocks.length;

  return (
    <div className="space-y-6">
      {/* Toptekst */}
      <p className="text-sm text-slate-400">
        Dit is een eerste versie van de visuele flow-builder. Je ziet de blokken
        van de flow in het canvas. Selecteer een blok om de details in de
        onderkant aan te passen. Klik op &quot;Flow opslaan&quot; om de
        blokkenstructuur als JSON op te slaan.
      </p>

      {/* Canvas */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-100">
            Flow-canvas (in opbouw)
          </h2>
          <span className="text-xs text-slate-500">
            {blockCount} blok{blockCount === 1 ? "" : "ken"}
          </span>
        </div>

        <div className="space-y-3">
          {blocks.map((block, index) => {
            const isSelected = selectedBlock?.id === block.id;

            let badgeLabel = "";
            let subText = "";

            if (block.type === "trigger") {
              badgeLabel = "Trigger";
              subText = `Event: ${(block as TriggerBlock).eventType}`;
            } else if (block.type === "whatsapp") {
              badgeLabel = "WhatsApp";
              subText = (block as WhatsAppBlock).template;
            } else if (block.type === "wait") {
              badgeLabel = "Wacht";
              subText = `Wachten ${(block as WaitBlock).minutes} minuten`;
            } else if (block.type === "condition") {
              badgeLabel = "Voorwaarde";
              subText = (block as ConditionBlock).expression;
            }

            return (
              <div key={block.id}>
                <div
                  onClick={() => handleSelectBlock(block.id)}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-sky-500 bg-sky-900/30"
                      : "border-slate-700 bg-slate-800/60 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                        {badgeLabel}
                      </span>
                      <span className="text-xs text-slate-300">
                        {block.label}
                      </span>
                    </div>

                    {index < blocks.length - 1 && (
                      <span className="text-xs text-slate-500">↓</span>
                    )}
                  </div>

                  {subText && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {subText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons onder canvas */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={addWhatsAppBlock}
            className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 hover:border-sky-500"
          >
            + WhatsApp bericht
          </button>
          <button
            type="button"
            onClick={addWaitBlock}
            className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 hover:border-sky-500"
          >
            + Wacht
          </button>
          <button
            type="button"
            onClick={addConditionBlock}
            className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 hover:border-sky-500"
          >
            + Voorwaarde (if/else)
          </button>
        </div>
      </section>

      {/* Eigenschappen + Opslaan */}
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-100">
            Blok-eigenschappen
          </h2>

          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-xs text-emerald-400">{saveMessage}</span>
            )}
            {saveError && (
              <span className="text-xs text-red-400">{saveError}</span>
            )}

            {/* Blok verwijderen */}
            <button
              type="button"
              onClick={handleDeleteBlock}
              disabled={!canDelete || !selectedBlock}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                !canDelete || !selectedBlock
                  ? "cursor-not-allowed border-slate-700 text-slate-500"
                  : "border-red-500 text-red-400 hover:bg-red-500/10"
              }`}
            >
              Blok verwijderen
            </button>

            {/* Flow opslaan */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-60"
            >
              {saving ? "Opslaan..." : "Flow opslaan"}
            </button>
          </div>
        </div>

        {!selectedBlock ? (
          <p className="text-xs text-slate-500">
            Geen blok geselecteerd. Klik op een blok in het canvas om de
            details te bewerken.
          </p>
        ) : (
          <>
            {/* Label */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Label
              </label>
              <input
                type="text"
                value={selectedBlock.label}
                onChange={(e) =>
                  updateBlock(selectedBlock.id, "label", e.target.value)
                }
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Type-specifieke velden */}
            {selectedBlock.type === "trigger" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Event type
                </label>
                <select
                  value={(selectedBlock as TriggerBlock).eventType || ""}
                  onChange={(e) =>
                    updateBlock(
                      selectedBlock.id,
                      "eventType" as any,
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                >
                  <option value="">Kies een event type…</option>
                  {EVENT_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Dit event moet overeenkomen met het{" "}
                  <code>type</code>-veld in je <code>/api/events</code>{" "}
                  payload.
                </p>
              </div>
            )}

            {selectedBlock.type === "whatsapp" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  WhatsApp template / bericht
                </label>
                <textarea
                  rows={4}
                  value={(selectedBlock as WhatsAppBlock).template}
                  onChange={(e) =>
                    updateBlock(
                      selectedBlock.id,
                      "template" as any,
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Je kunt placeholders gebruiken zoals <code>{"{{name}}"}</code>{" "}
                  of <code>{"{{email}}"}</code>. De flow-engine kan deze later
                  vervangen.
                </p>
              </div>
            )}

            {selectedBlock.type === "wait" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Wachtdduur (minuten)
                </label>
                <input
                  type="number"
                  min={0}
                  value={(selectedBlock as WaitBlock).minutes}
                  onChange={(e) =>
                    updateBlock(
                      selectedBlock.id,
                      "minutes" as any,
                      Number(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </div>
            )}

            {selectedBlock.type === "condition" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Voorwaarde (expressie)
                </label>
                <textarea
                  rows={3}
                  value={(selectedBlock as ConditionBlock).expression}
                  onChange={(e) =>
                    updateBlock(
                      selectedBlock.id,
                      "expression" as any,
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Voorbeeld: <code>contact.tags bevat &quot;VIP&quot;</code> of{" "}
                  <code>contact.score &gt; 50</code>.
                </p>
              </div>
            )}

            <p className="mt-3 text-[11px] text-slate-500">
              In een volgende stap kunnen we deze visuele flow uitvoeren in de
              backend. Voor nu slaan we alleen de JSON onder{" "}
              <code>Flow.definition</code> op.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
