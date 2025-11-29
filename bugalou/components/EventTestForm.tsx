// components/EventTestForm.tsx
"use client";

import { useState } from "react";

const EVENT_OPTIONS = [
  {
    value: "lead_created",
    label: "Lead aangemaakt (lead_created)",
    examplePayload: JSON.stringify(
      {
        source: "form",
        page: "/offerte",
        tags: ["website-formulier"],
      },
      null,
      2
    ),
  },
  {
    value: "order_created",
    label: "Bestelling aangemaakt (order_created)",
    examplePayload: JSON.stringify(
      {
        orderId: "TEST-1001",
        total: 199.95,
        currency: "EUR",
        items: [
          { sku: "STOEL-01", name: "Tuinstoel", qty: 2, price: 79.95 },
          { sku: "KUSSEN-01", name: "Stoelkussen", qty: 2, price: 20.05 },
        ],
        source: "webshop",
      },
      null,
      2
    ),
  },
  {
    value: "order_paid",
    label: "Bestelling betaald (order_paid)",
    examplePayload: JSON.stringify(
      {
        orderId: "TEST-1001",
        paymentMethod: "iDEAL",
        paidAt: new Date().toISOString(),
      },
      null,
      2
    ),
  },
  {
    value: "order_shipped",
    label: "Bestelling verzonden (order_shipped)",
    examplePayload: JSON.stringify(
      {
        orderId: "TEST-1001",
        carrier: "PostNL",
        trackAndTrace: "3S1234567890",
      },
      null,
      2
    ),
  },
  {
    value: "review_order",
    label: "Review ontvangen (review_order)",
    examplePayload: JSON.stringify(
      {
        orderId: "TEST-1001",
        rating: 5,
        comment: "Super service en snelle levering!",
      },
      null,
      2
    ),
  },
  {
    value: "custom_event",
    label: "Custom event (eigen naam)",
    examplePayload: JSON.stringify(
      {
        customType: "mijn_eigen_event",
        data: {
          foo: "bar",
        },
      },
      null,
      2
    ),
  },
];

type EventTestFormProps = {
  apiKey: string;
};

export function EventTestForm({ apiKey }: EventTestFormProps) {
  const [eventType, setEventType] = useState<string>("lead_created");
  const [customEventType, setCustomEventType] = useState<string>("");
  const [name, setName] = useState<string>("Test contact");
  const [email, setEmail] = useState<string>("test@example.com");
  const [phone, setPhone] = useState<string>("0643201748");
  const [payloadText, setPayloadText] = useState<string>(
    EVENT_OPTIONS[0].examplePayload
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  function handleChangeEventType(value: string) {
    setEventType(value);
    setResult(null);
    setError(null);

    const option = EVENT_OPTIONS.find((o) => o.value === value);
    if (option) {
      setPayloadText(option.examplePayload);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const finalEventType =
      eventType === "custom_event" && customEventType.trim().length > 0
        ? customEventType.trim()
        : eventType;

    let payload: any = {};
    if (payloadText.trim().length > 0) {
      try {
        payload = JSON.parse(payloadText);
      } catch {
        setIsSubmitting(false);
        setError("Payload is geen geldige JSON. Controleer de syntax.");
        return;
      }
    }

    const body = {
      event_type: finalEventType,
      contact: {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
      },
      payload,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.error ||
            `Event mislukt met status ${res.status} (${res.statusText})`
        );
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err?.message || "Onbekende fout bij het versturen van het event");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // 👇 max-w-3xl & mx-auto eruit, w-full erin
    <section className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-4 space-y-4">
      <h2 className="text-sm font-medium text-slate-100">Event testen</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Event type + custom naam */}
        <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Event type
            </label>
            <select
              value={eventType}
              onChange={(e) => handleChangeEventType(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              {EVENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {eventType === "custom_event" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Eigen event naam
              </label>
              <input
                value={customEventType}
                onChange={(e) => setCustomEventType(e.target.value)}
                placeholder="bijv. contact_tagged"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                Dit wordt doorgestuurd als{" "}
                <code className="bg-slate-800 px-1 rounded">event_type</code>{" "}
                naar <code>/api/events</code>.
              </p>
            </div>
          )}
        </div>

        {/* Contactgegevens */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Naam</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Telefoonnummer
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Bijv. 0643..."
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Dit nummer wordt gekoppeld aan het contact en gebruikt in de flow
              (WhatsApp).
            </p>
          </div>
        </div>

        {/* Payload JSON */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Payload (JSON)
          </label>
          <textarea
            rows={10}
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100 focus:border-sky-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-500">
            Optioneel. Dit wordt onder{" "}
            <code className="bg-slate-800 px-1 rounded">payload</code>{" "}
            doorgestuurd naar <code>/api/events</code> en is beschikbaar in de
            flow als <code>{"{{payload.*}}"}</code>.
          </p>
        </div>

        {/* Knoppen + status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>
              Event wordt verstuurd naar{" "}
              <code className="bg-slate-800 px-1 rounded">/api/events</code> met
              header{" "}
              <code className="bg-slate-800 px-1 rounded">x-api-key</code>.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {isSubmitting ? "Event versturen..." : "Test event versturen"}
          </button>
        </div>
      </form>

      {/* Result / error */}
      {error && (
        <div className="rounded-md border border-red-500/60 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          <strong>Fout:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-slate-200">
            Response van /api/events
          </h3>
          <pre className="max-h-80 overflow-auto rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
