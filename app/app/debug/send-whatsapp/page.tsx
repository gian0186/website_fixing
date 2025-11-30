// app/debug/send-whatsapp/page.tsx
import { requireAuth } from "@/lib/auth";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp";

export default async function SendWhatsAppDebugPage() {
  const session = await requireAuth();
  const user = session.user as any;
  const companyId = user.companyId as string;

  // Server action: moet Promise<void> teruggeven
  async function sendTestMessage(formData: FormData): Promise<void> {
    "use server";

    const toRaw = formData.get("to");
    const bodyRaw = formData.get("body");

    const to = typeof toRaw === "string" ? toRaw.trim() : "";
    const body = typeof bodyRaw === "string" ? bodyRaw.trim() : "";

    if (!to || !body) {
      console.log("[debug/send-whatsapp] missing to/body", { to, body });
      return; // niks teruggeven ⇒ Promise<void>
    }

    const result = await sendWhatsAppTextMessage({
      companyId,
      to,
      body,
    });

    // Resultaat alleen loggen op de server
    console.log("[debug/send-whatsapp] send result:", result);

    // Heel belangrijk: NIETS returnen
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Fake WhatsApp debug</h1>
      <p className="text-sm text-slate-400">
        Stuur handmatig een WhatsApp-bericht via de gekoppelde Business API.
      </p>

      <form action={sendTestMessage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Telefoonnummer (E.164)
          </label>
          <input
            name="to"
            defaultValue="+316..."
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="+31612345678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Berichttekst
          </label>
          <textarea
            name="body"
            rows={4}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            defaultValue="Hi, dit is een testbericht vanuit Bugalou 👋"
          />
        </div>

        <button
          type="submit"
          className="rounded-full border border-sky-500 bg-sky-600/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500"
        >
          Test WhatsApp versturen
        </button>
      </form>
    </div>
  );
}
