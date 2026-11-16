import { AppShellSkeleton } from "@/design-system/layouts/app-shell";
import { DocumentsSkeleton } from "@/features/documents/components/documents-skeleton";

// Shown instantly when entering the workspace (e.g. back from a document)
// while its layout queries the database.
export default function Loading() {
  return (
    <AppShellSkeleton>
      <DocumentsSkeleton />
    </AppShellSkeleton>
  );
}
