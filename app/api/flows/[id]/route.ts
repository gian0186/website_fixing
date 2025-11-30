// app/api/flows/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCompanyIdFromSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const companyId = (session.user as any).companyId as string | undefined;
  if (!companyId) {
    throw new Error("Geen companyId gevonden in sessie.");
  }

  return companyId;
}

// 🔁 Flow bijwerken
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyIdFromSession();

    const existing = await prisma.flow.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Flow niet gevonden." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      triggerType,
      template,
      isActive,
      definition, // 👈 NIEUW
    } = body;

    const data: any = {};
    if (typeof name === "string") data.name = name;
    if (typeof description === "string") data.description = description;
    if (typeof triggerType === "string")
      data.triggerEventType = triggerType;
    if (typeof template === "string")
      data.messageTemplate = template;
    if (typeof isActive === "boolean") data.isActive = isActive;

    // 👇 NIEUW: JSON van de flow-builder opslaan
    if (definition !== undefined) {
      data.definition = definition;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Geen velden om bij te werken." },
        { status: 400 }
      );
    }

    const flow = await prisma.flow.update({
      where: { id: existing.id },
      data,
    });

    return NextResponse.json({ flow }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating flow:", error);
    const message =
      error?.message === "Unauthorized"
        ? "Unauthorized"
        : error?.message || "Er ging iets mis bij het bijwerken van de flow.";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

// 🗑 Flow verwijderen (ongewijzigd)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyIdFromSession();

    const existing = await prisma.flow.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Flow niet gevonden." },
        { status: 404 }
      );
    }

    await prisma.flow.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting flow:", error);
    const message =
      error?.message === "Unauthorized"
        ? "Unauthorized"
        : error?.message || "Er ging iets mis bij het verwijderen van de flow.";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
