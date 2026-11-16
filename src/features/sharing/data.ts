import "server-only";
import { mockDocuments, mockUsers } from "@/features/documents/mock-data";
import type { UserSummary } from "@/features/documents/types";

/**
 * Sharing data access. UI phase: in-memory fixtures. Integration phase: Prisma.
 * All rules are enforced here, not in the UI.
 */
export type ShareResult = { ok: true; user: UserSummary } | { ok: false; error: string };

export async function addShare(documentId: string, actorId: string, email: string): Promise<ShareResult> {
  const doc = mockDocuments.find((d) => d.id === documentId);
  if (!doc) return { ok: false, error: "Document not found." };
  if (doc.ownerId !== actorId) return { ok: false, error: "Only the owner can share this document." };

  const user = mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { ok: false, error: "No user with that email. Try alice@, bob@ or carol@demo.com." };
  if (user.id === doc.ownerId) return { ok: false, error: "You already own this document." };
  if (doc.sharedWithIds.includes(user.id)) return { ok: false, error: `${user.name} already has access.` };

  doc.sharedWithIds.push(user.id);
  return { ok: true, user };
}

export async function removeShare(documentId: string, actorId: string, userId: string): Promise<boolean> {
  const doc = mockDocuments.find((d) => d.id === documentId);
  if (!doc || doc.ownerId !== actorId) return false;
  doc.sharedWithIds = doc.sharedWithIds.filter((id) => id !== userId);
  return true;
}
