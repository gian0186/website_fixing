// app/settings/whatsapp/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function getCompanyIdFromSession() {
  // Haalt de ingelogde user op en gooit een error als er geen companyId is
  const session = await requireAuth();
  const user = session.user as any;

  if (!user?.companyId) {
    throw new Error("No companyId found on session.user");
  }

  return user.companyId as string;
}

async function getSettings(companyId: string) {
  const settings = await prisma.companyWhatsAppSettings.findUnique({
    where: { companyId },
  });

  return settings;
}

export default async function WhatsAppSettingsPage() {
  const companyId = await getCompanyIdFromSession();
  const settings = await getSettings(companyId);

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">WhatsApp instellingen</h1>
        <p className="text-sm text-slate-400">
          Koppel je eigen WhatsApp Business account zodat Bugalou berichten
          namens jouw bedrijf kan versturen.
        </p>
      </div>

      <form
        action={async (formData) => {
          "use server";

          const phoneNumberId = (formData.get("phoneNumberId") as string) ?? "";
          const businessId = (formData.get("businessId") as string) ?? "";
          const accessToken = (formData.get("accessToken") as string) ?? "";
          const verifyToken = (formData.get("verifyToken") as string) ?? "";

          // Als je in de database nog een verplicht phoneNumber veld hebt,
          // kun je hier een lege string meesturen. De waarde wordt verder
          // nergens gebruikt door de tool.
          const dummyPhoneNumber = settings?.phoneNumber ?? "";

          await prisma.companyWhatsAppSettings.upsert({
            where: { companyId },
            create: {
              companyId,
              phoneNumber: dummyPhoneNumber,
              phoneNumberId,
              businessId,
              accessToken,
              verifyToken,
              status: "ACTIVE",
            },
            update: {
              phoneNumber: dummyPhoneNumber,
              phoneNumberId,
              businessId,
              accessToken,
              verifyToken,
              status: "ACTIVE",
            },
          });
        }}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-4"
      >
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">
            Phone Number ID
          </label>
          <input
            name="phoneNumberId"
            defaultValue={settings?.phoneNumberId ?? ""}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            placeholder="PHONE_NUMBER_ID van Meta"
          />
          <p className="text-[11px] text-slate-500">
            Dit is de <span className="font-mono">phone_number_id</span> uit de
            Meta / WhatsApp Business Console.
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">
            Business (WABA) ID
          </label>
          <input
            name="businessId"
            defaultValue={settings?.businessId ?? ""}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            placeholder="WhatsApp Business Account ID"
          />
          <p className="text-[11px] text-slate-500">
            De ID van je WhatsApp Business Account (WABA).
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">
            Access Token
          </label>
          <input
            name="accessToken"
            defaultValue={settings?.accessToken ?? ""}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            type="password"
            placeholder="Meta access token"
          />
          <p className="text-[11px] text-slate-500">
            Langdurig geldig access token uit de Meta Developer Console.
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">
            Verify Token
          </label>
          <input
            name="verifyToken"
            defaultValue={settings?.verifyToken ?? ""}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none"
            placeholder="Zelfgekozen verify token"
          />
          <p className="text-[11px] text-slate-500">
            Kies zelf een geheime token en vul deze ook in bij de Meta
            webhook-instellingen.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500"
          >
            Opslaan
          </button>
        </div>
      </form>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-slate-300 space-y-1">
        <p className="font-semibold text-slate-100">Webhook URL</p>
        <p>Gebruik deze URL in de Meta webhook-instellingen:</p>
        <pre className="mt-1 rounded-md border border-slate-800 bg-slate-950 p-2 break-all font-mono">
          {APP_URL}/api/whatsapp/webhook
        </pre>
        <p className="mt-2 text-[11px] text-slate-400">
          Gebruik als{" "}
          <span className="font-mono font-semibold">Verify Token</span> dezelfde
          waarde als hierboven ingevuld. Meta gebruikt dit om je webhook te
          verifiëren.
        </p>
      </div>
    </div>
  );
}
