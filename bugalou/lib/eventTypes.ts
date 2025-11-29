// lib/eventTypes.ts
export const EVENT_TYPES = [
  { value: "lead_created", label: "Lead aangemaakt" },
  { value: "order_created", label: "Bestelling aangemaakt" },
  { value: "order_paid", label: "Bestelling betaald" },
  { value: "order_shipped", label: "Bestelling verzonden" },
  { value: "review_order", label: "Review ontvangen" },
  { value: "custom_event", label: "Custom event" },
] as const;

export type EventType = typeof EVENT_TYPES[number]["value"];
