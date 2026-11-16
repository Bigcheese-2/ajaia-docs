import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { getDocument } from "@/features/documents/data";
import { DocumentEditor } from "@/features/editor/components/document-editor";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const doc = await getDocument(id, user.id);
  return { title: doc ? `${doc.title} · Ajaia Docs` : "Not found · Ajaia Docs" };
}

export default async function DocumentPage({ params }: Props) {
  const { id } = await params;
  const user = await requireUser();
  // Returns null both when missing and when the user has no access,
  // so we don't reveal which documents exist.
  const doc = await getDocument(id, user.id);
  if (!doc) notFound();

  return <DocumentEditor doc={doc} currentUser={user} />;
}
