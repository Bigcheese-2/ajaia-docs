"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/design-system/primitives/badge";
import { Button } from "@/design-system/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/design-system/primitives/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/design-system/primitives/dropdown-menu";
import { AvatarStack, UserAvatar } from "@/design-system/patterns/user-avatar";
import { RelativeTime } from "@/design-system/patterns/relative-time";
import { deleteDocumentAction } from "../actions";
import type { DocumentSummary } from "../types";

/** Shared column template so the header and every row line up. */
export const ROW_GRID = "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:grid-cols-[minmax(0,1fr)_150px_120px_88px_32px]";

/** Row/card menu: Open for everyone, Delete (with confirmation) for the owner. */
export function DocumentActions({ doc, revealOnHover = true }: { doc: DocumentSummary; revealOnHover?: boolean }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const isOwner = doc.access === "owner";
  const href = `/documents/${doc.id}`;

  const onDelete = () =>
    startTransition(async () => {
      const res = await deleteDocumentAction(doc.id);
      if (res.ok) {
        toast.success("Document deleted");
        setConfirmOpen(false);
      } else toast.error(res.error ?? "Couldn't delete the document. Try again.");
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${doc.title}`}
              className={
                revealOnHover
                  ? "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:aria-expanded:opacity-100"
                  : undefined
              }
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem render={<Link href={href} />}>
            <ExternalLink /> Open
          </DropdownMenuItem>
          {isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{doc.title}”?</DialogTitle>
            <DialogDescription>
              This removes the document for you and everyone it&apos;s shared with. You can&apos;t undo this.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              onClick={onDelete}
              disabled={pending}
              className="bg-destructive text-white hover:bg-destructive/90 dark:text-background"
            >
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Who else is involved: share avatars for owners, an Editor badge for shared docs. */
function AccessSummary({ doc }: { doc: DocumentSummary }) {
  if (doc.access !== "owner") return <Badge variant="outline">Editor</Badge>;
  return doc.sharedWith.length > 0 ? (
    <AvatarStack users={doc.sharedWith} />
  ) : (
    <span className="text-xs text-subtle-foreground">Private</span>
  );
}

const OVERLAY_LINK =
  "outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring/50";

export function DocumentRow({ doc }: { doc: DocumentSummary }) {
  const isOwner = doc.access === "owner";
  return (
    <li className={`group relative px-4 py-3 transition-colors duration-150 hover:bg-muted/60 ${ROW_GRID}`}>
      {/* Title: the link covers the whole row; the menu sits above it. */}
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground group-hover:text-primary">
          <FileText className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <Link href={`/documents/${doc.id}`} className={`block truncate text-sm font-medium ${OVERLAY_LINK}`}>
            {doc.title}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            <span className="md:hidden">
              {isOwner ? "You" : doc.owner.name} · <RelativeTime iso={doc.updatedAt} />
            </span>
            <span className="hidden md:inline">{doc.preview || "Empty document"}</span>
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground md:flex">
        <UserAvatar user={doc.owner} size="sm" />
        <span className="truncate">{isOwner ? "You" : doc.owner.name}</span>
      </div>

      <RelativeTime iso={doc.updatedAt} className="hidden text-sm text-muted-foreground md:block" />

      <div className="hidden md:block">
        <AccessSummary doc={doc} />
      </div>

      <div className="relative z-10 flex justify-end">
        <DocumentActions doc={doc} />
      </div>
    </li>
  );
}

export function DocumentCard({ doc }: { doc: DocumentSummary }) {
  const isOwner = doc.access === "owner";
  return (
    <li className="group relative flex flex-col rounded-lg border bg-surface transition-colors duration-150 hover:border-primary/40">
      {/* Page preview */}
      <div className="h-32 overflow-hidden rounded-t-lg border-b bg-background px-5 pt-4">
        <p className="truncate text-xs font-semibold">{doc.title}</p>
        <p className="mt-1.5 line-clamp-4 text-[11px] leading-relaxed text-muted-foreground">
          {doc.preview || "Empty document"}
        </p>
      </div>
      <div className="space-y-1.5 p-3.5 pt-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/documents/${doc.id}`}
            className={`min-w-0 flex-1 truncate text-sm font-medium ${OVERLAY_LINK}`}
          >
            {doc.title}
          </Link>
          <div className="relative z-10 -mr-1.5">
            <DocumentActions doc={doc} revealOnHover={false} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">
            {isOwner ? "You" : doc.owner.name} · <RelativeTime iso={doc.updatedAt} />
          </p>
          <AccessSummary doc={doc} />
        </div>
      </div>
    </li>
  );
}
