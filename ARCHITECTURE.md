# Architecture note

## What I prioritized, and why

The brief rewards a coherent, working slice over breadth, so I set three priorities.

1. **Correct access logic.** Sharing is where a docs product earns or loses trust, so every rule is enforced on the server, lives in one place, and is unit-tested.
2. **An editing loop that feels finished.** That means autosave with visible status, retry on failure, a warning before leaving with unsaved changes, loading skeletons and error recovery. Without these, every feature feels broken.
3. **Safe file import.** Uploaded files are untrusted input, so conversion goes through one sanitizer and the editor's own schema.

Everything else was cut deliberately (see [Tradeoffs](#tradeoffs-and-scope-cuts)).

## System overview

```
Browser (React 19, Tiptap editor)
   │  server actions: typed, POST, same origin
   ▼
Next.js 15 on Vercel
   ├─ middleware ─────────── no session cookie → /login
   ├─ features/*/actions.ts  API boundary: session check + zod validation
   ├─ features/*/data.ts     data access: the only code that touches Prisma
   └─ features/documents/permissions.ts   pure rules: who can view/edit/share/delete
   ▼
Postgres (Neon) via Prisma
```

**No `/api` routes.** Mutations are Next.js server actions: the client imports a function and calls it, and it runs on the server as a POST request. This gives end-to-end type safety without fetch wrappers or duplicated request types. Every action still re-checks the session and permissions, exactly as a route handler would. I'd add REST routes only if a client outside this app needed them (mobile, webhooks).

## Code organization: feature-based

```
src/
  app/                  thin routes: load data, render feature components
  design-system/
    primitives/         shadcn/ui components (button, dialog, …)
    patterns/           app-wide building blocks (avatar stack, empty state, …)
    layouts/            app shell and its skeleton
  features/
    auth/               demo sign-in, signed session cookie
    documents/          dashboard, CRUD, permissions
    editor/             Tiptap editor, toolbar, autosave hook
    sharing/            share dialog, grant/revoke
    import/             upload dialog, file → document conversion
  lib/                  Prisma client, utils
tests/                  unit tests + a real .docx fixture
```

Each feature owns its UI, server actions, data access and types, so a change to sharing touches `features/sharing` and nothing else. Hooks live in the feature that uses them (`editor/hooks/use-autosave.ts`) rather than in a global folder.

**UI first, then integration.** I built every screen against in-memory fixtures behind the same function signatures as the real data layer. Later, Prisma replaced the fixtures with no component changes. That let me validate the product before committing to a schema.

## Data model

```
User (id, name, email unique, avatarColor)
Document (id, title, content JSON, ownerId → User, updatedAt)   index (ownerId, updatedAt)
DocumentShare (documentId → Document, userId → User)            unique (documentId, userId)
```

- **Content is stored as Tiptap JSON**, not HTML. It's structured, so formatting survives exactly, and it's validated (`type: "doc"`, under 1 MB) before saving.
- **Ownership is a column; access is a join table.** "Owned vs. shared" is then just `ownerId = me` vs. `shares.some(userId = me)`.
- **Duplicate shares are prevented by the unique constraint**, not by a read-then-write check, so concurrent requests can't double-share.
- Deleting a document cascades to its shares.

## Access control

`permissions.ts` is pure (no database) and is the single source of truth:

| | view | edit | share | delete |
|---|---|---|---|---|
| owner | ✓ | ✓ | ✓ | ✓ |
| editor (shared with) | ✓ | ✓ | ✗ | ✗ |
| anyone else | ✗ | ✗ | ✗ | ✗ |

- Reads are scoped by query, so a user can never load a document they can't see.
- A missing document and a forbidden one both return **404**. Ids can't be probed.
- Writes call `can(access, action)` before touching the database.
- The UI hides controls a user can't use, but that's courtesy only; the server is the enforcement.

## Authentication: a deliberate shortcut

The brief allows simulated users, so sign-in is **one click on a seeded account**. Reviewers can test sharing between users in seconds, with no sign-up and no passwords to manage. It isn't fake security:

- The session is an **HMAC-SHA256-signed, httpOnly, SameSite=Lax cookie** (Secure in production).
- Signatures are compared in constant time.
- Editing the cookie to impersonate someone fails; this is tested.
- In production a 32+ character secret is mandatory: the app errors rather than fall back to a default.

**To make it real:** swap the sign-in screen for an identity provider (Auth.js, Clerk). The rest of the app only calls `requireUser()` and doesn't change.

## File import pipeline

```
.txt  → escape HTML, blank lines → paragraphs ┐
.md   → marked (GFM)                          ├→ sanitize-html (tag allowlist, no attributes)
.docx → mammoth                               ┘        → Tiptap generateJSON (editor schema) → new document
```

- **One path for every format:** everything converges on HTML, so there's one sanitizer and one parser to trust.
- **Two layers of defence:** the allowlist strips scripts, event handlers and `javascript:` links, and parsing against the editor schema then drops anything the editor can't render.
- **Validated twice:** type (`.txt/.md/.docx`) and size (≤ 2 MB) are checked in the browser for fast feedback, and again on the server, because the client isn't trusted.
- **Loaded on demand:** the parsers load only when an import runs, so pages that merely show the Import button stay light.

**A production lesson.** The first version sanitized with DOMPurify, which needs `jsdom`, a full DOM emulator of about 650 files. It worked locally but crashed Vercel's serverless function for every page that rendered the Import button. I found it by tracing the dashboard's server bundle, then switched to the pure-JS `sanitize-html`. The existing XSS tests passed unchanged, which is exactly what they're for.

## Testing and quality

- **Unit tests (35):**
  - the full permission matrix;
  - session signing (round trip, impersonation, wrong secret, malformed tokens);
  - import validation, sanitizing (XSS payloads), and `.txt` / `.md` / `.docx` conversion against a real `.docx` fixture.
- **CI:** GitHub Actions runs lint, type-check and tests on every push.
- **Manual end-to-end:**
  - every flow tested in the browser as each demo user;
  - production build smoke-tested locally;
  - the live deployment re-verified after each fix.
- **Git:** one short-lived branch per feature, Conventional Commits, `--no-ff` merges, so the history reads feature by feature.

## Tradeoffs and scope cuts

| Cut | Why | What it would take |
|---|---|---|
| Real-time co-editing | Needs CRDTs (Yjs) and a WebSocket server: a project of its own | Tiptap Collaboration + Hocuspocus/Liveblocks |
| Concurrent edits are last-write-wins | Acceptable for a demo without real-time sync; autosave keeps the window small | Comes with the item above, or version checks on save |
| Viewer (read-only) role | One role demonstrates the model; more roles are a small extension of `can()` | A role column on `DocumentShare` + read-only editor |
| Real authentication | Demo accounts make sharing reviewable in seconds | Identity provider behind `requireUser()` |
| Version history, comments, export | Optional stretch; I chose depth and polish on the core instead | See SUBMISSION.md |
| Images and tables in import | Out of scope for the editor schema | Add Tiptap Image/Table + file storage |
