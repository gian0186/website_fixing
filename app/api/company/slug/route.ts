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
  const { slug } = body as { slug?: string };

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is verplicht" },
      { status: 400 }
    );
  }

  const normalizedSlug = slug.trim().toLowerCase();

  // simpele validatie: alleen a-z, 0-9 en -
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slugRegex.test(normalizedSlug)) {
    return NextResponse.json(
      {
        error:
          "Slug mag alleen kleine letters, cijfers en koppeltekens bevatten (a-z, 0-9, -).",
      },
      { status: 400 }
    );
  }

  // check of slug al in gebruik is door een andere company
  const existing = await prisma.company.findFirst({
    where: {
      slug: normalizedSlug,
      NOT: { id: companyId },
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Deze slug is al in gebruik door een andere company." },
      { status: 400 }
    );
  }

  const updated = await prisma.company.update({
    where: { id: companyId },
    data: {
      slug: normalizedSlug,
    },
  });

  return NextResponse.json({
    success: true,
    slug: updated.slug,
  });
}
