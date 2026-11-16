"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
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
import { AvatarStack } from "@/design-system/patterns/user-avatar";
import { RelativeTime } from "@/design-system/patterns/relative-time";
import { deleteDocumentAction } from "../actions";
import type { DocumentSummary } from "../types";

export function DocumentCard({ doc }: { doc: DocumentSummary }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const isOwner = doc.access === "owner";
  const people = isOwner ? doc.sharedWith : [doc.owner];

  const onDelete = () =>
    startTransition(async () => {
      const res = await deleteDocumentAction(doc.id);
      if (res.ok) {
        toast.success("Document deleted");
        setConfirmOpen(false);
      } else toast.error(res.error ?? "Couldn't delete the document. Try again.");
    });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      {/* Page thumbnail */}
      <Link href={`/documents/${doc.id}`} className="block bg-muted/50 px-5 pt-5" aria-label={`Open ${doc.title}`}>
        <div className="h-28 overflow-hidden rounded-t-md border border-b-0 bg-background px-4 pt-3 shadow-sm">
          <p className="truncate text-[11px] font-semibold">{doc.title}</p>
          <p className="mt-1.5 line-clamp-4 text-[10px] leading-relaxed text-muted-foreground">
            {doc.preview || "Empty document"}
          </p>
        </div>
      </Link>

      <div className="flex items-start gap-2 border-t p-4">
        <div className="min-w-0 flex-1">
          <Link href={`/documents/${doc.id}`} className="block truncate font-medium hover:underline">
            {doc.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <RelativeTime iso={doc.updatedAt} />
            <span aria-hidden>·</span>
            {isOwner ? (
              <Badge variant="secondary">Owner</Badge>
            ) : (
              <Badge variant="outline" className="max-w-32 truncate">
                Shared by {doc.owner.name.split(" ")[0]}
              </Badge>
            )}
          </div>
        </div>

        {people.length > 0 && <AvatarStack users={people} className="mt-0.5" />}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Document actions" />}>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={`/documents/${doc.id}`} />}>
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
            <Button variant="destructive" onClick={onDelete} disabled={pending}>
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
