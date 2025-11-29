// app/debug/run-flow/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { runFlowsForEvent } from "@/lib/flowEngine";

export async function GET() {
  const session = await requireAuth();
  const user = session.user as any;
  const companyId = user.companyId as string;

  // ✨ Belangrijk: dit moet matchen met je Trigger in de flow (lead_created)
  const eventType = "lead_created";

  const result = await runFlowsForEvent({
    companyId,
    eventType,
    contact: {
      // deze mag overeenkomen met een bestaande contact, maar hoeft niet per se
      id: undefined,
      name: "Gian Test",
      email: "gian@example.com",
      phone: "0643201748", // let op: normale NL-notatie, engine normaliseert naar +316...
    },
    payload: {
      source: "debug-run-flow",
    },
  });

  console.log("[DebugRunFlow] result:", result);

  return NextResponse.json(result);
}
