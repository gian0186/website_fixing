import { prisma } from "@/lib/prisma";
import HostedFormClient from "./HostedFormClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyHostedFormPage({ params }: PageProps) {
  const { slug } = await params;

  console.log("[/form/[slug]] slug param:", slug);

  if (!slug) {
    console.error("[/form/[slug]] Missing slug param");
    notFound();
  }

  const company = await prisma.company.findUnique({
    where: { slug },
  });

  console.log("[/form/[slug]] loaded company:", company);

  if (!company || !company.apiKey) {
    console.error(
      "[/form/[slug]] Company not found or has no apiKey for slug:",
      slug
    );
    notFound();
  }

  const primaryColor = company.primaryColor ?? "#0f172a";
  const accentColor = company.accentColor ?? "#38bdf8";
  const introText =
    company.introText ??
    `Vul dit formulier in om rechtstreeks een aanvraag te doen bij ${company.name}.`;

  return (
    <HostedFormClient
      companyId={company.id}
      companyName={company.name ?? "Je bedrijf"}
      apiKey={company.apiKey}
      logoUrl={company.logoUrl ?? null}
      primaryColor={primaryColor}
      accentColor={accentColor}
      introText={introText}
    />
  );
}
