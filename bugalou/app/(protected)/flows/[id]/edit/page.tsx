// app/app/flows/[id]/edit/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { FlowBuilderForm } from "@/components/FlowBuilderForm";

const prisma = new PrismaClient();

type FlowEditPageProps = {
  params: { id: string };
};

export default async function FlowEditPage({ params }: FlowEditPageProps) {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId as string;

  const flow = await prisma.flow.findFirst({
    where: { id: params.id, companyId },
  });

  if (!flow) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Flow niet gevonden</h1>
        <p className="text-sm text-slate-400">
          Deze flow bestaat niet (meer) of je hebt er geen toegang toe.
        </p>
        <Link
          href="/app/flows"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Terug naar flows
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Flow bewerken</h1>
          <p className="text-sm text-slate-400">
            Pas de instellingen van deze flow aan.
          </p>
        </div>

        <div className="text-right space-y-1">
          <Link
            href={`/app/flows/${flow.id}`}
            className="block text-xs text-sky-400 hover:underline"
          >
            ← Terug naar details
          </Link>
          <Link
            href="/app/flows"
            className="block text-xs text-slate-400 hover:underline"
          >
            Naar overzicht
          </Link>
        </div>
      </div>

      <FlowBuilderForm
        flowId={flow.id}
        initialDefinition={(flow as any).definition ?? null}
      />
    </div>
  );
}
