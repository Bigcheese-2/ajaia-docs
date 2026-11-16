import { PageHeader } from "@/design-system/patterns/page-header";
import { ImportDialog } from "@/features/import/components/import-dialog";
import type { DocumentFilter, DocumentSummary } from "../types";
import { DocumentList } from "./document-list";
import { NewDocumentButton } from "./new-document-button";

export function DocumentsDashboard({
  userName,
  owned,
  shared,
  filter,
}: {
  userName: string;
  owned: DocumentSummary[];
  shared: DocumentSummary[];
  filter: DocumentFilter;
}) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Documents"
        description={`Welcome back, ${userName.split(" ")[0]}.`}
        actions={
          <>
            <ImportDialog />
            <NewDocumentButton />
          </>
        }
      />
      <DocumentList owned={owned} shared={shared} filter={filter} />
    </div>
  );
}
