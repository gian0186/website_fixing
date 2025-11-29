// app/api/flows/[id]/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { runFlowsForEvent } from "@/lib/flowEngine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const user = session.user as any;
    const companyId = user.companyId as string;

    const flowId = params.id;

    // 1) Flow ophalen en checken of hij bij deze company hoort
    const flow = await prisma.flow.findFirst({
      where: {
        id: flowId,
        companyId,
        isActive: true,
      },
    });

    if (!flow) {
      return NextResponse.json(
        { error: "Flow niet gevonden of niet actief" },
        { status: 404 }
      );
    }

    // 2) Body uitlezen: test-contact
    const body = await req.json().catch(() => ({}));
    const {
      phone,
      name = "Test contact",
      email = "test@example.com",
    } = body as {
      phone?: string;
      name?: string;
      email?: string;
    };

    if (!phone) {
      return NextResponse.json(
        { error: "phone is verplicht voor test-run" },
        { status: 400 }
      );
    }

    // 3) FlowEngine draaien met deze test-contact
    const result = await runFlowsForEvent({
      companyId,
      eventType: flow.triggerEventType,
      contact: {
        name,
        email,
        phone,
      },
      payload: {
        source: "flow-test-button",
        flowId: flow.id,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        flowId: flow.id,
        triggerEventType: flow.triggerEventType,
        ...result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API /flows/:id/test] error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err?.message },
      { status: 500 }
    );
  }
}
