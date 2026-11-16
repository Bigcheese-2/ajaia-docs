import Link from "next/link";
import { FilePlus2, Users } from "lucide-react";
import { EmptyState } from "@/design-system/patterns/empty-state";
import { PageHeader } from "@/design-system/patterns/page-header";
import { cn } from "@/lib/utils";
import { ImportDialog } from "@/features/import/components/import-dialog";
import type { DocumentFilter, DocumentSummary } from "../types";
import { DocumentCard } from "./document-card";
import { NewDocumentButton } from "./new-document-button";

const FILTERS: { value: DocumentFilter; label: string; href: string }[] = [
  { value: "all", label: "All", href: "/" },
  { value: "owned", label: "Owned by me", href: "/?filter=owned" },
  { value: "shared", label: "Shared with me", href: "/?filter=shared" },
];

function FilterTabs({ active }: { active: DocumentFilter }) {
  return (
    <div role="tablist" aria-label="Filter documents" className="inline-flex rounded-lg bg-muted p-1">
      {FILTERS.map((f) => (
        <Link
          key={f.value}
          href={f.href}
          role="tab"
          aria-selected={active === f.value}
          className={cn(
            "rounded-md px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
            active === f.value && "bg-background font-medium text-foreground shadow-sm",
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}

function DocumentSection({ title, docs, empty }: { title: string; docs: DocumentSummary[]; empty: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        {title} <span className="tabular-nums">({docs.length})</span>
      </h2>
      {docs.length === 0 ? (
        empty
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </section>
  );
}

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
      <FilterTabs active={filter} />

      {filter !== "shared" && (
        <DocumentSection
          title="My documents"
          docs={owned}
          empty={
            <EmptyState
              icon={FilePlus2}
              title="Start your first document"
              description="Create a blank document or import a .txt, .md or .docx file."
              action={<NewDocumentButton />}
            />
          }
        />
      )}
      {filter !== "owned" && (
        <DocumentSection
          title="Shared with me"
          docs={shared}
          empty={
            <EmptyState
              icon={Users}
              title="Nothing shared with you yet"
              description="When someone shares a document with you, it shows up here."
            />
          }
        />
      )}
    </div>
  );
}
