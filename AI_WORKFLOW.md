# AI workflow note

## Tools

- **Claude Code (Claude Opus), in the Claude desktop app:** my main pair-programmer. It wrote most of the code, ran commands, and drove the built-in browser to click through flows as each demo user.
- **Vercel and Neon dashboards:** I configured these by hand. Secrets were never pasted into the AI session; I put them into `.env` and Vercel myself.

## How I worked with it

I treated the AI as a fast implementer that I direct and review, not as an author.

- **Plan before code.** Early on, the agent started building integration code without a shared plan. I stopped it and had it produce a step-by-step plan mapped to the brief's success criteria, with one branch per feature, before any more code was written.
- **UI first, then integration.** I required every screen to be built against in-memory fixtures behind a stable data API, and reviewed in the browser, before any database work. When Prisma replaced the fixtures, no component changed.
- **Feature-based structure.** I asked for a design system (primitives, patterns, layouts) and self-contained feature folders rather than the default flat layout.
- **Explicit decisions stayed mine.** The agent proposed options; I chose demo sign-in with a signed cookie over a password flow, Postgres over SQLite, and skipped the stretch features in favour of polish. ARCHITECTURE.md explains why.

## Where AI materially sped things up

- **Scaffolding:** the design system, dashboard, editor toolbar and dialogs took minutes instead of hours.
- **Integration plumbing:** the Prisma schema, migrations, seed script and the data layer behind the existing signatures.
- **Tests:** the permission matrix, session tamper cases, XSS payloads, and generating a minimal valid `.docx` fixture by hand-assembling its XML.
- **Debugging production:** it narrowed the Vercel 500 down to a bundled dependency (below) by reading the build's file trace, which would have taken me much longer.

## What I changed or rejected

| AI output | Problem | What happened |
|---|---|---|
| Started integrating without a plan | Building blind, with no link to the success criteria | Rejected. Replaced with a reviewed, criteria-mapped plan and feature branches |
| Mock data store kept the server action's argument object | Crashed the next render ("opaque temporary reference") | Store a plain copy, and validate input with zod |
| Passed icon *components* from a server to a client component | "Only plain objects can be passed to Client Components" | Pass rendered elements instead |
| Removed the `cn` package as "unused" | It was used by the generated UI primitives, so the build broke | Reinstalled it, and checked imports before removing anything after that |
| Installed Prisma 7 (latest) | Breaking config changes, mid-timebox | Pinned to Prisma 6 |
| Let `/login` be prerendered at build time | The account list would have been frozen at build time | Forced per-request rendering |
| Sanitized imports with DOMPurify + jsdom | Worked locally; **crashed the dashboard on Vercel** (jsdom in the serverless bundle) | Switched to pure-JS `sanitize-html`, and loaded the import pipeline on demand |
| A commit that mixed two changes | Muddied history | Split before merging |

The pattern I took from this: AI output that *runs* isn't the same as output that's *right*. The production-only crash is the clearest example. It passed every local check.

## How I verified correctness, UX and reliability

- **Automated:** 35 Vitest unit tests on the riskiest logic (permissions, session signing, import sanitizing and conversion), plus CI on every push running lint, type-check and tests.
- **In the browser, as real users:**
  - signed in as Alice, Bob and Carol in turn;
  - checked owned vs. shared lists;
  - confirmed a non-owner can edit but can't share or delete;
  - confirmed a private doc returns 404 for others;
  - checked bad emails, duplicate shares and unknown users;
  - checked import of each file type, autosave across a reload, delete, and the error, 404 and loading states.
- **Against the database:** queried Postgres directly to confirm writes, such as shares added and removed and content saved, rather than trusting the UI.
- **Production:**
  - built and ran the production server locally;
  - on the live URL, checked status codes and redirects with `curl`, and tested sign-in and import;
  - re-checked after every deploy fix.
- **Hygiene:** removed my test data from the shared database so reviewers see only the seeded demo content.
