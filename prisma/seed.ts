import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Demo data: three users and a few documents covering every access case
 * (owned + shared, owned + private, shared with me). Idempotent: users are
 * upserted by email and documents are only created if missing.
 */
const prisma = new PrismaClient();

const users = {
  alice: { name: "Alice Johnson", email: "alice@demo.com", avatarColor: "#6366f1" },
  bob: { name: "Bob Smith", email: "bob@demo.com", avatarColor: "#10b981" },
  carol: { name: "Carol Lee", email: "carol@demo.com", avatarColor: "#f59e0b" },
};
type DemoUser = keyof typeof users;

const text = (value: string, marks?: string[]) => ({
  type: "text",
  text: value,
  ...(marks && { marks: marks.map((type) => ({ type })) }),
});
const p = (...parts: (string | ReturnType<typeof text>)[]) => ({
  type: "paragraph",
  content: parts.map((part) => (typeof part === "string" ? text(part) : part)),
});
const h = (level: number, value: string) => ({ type: "heading", attrs: { level }, content: [text(value)] });
const bullets = (...items: string[]) => ({
  type: "bulletList",
  content: items.map((item) => ({ type: "listItem", content: [p(item)] })),
});
const doc = (...content: object[]) => ({ type: "doc", content }) as Prisma.InputJsonValue;

const documents: { title: string; owner: DemoUser; sharedWith: DemoUser[]; content: Prisma.InputJsonValue }[] = [
  {
    title: "Welcome to Ajaia Docs",
    owner: "alice",
    sharedWith: ["bob"],
    content: doc(
      h(1, "Welcome to Ajaia Docs"),
      p("This document is owned by Alice and ", text("shared with Bob", ["bold"]), ". Try editing it as either user."),
      bullets("Bold, italic and underline", "Headings and lists", "Autosave as you type"),
    ),
  },
  {
    title: "Q4 product roadmap",
    owner: "alice",
    sharedWith: ["bob", "carol"],
    content: doc(
      h(1, "Q4 product roadmap"),
      p("Themes for the quarter: collaboration, search and reliability."),
      bullets("Shared editing", "Faster search", "99.9% uptime"),
    ),
  },
  {
    title: "Team onboarding guide",
    owner: "alice",
    sharedWith: [],
    content: doc(h(1, "Team onboarding guide"), p("Everything a new teammate needs in their first week.")),
  },
  {
    title: "Design review notes",
    owner: "bob",
    sharedWith: ["alice"],
    content: doc(h(2, "Design review notes"), p("Feedback from Tuesday's review of the editor toolbar.")),
  },
];

async function main() {
  const ids = {} as Record<DemoUser, string>;
  for (const [key, data] of Object.entries(users) as [DemoUser, (typeof users)[DemoUser]][]) {
    const user = await prisma.user.upsert({ where: { email: data.email }, update: data, create: data });
    ids[key] = user.id;
  }

  let created = 0;
  for (const d of documents) {
    const exists = await prisma.document.findFirst({ where: { ownerId: ids[d.owner], title: d.title } });
    if (exists) continue;
    await prisma.document.create({
      data: {
        title: d.title,
        content: d.content,
        ownerId: ids[d.owner],
        shares: { create: d.sharedWith.map((u) => ({ userId: ids[u] })) },
      },
    });
    created++;
  }
  console.log(`Seeded ${Object.keys(ids).length} users and ${created} new documents.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
