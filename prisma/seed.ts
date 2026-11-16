import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  { name: "Alice Johnson", email: "alice@demo.com", avatarColor: "#6366f1" },
  { name: "Bob Smith", email: "bob@demo.com", avatarColor: "#10b981" },
  { name: "Carol Lee", email: "carol@demo.com", avatarColor: "#f59e0b" },
];

const welcomeContent = {
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Welcome to Ajaia Docs" }] },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "This document is owned by Alice and " },
        { type: "text", marks: [{ type: "bold" }], text: "shared with Bob" },
        { type: "text", text: ". Try editing it as either user." },
      ],
    },
    {
      type: "bulletList",
      content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "italic" }], text: "Italic" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "underline" }], text: "Underline" }] }] },
      ],
    },
  ],
};

async function main() {
  const created = [];
  for (const u of users) {
    created.push(await prisma.user.upsert({ where: { email: u.email }, update: u, create: u }));
  }
  const [alice, bob] = created;

  const existing = await prisma.document.findFirst({
    where: { ownerId: alice.id, title: "Welcome to Ajaia Docs" },
  });
  if (!existing) {
    await prisma.document.create({
      data: {
        title: "Welcome to Ajaia Docs",
        content: welcomeContent,
        ownerId: alice.id,
        shares: { create: { userId: bob.id } },
      },
    });
  }
  console.log(`Seeded ${created.length} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
