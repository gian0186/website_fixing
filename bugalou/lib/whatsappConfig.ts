// lib/whatsappConfig.ts
import { prisma } from "@/lib/prisma";

export type WhatsAppConfig = {
  phoneNumberId: string;
  accessToken: string;
};

export async function getWhatsAppConfig(
  companyId: string
): Promise<WhatsAppConfig> {
  // 1) Probeer database settings (multi-tenant)
  const settings = await prisma.companyWhatsAppSettings.findUnique({
    where: { companyId },
  });

  if (settings?.phoneNumberId && settings?.accessToken) {
    return {
      phoneNumberId: settings.phoneNumberId,
      accessToken: settings.accessToken,
    };
  }

  // 2) Fallback: .env configuratie (eigen test account)
  const fallbackPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const fallbackAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!fallbackPhoneNumberId || !fallbackAccessToken) {
    throw new Error(
      "[WhatsApp] Geen geldige WhatsApp instellingen gevonden voor deze company én geen fallback .env aanwezig"
    );
  }

  return {
    phoneNumberId: fallbackPhoneNumberId,
    accessToken: fallbackAccessToken,
  };
}
