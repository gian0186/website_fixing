// app/api/flows/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, triggerType, template, isActive } = body;

  if (!name || !triggerType) {
    return NextResponse.json(
      { error: "Naam en triggerType zijn verplicht." },
      { status: 400 }
    );
  }

  const companyId = (session.user as any).companyId as string | undefined;

  if (!companyId) {
    return NextResponse.json(
      { error: "Geen companyId gevonden in sessie." },
      { status: 400 }
    );
  }

  try {
    const flow = await prisma.flow.create({
      data: {
        companyId,
        name,
        description,                // ← ⭐ Opslaan van beschrijving toegevoegd
        triggerEventType: triggerType,
        messageTemplate: template,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ flow }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating flow:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Er ging iets mis bij het aanmaken van de flow (server error).",
      },
      { status: 500 }
    );
  }
}
