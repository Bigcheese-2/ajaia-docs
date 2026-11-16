# Submission: Ajaia Docs

**Live app:** https://ajaia-docs-amber-one.vercel.app  
**Source:** https://github.com/Bigcheese-2/ajaia-docs (also in this Drive folder)  
**Walkthrough video:** see `VIDEO_URL.txt`

## Test accounts

There are no passwords: click an account on the sign-in page.

| User | Email | Use it to… |
|---|---|---|
| Alice Johnson | `alice@demo.com` | Own documents and share them |
| Bob Smith | `bob@demo.com` | See what a shared editor sees |
| Carol Lee | `carol@demo.com` | A third user to share with |

**Quick sharing test:**
1. As **Alice**, open **Team onboarding guide**, click **Share**, and add `bob@demo.com`.
2. From the avatar menu, choose **Switch user**, then **Bob**. The doc is under **Shared with me**, and Bob can edit it but not share or delete it.

## What's included

| Item | File |
|---|---|
| Source code | the whole repository (`src/`, `prisma/`, `tests/`, config) |
| Setup and run instructions | `README.md` |
| Architecture note | `ARCHITECTURE.md` |
| AI workflow note | `AI_WORKFLOW.md` |
| This summary | `SUBMISSION.md` |
| Walkthrough video link | `VIDEO_URL.txt` |
| Screenshots | `screenshots/` (dashboard, editor, share dialog) |

## What's working (end to end, on the live URL)

- **Documents:** create, rename, edit with autosave and status, reopen; owner-only delete with confirmation.
- **Rich text:** bold, italic, underline, strikethrough, headings H1–H3, bulleted and numbered lists, quotes, undo and redo, keyboard shortcuts.
- **File import:** `.txt`, `.md` and `.docx` (≤ 2 MB) into a new editable document, with formatting kept and unsafe content stripped. Supported types are stated in the UI and the README.
- **Sharing:**
  - the owner grants and revokes access by email;
  - the dashboard separates **My documents** from **Shared with me**;
  - shared users can edit, but only the owner can share or delete;
  - other users get a 404.
- **Persistence:** Postgres (Neon). Formatting is stored as structured editor JSON and survives reloads exactly.
- **Validation and errors:** zod on every server action, plus friendly messages for bad emails, unknown users, duplicate shares, wrong file types and oversized files. Failed saves offer Retry. Loading skeletons, an error page and 404 pages are included.
- **Quality:**
  - 35 unit tests: permissions, session signing, import sanitizing and conversion;
  - CI on every push;
  - feature-branch Git history with Conventional Commits.

## What's incomplete or deliberately out of scope

- **Real-time co-editing:** two people editing at once is last-write-wins. Autosave keeps the window short, but there's no live sync.
- **One sharing role:** shared users are editors; there's no read-only viewer role yet.
- **Demo authentication:** one-click seeded accounts with a signed, httpOnly session cookie, not a real identity provider.
- **Import fidelity:** images and tables in files are dropped, and Word styles beyond headings and basic formatting are simplified.
- **Optional stretch features** (comments, version history, export): skipped on purpose to put the time into correctness and polish on the core.

## What I'd build next with 2–4 more hours

1. **Viewer vs. editor roles** (about 45 minutes): a role on `DocumentShare`, a dropdown in the share dialog, and a read-only editor for viewers. The permission module was designed for this, so it's a small, test-covered change.
2. **Conflict safety** (about 45 minutes): reject stale saves with a version check and show "This doc changed, reload", replacing silent last-write-wins.
3. **Version history** (about 1.5 hours): snapshot content on save (throttled), plus a side panel to preview and restore.
4. **Export to Markdown/PDF** (about 30 minutes): reuse the import pipeline in reverse.

Real-time collaboration (Yjs + Tiptap Collaboration) would come after these, as its own project.
