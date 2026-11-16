import { getCurrentUser } from "@/features/auth/session";
import { DocumentsDashboard } from "@/features/documents/components/documents-dashboard";
import { listDocuments } from "@/features/documents/data";
import type { DocumentFilter } from "@/features/documents/types";

const FILTERS: DocumentFilter[] = ["all", "owned", "shared"];

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter: raw } = await searchParams;
  const filter = FILTERS.includes(raw as DocumentFilter) ? (raw as DocumentFilter) : "all";
  const user = await getCurrentUser();
  const { owned, shared } = await listDocuments(user.id);

  return <DocumentsDashboard userName={user.name} owned={owned} shared={shared} filter={filter} />;
}
