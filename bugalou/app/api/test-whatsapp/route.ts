// app/api/test-whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  try {
    const to = "+31643201748"; // <-- jouw echte mobiel (E.164)

    const result = await sendWhatsAppTextMessage({
      to,
      body: "Bugalou testbericht via test-whatsapp endpoint 🚀",
    });

    console.log("[test-whatsapp] result:", result);

    return NextResponse.json(result);
  } catch (e) {
    console.error("[test-whatsapp] error:", e);
    return new NextResponse("Error", { status: 500 });
  }
}
