import "server-only";
import { mockUsers } from "@/features/documents/mock-data";
import type { UserSummary } from "@/features/documents/types";

/**
 * Current user. UI phase: always Alice.
 * Integration phase: read from the demo-login cookie.
 */
export async function getCurrentUser(): Promise<UserSummary> {
  return mockUsers[0];
}
