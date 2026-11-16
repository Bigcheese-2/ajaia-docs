import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { userSelect } from "@/features/auth/users";
import { getAccess } from "@/features/documents/data";
import { can } from "@/features/documents/permissions";
import type { UserSummary } from "@/features/documents/types";

/**
 * Sharing data access. All rules are enforced here, not in the UI:
 * only the owner shares, the recipient must exist, and nobody is added twice.
 */
export type ShareResult = { ok: true; user: UserSummary } | { ok: false; error: string };

const FORBIDDEN: ShareResult = { ok: false, error: "Only the owner can share this document." };

export async function addShare(documentId: string, actorId: string, email: string): Promise<ShareResult> {
  const access = await getAccess(documentId, actorId);
  if (!access) return { ok: false, error: "Document not found." };
  if (!can(access, "share")) return FORBIDDEN;

  const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() }, select: userSelect });
  if (!user) return { ok: false, error: "No user with that email. Try alice@, bob@ or carol@demo.com." };
  if (user.id === actorId) return { ok: false, error: "You already own this document." };

  try {
    await db.documentShare.create({ data: { documentId, userId: user.id } });
  } catch (e) {
    // The (documentId, userId) unique constraint is the source of truth for
    // duplicates, so two concurrent shares can't both succeed.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: `${user.name} already has access.` };
    }
    throw e;
  }
  return { ok: true, user };
}

/** Owner only. Returns false when the actor can't share or nothing was removed. */
export async function removeShare(documentId: string, actorId: string, userId: string): Promise<boolean> {
  if (!can(await getAccess(documentId, actorId), "share")) return false;
  const { count } = await db.documentShare.deleteMany({ where: { documentId, userId } });
  return count > 0;
}
