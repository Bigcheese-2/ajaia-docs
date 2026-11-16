"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/session";
import { createDocument, deleteDocument } from "./data";

export async function createDocumentAction() {
  const user = await getCurrentUser();
  const id = await createDocument(user.id);
  redirect(`/documents/${id}`);
}

export async function deleteDocumentAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  const ok = await deleteDocument(id, user.id);
  if (!ok) return { ok: false, error: "Only the owner can delete this document." };
  revalidatePath("/");
  return { ok: true };
}
