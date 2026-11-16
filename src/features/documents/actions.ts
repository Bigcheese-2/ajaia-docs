"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/session";
import type { JSONContent } from "@tiptap/react";
import { z } from "zod";
import { createDocument, deleteDocument, updateDocument } from "./data";

export type SaveResult = { ok: true; updatedAt: string } | { ok: false; error: string };

const saveSchema = z.object({
  title: z
    .string()
    .max(500)
    .transform((t) => t.trim().slice(0, 120) || "Untitled document")
    .optional(),
  // Tiptap JSON: a root "doc" node. Size-capped to keep rows reasonable.
  content: z
    .looseObject({ type: z.literal("doc") })
    .refine((c) => JSON.stringify(c).length < 1_000_000, "Document is too large.")
    .optional(),
});

export async function saveDocumentAction(
  id: string,
  patch: { title?: string; content?: JSONContent },
): Promise<SaveResult> {
  const parsed = saveSchema.safeParse(patch);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const user = await getCurrentUser();
  const updatedAt = await updateDocument(id, user.id, parsed.data as { title?: string; content?: JSONContent });
  if (!updatedAt) return { ok: false, error: "You don't have access to edit this document." };
  revalidatePath("/");
  return { ok: true, updatedAt };
}

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
