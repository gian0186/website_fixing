// lib/whatsapp.ts
import { getWhatsAppConfig } from "./whatsappConfig";

const WHATSAPP_BASE_URL = process.env.WHATSAPP_BASE_URL!;

if (!WHATSAPP_BASE_URL) {
  console.warn("[WhatsApp] Missing env var WHATSAPP_BASE_URL");
}

export type WhatsAppSendResult = {
  success: boolean;
  waMessageId?: string;
  error?: any;
};

// ------------ TEMPLATE MESSAGES (voor later / templates) ------------

type TemplateComponent = {
  type: "body" | "header" | "footer";
  parameters: { type: "text"; text: string }[];
};

type SendTemplateArgs = {
  companyId?: string;     // 👈 NIEUW: optioneel, voor multi-tenant
  to: string;             // E.164 nummer, bv. +31612345678
  templateName: string;   // naam zoals in Meta
  languageCode: string;   // bv. "nl" of "en"
  components?: TemplateComponent[];
};

export async function sendWhatsAppTemplateMessage(
  args: SendTemplateArgs
): Promise<WhatsAppSendResult> {
  const { companyId, to, templateName, languageCode, components = [] } = args;

  try {
    // 🔑 Haal config op (per company of fallback .env)
    const { phoneNumberId, accessToken } = companyId
      ? await getWhatsAppConfig(companyId)
      : await getWhatsAppConfigFallback();

    const res = await fetch(
      `${WHATSAPP_BASE_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp] template send error:", data);
      return { success: false, error: data };
    }

    const waMessageId = data?.messages?.[0]?.id as string | undefined;
    return { success: true, waMessageId };
  } catch (error) {
    console.error("[WhatsApp] template exception:", error);
    return { success: false, error };
  }
}

// ------------ PLAIN TEXT MESSAGES (sluit nu direct aan op jouw flowEngine) ------------

type SendTextArgs = {
  companyId?: string; // 👈 NIEUW: optioneel, voor multi-tenant
  to: string;         // E.164 nummer, bv. +31612345678
  body: string;       // de uiteindelijke tekst (na renderTemplate)
};

export async function sendWhatsAppTextMessage(
  args: SendTextArgs
): Promise<WhatsAppSendResult> {
  const { companyId, to, body } = args;

  try {
    // 🔑 Haal config op (per company of fallback .env)
    const { phoneNumberId, accessToken } = companyId
      ? await getWhatsAppConfig(companyId)
      : await getWhatsAppConfigFallback();

    const res = await fetch(
      `${WHATSAPP_BASE_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp] text send error:", data);
      return { success: false, error: data };
    }

    const waMessageId = data?.messages?.[0]?.id as string | undefined;
    return { success: true, waMessageId };
  } catch (error) {
    console.error("[WhatsApp] text exception:", error);
    return { success: false, error };
  }
}

// ---------- interne helper voor fallback op .env ----------

async function getWhatsAppConfigFallback() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error(
      "[WhatsApp] Missing env vars WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN"
    );
  }

  return { phoneNumberId, accessToken };
}
