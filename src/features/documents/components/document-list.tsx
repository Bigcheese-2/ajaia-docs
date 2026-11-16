"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus2, Search, SearchX, Users, X } from "lucide-react";
import { FadeIn } from "@/design-system/motion/fade-in";
import { EmptyState } from "@/design-system/patterns/empty-state";
import { Input } from "@/design-system/primitives/input";
import { cn } from "@/lib/utils";
import type { DocumentFilter, DocumentSummary } from "../types";
import { DocumentRow, ROW_GRID } from "./document-row";
import { NewDocumentButton } from "./new-document-button";

const FILTERS: { value: DocumentFilter; label: string; href: string }[] = [
  { value: "all", label: "All", href: "/" },
  { value: "owned", label: "Owned by me", href: "/?filter=owned" },
  { value: "shared", label: "Shared with me", href: "/?filter=shared" },
];

function FilterTabs({ active }: { active: DocumentFilter }) {
  return (
    <div role="tablist" aria-label="Filter documents" className="inline-flex h-9 rounded-lg border bg-surface p-0.5">
      {FILTERS.map((f) => (
        <Link
          key={f.value}
          href={f.href}
          role="tab"
          aria-selected={active === f.value}
          className={cn(
            "flex items-center rounded-md px-3 text-[13px] whitespace-nowrap text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            active === f.value && "bg-muted font-medium text-foreground",
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}

function Section({ title, docs, empty }: { title: string; docs: DocumentSummary[]; empty: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        {title}
        <span className="text-xs font-normal text-subtle-foreground tabular-nums">{docs.length}</span>
      </h2>
      {docs.length === 0 ? (
        empty
      ) : (
        <div className="overflow-hidden rounded-lg border bg-surface">
          <div
            aria-hidden
            className={`hidden border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid ${ROW_GRID}`}
          >
            <span>Name</span>
            <span>Owner</span>
            <span>Last modified</span>
            <span>Access</span>
            <span />
          </div>
          <ul className="divide-y">
            {docs.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

const matches = (q: string) => (d: DocumentSummary) =>
  d.title.toLowerCase().includes(q) || d.owner.name.toLowerCase().includes(q);

export function DocumentList({
  owned,
  shared,
  filter,
}: {
  owned: DocumentSummary[];
  shared: DocumentSummary[];
  filter: DocumentFilter;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const [ownedShown, sharedShown] = useMemo(
    () => (q ? [owned.filter(matches(q)), shared.filter(matches(q))] : [owned, shared]),
    [owned, shared, q],
  );
  const searching = q.length > 0;
  const noResults =
    searching &&
    (filter === "owned" ? ownedShown : filter === "shared" ? sharedShown : [...ownedShown, ...sharedShown])
      .length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="overflow-x-auto">
          <FilterTabs active={filter} />
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents"
            aria-label="Search documents by title or owner"
            className="pr-8 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {noResults ? (
        <EmptyState
          icon={SearchX}
          title="No matching documents"
          description={`Nothing matches “${query.trim()}”. Try a different title or owner name.`}
        />
      ) : (
        <FadeIn className="space-y-8">
          {filter !== "shared" && !(searching && ownedShown.length === 0) && (
            <Section
              title="My documents"
              docs={ownedShown}
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
          {filter !== "owned" && !(searching && sharedShown.length === 0) && (
            <Section
              title="Shared with me"
              docs={sharedShown}
              empty={
                <EmptyState
                  icon={Users}
                  title="Nothing shared with you yet"
                  description="When someone shares a document with you, it shows up here."
                />
              }
            />
          )}
        </FadeIn>
      )}
    </div>
  );
}
