// app/debug/send-whatsapp/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp";

export async function GET() {
  const session = await requireAuth();
  const user = session.user as any;
  const companyId = user.companyId as string;

  // Vul hier tijdelijk je eigen 06 in als test
  const to = "+31643201748"; // <-- jouw eigen nummer in E.164

  const result = await sendWhatsAppTextMessage({
    companyId,
    to,
    body: "Testbericht vanuit Bugalou debug endpoint 🚀",
  });

  console.log("[DebugWhatsApp] result:", result);

  return NextResponse.json(result);
}
