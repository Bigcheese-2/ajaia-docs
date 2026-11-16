"use client";

import Link from "next/link";
import { useState } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/design-system/primitives/badge";
import { Button } from "@/design-system/primitives/button";
import { ThemeToggle } from "@/design-system/patterns/theme-toggle";
import { AvatarStack } from "@/design-system/patterns/user-avatar";
import { saveDocumentAction } from "@/features/documents/actions";
import type { DocumentDetail, UserSummary } from "@/features/documents/types";
import { UserMenu } from "@/features/auth/components/user-menu";
import { ShareDialog } from "@/features/sharing/components/share-dialog";
import { documentExtensions } from "../extensions";
import { useAutosave } from "../hooks/use-autosave";
import { EditorToolbar } from "./editor-toolbar";
import { SaveStatus } from "./save-status";

type Patch = { title?: string; content?: JSONContent };

export function DocumentEditor({ doc, currentUser }: { doc: DocumentDetail; currentUser: UserSummary }) {
  const [title, setTitle] = useState(doc.title);
  const isOwner = doc.access === "owner";

  // Merge title and content edits into a single debounced save.
  const latest = useState<Patch>(() => ({}))[0];
  const { state, schedule, retry } = useAutosave<Patch>(async (patch) => {
    const res = await saveDocumentAction(doc.id, patch);
    return res.ok;
  });
  const queue = (patch: Patch) => schedule(Object.assign(latest, patch));

  const editor = useEditor({
    extensions: [
      ...documentExtensions,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: doc.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none focus:outline-none",
        "aria-label": "Document body",
      },
    },
    onUpdate: ({ editor }) => queue({ content: editor.getJSON() }),
  });

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-3 md:px-6">
          <Button variant="ghost" size="icon" render={<Link href="/" />} nativeButton={false} aria-label="Back to documents">
            <ArrowLeft />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                queue({ title: e.target.value });
              }}
              onKeyDown={(e) => e.key === "Enter" && editor?.commands.focus("start")}
              maxLength={120}
              aria-label="Document title"
              placeholder="Untitled document"
              className="min-w-0 max-w-md flex-1 truncate rounded-md bg-transparent px-2 py-1 text-base font-medium outline-none hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-ring/40"
            />
            {isOwner ? (
              <Badge variant="secondary" className="hidden sm:inline-flex">Owner</Badge>
            ) : (
              <Badge variant="outline" className="hidden sm:inline-flex">Shared by {doc.owner.name.split(" ")[0]}</Badge>
            )}
            <span className="hidden md:block">
              <SaveStatus state={state} onRetry={retry} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AvatarStack users={[doc.owner, ...doc.sharedWith]} className="hidden sm:flex" />
            <ShareDialog
              documentId={doc.id}
              documentTitle={title || "Untitled document"}
              owner={doc.owner}
              initialSharedWith={doc.sharedWith}
              canManage={isOwner}
            />
            <ThemeToggle />
            <UserMenu user={currentUser} />
          </div>
        </div>
      </header>

      <div className="sticky top-14 z-10 flex justify-center px-3 pt-3">
        {editor ? <EditorToolbar editor={editor} /> : <div className="h-10" />}
      </div>

      <main className="px-3 pt-4 pb-24">
        <div className="doc-page mx-auto w-full max-w-[816px] rounded-lg border bg-background px-6 py-10 shadow-sm sm:px-16 sm:py-16">
          <EditorContent editor={editor} />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">
          <SaveStatus state={state} onRetry={retry} />
        </p>
      </main>
    </div>
  );
}
