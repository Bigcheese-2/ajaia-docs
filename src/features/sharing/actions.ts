"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/features/auth/session";
import { addShare, removeShare, type ShareResult } from "./data";

const emailSchema = z.email({ error: "Enter a valid email address." });

export async function shareDocumentAction(documentId: string, email: string): Promise<ShareResult> {
  const parsed = emailSchema.safeParse(email.trim());
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const user = await getCurrentUser();
  const result = await addShare(documentId, user.id, parsed.data);
  if (result.ok) revalidatePath("/");
  return result;
}

export async function unshareDocumentAction(documentId: string, userId: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  const ok = await removeShare(documentId, user.id, userId);
  if (ok) revalidatePath("/");
  return { ok };
}
