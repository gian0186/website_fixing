// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runFlowsForEvent } from "@/lib/flowEngine";

type IncomingEventBody = {
  // oude stijl
  event_type?: string;

  // nieuwe stijl
  type?: string;

  // oude stijl: alles onder "data"
  data?: {
    name?: string;
    phone?: string;
    email?: string;
    [key: string]: any;
  };

  // nieuwe stijl
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
    [key: string]: any;
  };
  payload?: Record<string, any>;
};

export async function POST(req: NextRequest) {
  try {
    // 1. API key uit header
    const apiKey = req.headers.get("x-api-key") ?? undefined;

    if (!apiKey) {
      console.error("[API /events] Missing x-api-key header");
      return NextResponse.json(
        { error: "Missing x-api-key header" },
        { status: 401 }
      );
    }

    console.log("[API /events] received x-api-key:", apiKey);

    const company = await prisma.company.findUnique({
      where: { apiKey },
    });

    if (!company) {
      // extra debug: laat in de terminal zien welke keys in de DB staan
      const companies = await prisma.company.findMany({
        select: { id: true, name: true, apiKey: true },
      });
      console.error("[API /events] Invalid API key. Received:", apiKey);
      console.error("[API /events] Available companies + apiKeys:", companies);

      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // 2. Body parsen
    const body = (await req.json()) as IncomingEventBody;
    console.log("[API /events] body:", body);

    // --- Event type normaliseren ---
    const finalEventType = body.event_type ?? body.type;
    if (!finalEventType) {
      return NextResponse.json(
        { error: "event_type (of type) is required" },
        { status: 400 }
      );
    }

    // --- Contact normaliseren ---
    const contactInput = body.contact ?? body.data;

    if (!contactInput || !contactInput.phone) {
      return NextResponse.json(
        { error: "contact.phone (of data.phone) is required" },
        { status: 400 }
      );
    }

    const { phone, name, email, ...restContactFields } = contactInput;
    void restContactFields; // nog niet gebruikt, voorkomt TS warning

    // --- Payload normaliseren ---
    const payload = body.payload ?? body.data ?? {};

    // 3. Contact upserten (per bedrijf + telefoon uniek)
    const contact = await prisma.contact.upsert({
      where: {
        companyId_phone: {
          companyId: company.id,
          phone,
        },
      },
      update: {
        name: name ?? undefined,
        email: email ?? undefined,
        // hier kun je later extra velden uit restContactFields mappen
      },
      create: {
        companyId: company.id,
        phone,
        name: name ?? null,
        email: email ?? null,
      },
    });

    // 4. Event opslaan
    const event = await prisma.event.create({
      data: {
        companyId: company.id,
        contactId: contact.id,
        type: finalEventType,
        data: payload,
      },
    });

    // 5. Flow engine draaien
    const flowResult = await runFlowsForEvent({
      companyId: company.id,
      eventType: finalEventType,
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      },
      payload,
    });

    // 6. Response teruggeven
    return NextResponse.json(
      {
        ok: true,
        eventId: event.id,
        contactId: contact.id,
        triggeredFlows: flowResult.triggeredFlows,
        messagesSent: flowResult.messagesSent,
        messages: flowResult.messages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API_EVENTS_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
