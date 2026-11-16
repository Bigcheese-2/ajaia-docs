import type { JSONContent } from "@tiptap/react";
import type { UserSummary } from "./types";

/**
 * UI-phase fixtures. Replaced by Prisma queries in the integration phase;
 * the shapes match the real data layer so components don't change.
 */
export const mockUsers: UserSummary[] = [
  { id: "u_alice", name: "Alice Johnson", email: "alice@demo.com", avatarColor: "#6366f1" },
  { id: "u_bob", name: "Bob Smith", email: "bob@demo.com", avatarColor: "#10b981" },
  { id: "u_carol", name: "Carol Lee", email: "carol@demo.com", avatarColor: "#f59e0b" },
];

const p = (text: string): JSONContent => ({ type: "paragraph", content: [{ type: "text", text }] });
const h = (level: number, text: string): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});
const bullets = (...items: string[]): JSONContent => ({
  type: "bulletList",
  content: items.map((t) => ({ type: "listItem", content: [p(t)] })),
});

export type MockDocument = {
  id: string;
  title: string;
  content: JSONContent;
  ownerId: string;
  sharedWithIds: string[];
  updatedAt: string;
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const mockDocuments: MockDocument[] = [
  {
    id: "d_welcome",
    title: "Welcome to Ajaia Docs",
    ownerId: "u_alice",
    sharedWithIds: ["u_bob"],
    updatedAt: minutesAgo(3),
    content: {
      type: "doc",
      content: [
        h(1, "Welcome to Ajaia Docs"),
        p("This document is owned by Alice and shared with Bob. Try editing it as either user."),
        bullets("Bold, italic and underline", "Headings and lists", "Autosave as you type"),
      ],
    },
  },
  {
    id: "d_roadmap",
    title: "Q4 product roadmap",
    ownerId: "u_alice",
    sharedWithIds: ["u_bob", "u_carol"],
    updatedAt: minutesAgo(90),
    content: {
      type: "doc",
      content: [h(1, "Q4 product roadmap"), p("Themes for the quarter: collaboration, search and reliability."), bullets("Shared editing", "Faster search", "99.9% uptime")],
    },
  },
  {
    id: "d_onboarding",
    title: "Team onboarding guide",
    ownerId: "u_alice",
    sharedWithIds: [],
    updatedAt: minutesAgo(60 * 26),
    content: { type: "doc", content: [h(1, "Team onboarding guide"), p("Everything a new teammate needs in their first week.")] },
  },
  {
    id: "d_design_review",
    title: "Design review notes",
    ownerId: "u_bob",
    sharedWithIds: ["u_alice"],
    updatedAt: minutesAgo(60 * 5),
    content: { type: "doc", content: [h(2, "Design review notes"), p("Feedback from Tuesday's review of the editor toolbar.")] },
  },
];
