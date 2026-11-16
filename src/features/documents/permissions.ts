import type { DocumentAccess } from "./types";

/**
 * Access rules, in one place. Pure so they can be unit tested without a DB.
 *
 *            view  edit  share  delete
 *   owner     ✓     ✓     ✓      ✓
 *   editor    ✓     ✓     ✗      ✗
 *   none      ✗     ✗     ✗      ✗
 */
export type DocumentAction = "view" | "edit" | "share" | "delete";

export function accessFor(
  doc: { ownerId: string; sharedWithIds: readonly string[] },
  userId: string,
): DocumentAccess | null {
  if (doc.ownerId === userId) return "owner";
  if (doc.sharedWithIds.includes(userId)) return "editor";
  return null;
}

export function can(access: DocumentAccess | null, action: DocumentAction): boolean {
  if (access === "owner") return true;
  if (access === "editor") return action === "view" || action === "edit";
  return false;
}
