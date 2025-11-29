// app/api/news/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await requireAuth();
  const user = session.user as any;

  const form = await req.formData();
  const companyId = form.get("companyId")?.toString();
  const title = form.get("title")?.toString();
  const body = form.get("body")?.toString();

  if (!companyId || !title || !body) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  // Opslaan in database
  await prisma.news.create({
    data: {
      companyId,
      title,
      body,
      createdById: user.id,
    },
  });

  // Redirect terug naar overzicht
  return NextResponse.redirect("/app/news");
}
