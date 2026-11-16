"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { createDocument } from "@/features/documents/data";
import { validateImportFile } from "./constants";
import { convertFile } from "./convert";

export type ImportResult = { ok: false; error: string };

/** Creates a new document from an uploaded .txt/.md/.docx and opens it. */
export async function importDocumentAction(formData: FormData): Promise<ImportResult> {
  const user = await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Choose a file to import." };

  // Same rules as the client, enforced again here: the client is not trusted.
  const problem = validateImportFile(file);
  if (problem) return { ok: false, error: problem };

  let id: string;
  try {
    const { title, content } = await convertFile(file.name, Buffer.from(await file.arrayBuffer()));
    id = await createDocument(user.id, title, content);
  } catch (error) {
    console.error("Import failed", { name: file.name, error });
    return { ok: false, error: "We couldn't read that file. Is it a valid .txt, .md or .docx?" };
  }

  revalidatePath("/");
  redirect(`/documents/${id}`);
}
