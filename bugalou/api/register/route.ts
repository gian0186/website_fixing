//api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateApiKey() {
  return `bug_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  try {
    const { companyName, name, email, password } = await req.json();

    if (!companyName || !email || !password) {
      return NextResponse.json(
        { error: "companyName, email en password zijn verplicht" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Er bestaat al een account met dit e-mailadres" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const slug = slugify(companyName);
    const apiKey = generateApiKey();

    // 1) Company aanmaken
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug,
        apiKey,
        primaryColor: "#0f172a",
        accentColor: "#eab308",
      },
    });

    // 2) Eerste user = OWNER van deze company
    await prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash, // Correctie naar passwordHash
        role: "OWNER", // expliciet
        companyId: company.id,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        companySlug: company.slug,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error", err);
    return NextResponse.json(
      { error: "Er ging iets mis tijdens registreren" },
      { status: 500 }
    );
  }
}
