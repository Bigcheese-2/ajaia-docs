import "server-only";
import { db } from "@/lib/db";
import type { UserSummary } from "@/features/documents/types";

export const userSelect = { id: true, name: true, email: true, avatarColor: true } as const;

export async function findUserById(id: string): Promise<UserSummary | null> {
  return db.user.findUnique({ where: { id }, select: userSelect });
}

export async function listUsers(): Promise<UserSummary[]> {
  return db.user.findMany({ select: userSelect, orderBy: { name: "asc" } });
}
