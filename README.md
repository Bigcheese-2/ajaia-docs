# Ajaia Docs

A lightweight collaborative document editor: create and format documents, import files, and share them with teammates.

**Live:** https://ajaia-docs-amber-one.vercel.app  
**Docs:** [Architecture](ARCHITECTURE.md) · [AI workflow](AI_WORKFLOW.md) · [Submission](SUBMISSION.md)

## Try it in 2 minutes

There are no passwords. Pick a seeded demo account on the sign-in page.

| User | Email | Starts with |
|---|---|---|
| Alice Johnson | `alice@demo.com` | 3 owned docs (2 shared, 1 private) and 1 shared by Bob |
| Bob Smith | `bob@demo.com` | 1 owned doc and 2 shared by Alice |
| Carol Lee | `carol@demo.com` | 1 doc shared by Alice |

**Sharing flow:**
1. Sign in as **Alice** and open **Team onboarding guide**, which is private.
2. Click **Share**, then add `bob@demo.com`.
3. From the avatar menu, choose **Switch user**, then **Bob**. The doc now appears under **Shared with me**, and Bob can edit it.

Bob can't share or delete it; only the owner can.

## Features

- **Documents:** create, rename (the title is editable in the header), edit, autosave and reopen. Deleting asks for confirmation and is owner-only.
- **Rich text:** bold, italic, underline, strikethrough, H1–H3, bulleted and numbered lists, quotes, undo and redo. Keyboard shortcuts work (⌘B, ⌘I, ⌘U…).
- **Autosave:** saves 800 ms after you stop typing. A status shows *Saving / Saved / Unsaved / Couldn't save (Retry)*, and the browser warns before you leave with unsaved changes.
- **File import:** `.txt`, `.md` or `.docx` up to **2 MB** becomes a new editable document. Formatting such as headings, bold, italic and lists carries over. Images, tables and embedded HTML are dropped.
- **Sharing:** the owner grants or removes access by email. The dashboard separates **My documents** from **Shared with me**, and each doc shows owner and editor badges.
- **Interface:** a calm, token-based design system (light, dark or system theme), a searchable document list, a mobile navigation drawer, branded full-page loaders, skeletons, subtle motion that respects *reduce motion*, a friendly error page with *Try again*, and 404 pages.

## Run locally

**Requirements:** Node 22+ and a Postgres database. A free [Neon](https://neon.tech) database works; so does any local Postgres.

```bash
git clone https://github.com/Bigcheese-2/ajaia-docs.git
cd ajaia-docs
npm install
cp .env.example .env    # then fill in the three values (see below)
npm run db:deploy       # create the tables
npm run db:seed         # add the demo users and documents
npm run dev             # http://localhost:3000
```

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection string, used at runtime |
| `DATABASE_URL_UNPOOLED` | Direct connection string, used by migrations. With plain local Postgres, use the same value as above |
| `SESSION_SECRET` | 32+ random characters for signing session cookies: `openssl rand -base64 32` |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run build` · `npm start` | Production build and server |
| `npm run db:deploy` · `npm run db:seed` | Apply migrations · seed demo data (idempotent) |

CI (GitHub Actions) runs lint, type-check and tests on every push.

## Deploy (Vercel)

1. Import the repository in Vercel and attach a Neon database (Storage → Connect). This sets both `DATABASE_URL` variables.
2. Add `SESSION_SECRET` for Production.
3. Deploy. The `vercel-build` script runs `prisma migrate deploy` before `next build`, so the schema is always current.
4. Seed the database once: run `npm run db:seed` locally against the same `DATABASE_URL`.

Everything used is free: Vercel Hobby, Neon Free, and open-source libraries. Reviewers only need the live URL.

## Stack

Next.js 15 (App Router, server actions) · React 19 · TypeScript · Tailwind CSS v4 + shadcn/ui · Tiptap 3 · Prisma 6 + Postgres (Neon) · zod · Vitest · Vercel
