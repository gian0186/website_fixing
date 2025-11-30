import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(_req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userAny = session.user as any;
  const companyId = userAny.companyId as string | undefined;

  if (!companyId) {
    return new NextResponse("No company for user", { status: 400 });
  }

  // Nieuwe API key genereren
  const raw = crypto.randomBytes(24).toString("hex"); // 48 chars
  const apiKey = `bug_${raw}`;

  const updated = await prisma.company.update({
    where: { id: companyId },
    data: { apiKey },
  });

  return NextResponse.json({
    success: true,
    apiKey: updated.apiKey,
  });
}
