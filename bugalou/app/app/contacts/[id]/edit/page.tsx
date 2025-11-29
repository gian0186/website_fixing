// app/app/contacts/[id]/edit/page.tsx
import { requireAuth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ContactEditForm } from "@/components/ContactEditForm";

const prisma = new PrismaClient();

type EditContactPageProps = {
  params: { id: string };
};

export default async function EditContactPage({ params }: EditContactPageProps) {
  const session = await requireAuth();
  const companyId = (session.user as any).companyId as string;

  const contact = await prisma.contact.findFirst({
    where: {
      id: params.id,
      companyId,
    },
  });

  if (!contact) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Contact niet gevonden</h1>
        <p className="text-sm text-slate-400">
          Dit contact bestaat niet (meer) of je hebt er geen toegang toe.
        </p>
        <Link
          href="/app/contacts"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Terug naar contacten
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Contact bewerken</h1>
          <p className="text-sm text-slate-400">
            Pas de gegevens van dit contact aan.
          </p>
        </div>

        <div className="text-right text-xs space-y-1">
          <Link
            href={`/app/contacts/${contact.id}`}
            className="block text-sky-400 hover:underline"
          >
            ← Terug naar details
          </Link>
          <Link
            href="/app/contacts"
            className="block text-slate-400 hover:underline"
          >
            Naar overzicht
          </Link>
        </div>
      </div>

      <ContactEditForm
        contactId={contact.id}
        initialName={contact.name}
        initialPhone={contact.phone}
        initialEmail={contact.email}
      />
    </div>
  );
}
