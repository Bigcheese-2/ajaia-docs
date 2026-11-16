import "server-only";
import type { Prisma } from "@prisma/client";
import type { JSONContent } from "@tiptap/react";
import { db } from "@/lib/db";
import { userSelect } from "@/features/auth/users";
import { contentPreview, emptyDocument } from "./content";
import { accessFor, can } from "./permissions";
import type { DocumentDetail, DocumentSummary } from "./types";

/**
 * Document data access. Every read is scoped to what the user may see and
 * every write checks `can()` first. Callers never touch Prisma directly.
 */

const documentInclude = {
  owner: { select: userSelect },
  shares: { select: { user: { select: userSelect } }, orderBy: { createdAt: "asc" } },
} satisfies Prisma.DocumentInclude;

type DocumentRow = Prisma.DocumentGetPayload<{ include: typeof documentInclude }>;

/** Documents the user owns or has been shared. */
const visibleTo = (userId: string): Prisma.DocumentWhereInput => ({
  OR: [{ ownerId: userId }, { shares: { some: { userId } } }],
});

function toSummary(row: DocumentRow, viewerId: string): DocumentSummary {
  const sharedWith = row.shares.map((s) => s.user);
  return {
    id: row.id,
    title: row.title,
    preview: contentPreview(row.content as JSONContent, 140, row.title),
    updatedAt: row.updatedAt.toISOString(),
    owner: row.owner,
    // Rows come from a visibleTo() query, so the viewer always has some access.
    access: accessFor({ ownerId: row.ownerId, sharedWithIds: sharedWith.map((u) => u.id) }, viewerId) ?? "editor",
    sharedWith,
  };
}

const toDetail = (row: DocumentRow, viewerId: string): DocumentDetail => ({
  ...toSummary(row, viewerId),
  content: row.content as JSONContent,
});

export async function listDocuments(userId: string): Promise<{ owned: DocumentSummary[]; shared: DocumentSummary[] }> {
  const rows = await db.document.findMany({
    where: visibleTo(userId),
    include: documentInclude,
    orderBy: { updatedAt: "desc" },
  });
  // Cards only need the preview; keep full bodies out of the client payload.
  const docs = rows.map((row) => toSummary(row, userId));
  return {
    owned: docs.filter((d) => d.access === "owner"),
    shared: docs.filter((d) => d.access !== "owner"),
  };
}

/** Null when the doc is missing *or* not visible, so ids can't be probed. */
export async function getDocument(id: string, userId: string): Promise<DocumentDetail | null> {
  const row = await db.document.findFirst({ where: { id, ...visibleTo(userId) }, include: documentInclude });
  return row ? toDetail(row, userId) : null;
}

export async function createDocument(
  userId: string,
  title = "Untitled document",
  content: JSONContent = emptyDocument,
): Promise<string> {
  const doc = await db.document.create({
    data: { title, content: content as Prisma.InputJsonValue, ownerId: userId },
    select: { id: true },
  });
  return doc.id;
}

/** The user's access to a document, or null when they have none (or it's gone). */
export async function getAccess(id: string, userId: string) {
  const doc = await db.document.findUnique({
    where: { id },
    select: { ownerId: true, shares: { select: { userId: true } } },
  });
  return doc ? accessFor({ ownerId: doc.ownerId, sharedWithIds: doc.shares.map((s) => s.userId) }, userId) : null;
}

/** Owner or editor. Returns the new updatedAt, or null when the user can't edit. */
export async function updateDocument(
  id: string,
  userId: string,
  patch: { title?: string; content?: JSONContent },
): Promise<string | null> {
  if (!can(await getAccess(id, userId), "edit")) return null;
  const doc = await db.document.update({
    where: { id },
    data: { title: patch.title, content: patch.content as Prisma.InputJsonValue | undefined },
    select: { updatedAt: true },
  });
  return doc.updatedAt.toISOString();
}

/** Owner only. Shares go with it via the cascade. */
export async function deleteDocument(id: string, userId: string): Promise<boolean> {
  if (!can(await getAccess(id, userId), "delete")) return false;
  await db.document.delete({ where: { id } });
  return true;
}
