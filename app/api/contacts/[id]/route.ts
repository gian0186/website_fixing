// app/api/contacts/[id]/route.ts
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

// 🔁 Contact bijwerken
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyIdFromSession();

    const existing = await prisma.contact.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Contact niet gevonden." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, phone, email } = body as {
      name?: string | null;
      phone?: string;
      email?: string | null;
    };

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Telefoonnummer is verplicht." },
        { status: 400 }
      );
    }

    try {
      const contact = await prisma.contact.update({
        where: { id: existing.id },
        data: {
          name: name ?? null,
          phone,
          email: email ?? null,
        },
      });

      return NextResponse.json({ contact }, { status: 200 });
    } catch (error: any) {
      // Unieke constraint op (companyId, phone)
      if (error?.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "Er bestaat al een contact met dit telefoonnummer voor deze company.",
          },
          { status: 409 }
        );
      }

      console.error("Error updating contact:", error);
      return NextResponse.json(
        { error: "Er ging iets mis bij het bijwerken van het contact." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("PATCH /api/contacts/[id] error:", error);
    const message =
      error?.message === "Unauthorized"
        ? "Unauthorized"
        : error?.message || "Interne serverfout.";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

// 🗑 Contact verwijderen
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyIdFromSession();

    const existing = await prisma.contact.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Contact niet gevonden." },
        { status: 404 }
      );
    }

    // Eerst relaties loskoppelen
    await prisma.message.updateMany({
      where: { contactId: existing.id },
      data: { contactId: null },
    });

    await prisma.event.updateMany({
      where: { contactId: existing.id },
      data: { contactId: null },
    });

    await prisma.contact.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/contacts/[id] error:", error);
    const message =
      error?.message === "Unauthorized"
        ? "Unauthorized"
        : error?.message || "Er ging iets mis bij het verwijderen van het contact.";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
