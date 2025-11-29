// app/api/contacts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (session.user as any).companyId as string | undefined;

    if (!companyId) {
      return NextResponse.json(
        { error: "Geen companyId gevonden in sessie." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, phone, email } = body as {
      name?: string;
      phone?: string;
      email?: string;
    };

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Telefoonnummer is verplicht." },
        { status: 400 }
      );
    }

    // Per company + telefoon uniek
    const contact = await prisma.contact.upsert({
      where: {
        companyId_phone: {
          companyId,
          phone,
        },
      },
      update: {
        name: name ?? null,
        email: email ?? null,
      },
      create: {
        companyId,
        name: name ?? null,
        phone,
        email: email ?? null,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error: any) {
    console.error("[API /contacts POST] error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Er ging iets mis bij het opslaan van het contact (server error).",
      },
      { status: 500 }
    );
  }
}
