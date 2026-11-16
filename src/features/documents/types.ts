import type { JSONContent } from "@tiptap/react";

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

/** How the current user relates to a document. */
export type DocumentAccess = "owner" | "editor";

export type DocumentSummary = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string; // ISO timestamp
  owner: UserSummary;
  access: DocumentAccess;
  sharedWith: UserSummary[];
};

export type DocumentDetail = DocumentSummary & {
  content: JSONContent;
};

export type DocumentFilter = "all" | "owned" | "shared";
