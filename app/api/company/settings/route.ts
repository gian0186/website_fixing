import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userAny = session.user as any;
  const companyId = userAny.companyId as string | undefined;

  if (!companyId) {
    return new NextResponse("No company for user", { status: 400 });
  }

  const body = await req.json();
  const { primaryColor, accentColor, introText } = body as {
    primaryColor?: string;
    accentColor?: string;
    introText?: string;
  };

  const hexRegex = /^#?[0-9a-fA-F]{6}$/;

  if (primaryColor && !hexRegex.test(primaryColor.replace("#", ""))) {
    return NextResponse.json(
      { error: "Ongeldige primaire kleur" },
      { status: 400 }
    );
  }

  if (accentColor && !hexRegex.test(accentColor.replace("#", ""))) {
    return NextResponse.json(
      { error: "Ongeldige accentkleur" },
      { status: 400 }
    );
  }

  const updated = await prisma.company.update({
    where: { id: companyId },
    data: {
      primaryColor: primaryColor ?? undefined,
      accentColor: accentColor ?? undefined,
      introText: introText ?? undefined,
    },
  });

  return NextResponse.json({
    success: true,
    company: {
      id: updated.id,
      primaryColor: updated.primaryColor,
      accentColor: updated.accentColor,
      introText: updated.introText,
    },
  });
}
