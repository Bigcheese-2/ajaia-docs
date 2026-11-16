import "server-only";
import { mockUsers } from "@/features/documents/mock-data";
import type { UserSummary } from "@/features/documents/types";

/** User data access. Backed by fixtures until the database branch lands. */
export async function findUserById(id: string): Promise<UserSummary | null> {
  return mockUsers.find((u) => u.id === id) ?? null;
}

export async function listUsers(): Promise<UserSummary[]> {
  return mockUsers;
}
