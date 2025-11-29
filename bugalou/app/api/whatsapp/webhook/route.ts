// app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Verify token die je in Meta invult bij je webhook.
 * Zorg dat deze in .env staat als WHATSAPP_VERIFY_TOKEN=...
 */
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "";

/**
 * GET – webhook verificatie (wordt 1x door Meta aangeroepen)
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (!VERIFY_TOKEN) {
    console.error("[WhatsApp] VERIFY_TOKEN ontbreekt in .env");
  }

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * POST – inkomende events van de WhatsApp Business API
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("[WhatsApp] webhook body:", JSON.stringify(body, null, 2));

  try {
    const entries = body.entry ?? [];

    for (const entry of entries) {
      const changes = entry.changes ?? [];

      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        const statuses = value.statuses ?? [];
        const messages = value.messages ?? [];

        // Meta stuurt hier o.a. metadata met phone_number_id mee
        const phoneNumberId = value.metadata?.phone_number_id as
          | string
          | undefined;

        if (!phoneNumberId) {
          console.warn(
            "[WhatsApp] Geen metadata.phone_number_id gevonden, sla deze change over."
          );
          continue;
        }

        // Zoek de juiste company via de WhatsApp settings
        const waSettings = await prisma.companyWhatsAppSettings.findFirst({
          where: { phoneNumberId },
        });

        if (!waSettings) {
          console.warn(
            "[WhatsApp] Geen companyWhatsAppSettings gevonden voor phoneNumberId:",
            phoneNumberId
          );
          continue;
        }

        const companyId = waSettings.companyId;

        /**
         * 1) Status updates (sent / delivered / read / failed)
         */
        for (const status of statuses) {
          const waMessageId = status.id as string | undefined;
          const statusString = status.status as string | undefined;

          if (!waMessageId || !statusString) continue;

          await prisma.message.updateMany({
            where: {
              companyId,
              whatsappMessageId: waMessageId,
            },
            data: {
              status: statusString.toUpperCase(), // optioneel normaliseren
            },
          });
        }

        /**
         * 2) Inkomende berichten (messages)
         */
        for (const msg of messages) {
          const from = msg.from as string | undefined; // E.164 nummer
          const waMessageId = msg.id as string | undefined;
          const text = msg.text?.body ?? "";
          const timestamp = msg.timestamp as string | undefined;

          if (!from || !waMessageId || !text) continue;

          // Contact zoeken of aanmaken
          let contact = await prisma.contact.findFirst({
            where: { companyId, phone: from },
          });

          if (!contact) {
            contact = await prisma.contact.create({
              data: {
                companyId,
                phone: from,
                name: "WhatsApp contact",
              },
            });
          }

          // Timestamp omzetten (WhatsApp → unix seconds)
          let createdAt = new Date();
          if (timestamp && !Number.isNaN(Number(timestamp))) {
            createdAt = new Date(Number(timestamp) * 1000);
          }

          // Inbound message opslaan
          await prisma.message.create({
            data: {
              companyId,
              contactId: contact.id,
              direction: "INBOUND",
              status: "RECEIVED",
              content: text,
              whatsappMessageId: waMessageId,
              rawPayload: msg,
              createdAt,
            },
          });

          // Later: flows triggeren op inbound
          // await runFlowsForEvent({
          //   companyId,
          //   eventType: "whatsapp_inbound",
          //   contact: {
          //     id: contact.id,
          //     name: contact.name,
          //     email: contact.email,
          //     phone: contact.phone,
          //   },
          //   payload: { text, waMessageId, from },
          // });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[WhatsApp] webhook error", e);
    return new NextResponse("Error", { status: 500 });
  }
}
