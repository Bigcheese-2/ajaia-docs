import "server-only";
import { contentPreview, emptyDocument } from "./content";
import { mockDocuments, mockUsers, type MockDocument } from "./mock-data";
import type { DocumentDetail, DocumentSummary, UserSummary } from "./types";

/**
 * Document data access. UI phase: backed by in-memory fixtures.
 * Integration phase: same function signatures, backed by Prisma.
 */

const userById = (id: string) => mockUsers.find((u) => u.id === id) as UserSummary;

function toDetail(doc: MockDocument, viewerId: string): DocumentDetail {
  return {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    preview: contentPreview(doc.content, 140, doc.title),
    updatedAt: doc.updatedAt,
    owner: userById(doc.ownerId),
    access: doc.ownerId === viewerId ? "owner" : "editor",
    sharedWith: doc.sharedWithIds.map(userById),
  };
}

const canView = (doc: MockDocument, userId: string) =>
  doc.ownerId === userId || doc.sharedWithIds.includes(userId);

export async function listDocuments(userId: string): Promise<{
  owned: DocumentSummary[];
  shared: DocumentSummary[];
}> {
  const visible = mockDocuments
    .filter((d) => canView(d, userId))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((d) => toDetail(d, userId));
  return {
    owned: visible.filter((d) => d.access === "owner"),
    shared: visible.filter((d) => d.access !== "owner"),
  };
}

export async function getDocument(id: string, userId: string): Promise<DocumentDetail | null> {
  const doc = mockDocuments.find((d) => d.id === id);
  return doc && canView(doc, userId) ? toDetail(doc, userId) : null;
}

export async function createDocument(userId: string, title = "Untitled document", content = emptyDocument) {
  const doc: MockDocument = {
    id: `d_${Math.random().toString(36).slice(2, 10)}`,
    title,
    content,
    ownerId: userId,
    sharedWithIds: [],
    updatedAt: new Date().toISOString(),
  };
  mockDocuments.unshift(doc);
  return doc.id;
}

/** Owner or editor. Returns the new updatedAt, or null when the user can't edit. */
export async function updateDocument(
  id: string,
  userId: string,
  patch: { title?: string; content?: MockDocument["content"] },
): Promise<string | null> {
  const doc = mockDocuments.find((d) => d.id === id);
  if (!doc || !canView(doc, userId)) return null;
  if (patch.title !== undefined) doc.title = patch.title;
  // Store a plain copy: objects decoded from a server action's arguments are
  // tied to that request and can't be re-serialized in a later render.
  if (patch.content !== undefined) doc.content = JSON.parse(JSON.stringify(patch.content));
  doc.updatedAt = new Date().toISOString();
  return doc.updatedAt;
}

/** Owner-only. Returns false when the doc is missing or the user isn't the owner. */
export async function deleteDocument(id: string, userId: string): Promise<boolean> {
  const index = mockDocuments.findIndex((d) => d.id === id && d.ownerId === userId);
  if (index === -1) return false;
  mockDocuments.splice(index, 1);
  return true;
}

export async function listUsers(): Promise<UserSummary[]> {
  return mockUsers;
}
