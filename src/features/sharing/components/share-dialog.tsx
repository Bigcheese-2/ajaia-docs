"use client";

import { useState, useTransition } from "react";
import { Loader2, Lock, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/design-system/primitives/badge";
import { Button } from "@/design-system/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/design-system/primitives/dialog";
import { Input } from "@/design-system/primitives/input";
import { Label } from "@/design-system/primitives/label";
import { UserAvatar } from "@/design-system/patterns/user-avatar";
import type { UserSummary } from "@/features/documents/types";
import { shareDocumentAction, unshareDocumentAction } from "../actions";

export function ShareDialog({
  documentId,
  documentTitle,
  owner,
  initialSharedWith,
  canManage,
}: {
  documentId: string;
  documentTitle: string;
  owner: UserSummary;
  initialSharedWith: UserSummary[];
  canManage: boolean;
}) {
  const [sharedWith, setSharedWith] = useState(initialSharedWith);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adding, startAdding] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startAdding(async () => {
      const res = await shareDocumentAction(documentId, email);
      if (!res.ok) return setError(res.error);
      setSharedWith((prev) => [...prev, res.user]);
      setEmail("");
      toast.success(`Shared with ${res.user.name}`);
    });
  };

  const onRemove = async (user: UserSummary) => {
    setRemovingId(user.id);
    const res = await unshareDocumentAction(documentId, user.id);
    setRemovingId(null);
    if (!res.ok) return toast.error("Couldn't remove access. Try again.");
    setSharedWith((prev) => prev.filter((u) => u.id !== user.id));
    toast.success(`Removed ${user.name}`);
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Share2 /> Share
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">Share “{documentTitle}”</DialogTitle>
          <DialogDescription>
            {canManage ? "People you add can view and edit this document." : "Only the owner can change who has access."}
          </DialogDescription>
        </DialogHeader>

        {canManage && (
          <form onSubmit={onAdd} className="space-y-2" noValidate>
            <Label htmlFor="share-email">Add people</Label>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="bob@demo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "share-error" : undefined}
                autoComplete="off"
              />
              <Button type="submit" disabled={!email.trim() || adding}>
                {adding && <Loader2 className="animate-spin" />}
                Add
              </Button>
            </div>
            {error && (
              <p id="share-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">People with access</p>
          <ul className="divide-y rounded-lg border bg-background">
            {[owner, ...sharedWith].map((user) => {
              const isOwner = user.id === owner.id;
              return (
                <li key={user.id} className="flex items-center gap-3 px-3 py-2.5 animate-in fade-in-0 duration-150">
                  <UserAvatar user={user} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {isOwner ? (
                    <Badge variant="secondary">Owner</Badge>
                  ) : (
                    <>
                      <Badge variant="outline">Editor</Badge>
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${user.name}`}
                          onClick={() => onRemove(user)}
                          disabled={removingId === user.id}
                        >
                          {removingId === user.id ? <Loader2 className="animate-spin" /> : <X />}
                        </Button>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {sharedWith.length === 0 && (
            <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Lock className="size-3" /> Only you can access this document.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
