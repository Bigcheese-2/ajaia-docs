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

export function DocumentRow({ doc }: { doc: DocumentSummary }) {
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
    <li className={`group relative px-4 py-3 transition-colors duration-150 hover:bg-muted/60 ${ROW_GRID}`}>
      {/* Title: the link covers the whole row; menu sits above it. */}
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground group-hover:text-primary">
          <FileText className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <Link
            href={href}
            className="block truncate text-sm font-medium outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring/50"
          >
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
        {isOwner ? (
          doc.sharedWith.length > 0 ? (
            <AvatarStack users={doc.sharedWith} />
          ) : (
            <span className="text-xs text-subtle-foreground">Private</span>
          )
        ) : (
          <Badge variant="outline">Editor</Badge>
        )}
      </div>

      <div className="relative z-10 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${doc.title}`}
                className="md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:aria-expanded:opacity-100"
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
      </div>

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
    </li>
  );
}
