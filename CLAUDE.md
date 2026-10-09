# WhyAI — Project Orientation for Claude

Read this file first, every session — it's short on purpose. Deep detail lives in the docs linked
below; don't re-explore the codebase from scratch or re-derive the plan, read the relevant doc.

## What this is

WhyAI is a learning + commerce platform with three product pillars, in priority order:
1. **AI & Agents courses**
2. **Sell eBooks**
3. **Sell AI Agents**

Plus three cross-cutting requirements woven into every phase rather than bolted on at the end:
4. Flexible/scalable/market-adaptable architecture
5. Security (payments, user data, downloadable content)
6. Full user tracking & analytics across pages/interactions

**Current state**: frontend-only (Vite + React 18 + TypeScript + Tailwind + shadcn/ui + React
Router). **No backend, no database, no payments yet.** Auth is mock/in-memory. This is expected,
current, and already accounted for in the plan below — don't treat it as something broken to fix
incidentally.

## Where everything lives — read the doc, don't re-derive it

| Need | Read this |
|---|---|
| The development plan / what to build next | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| What changed, and when | [`CHANGELOG.md`](CHANGELOG.md) |
| How any file/function in `src/` works, from zero | [`docs/book-1-codebase-explained/`](docs/book-1-codebase-explained/00-start-here.md) (21 chapters) |
| Where a database goes, backend options, security, scaling to millions | [`docs/book-2-tech-stack-and-scale/`](docs/book-2-tech-stack-and-scale/00-start-here.md) (12 chapters) |
| Agentic AI concepts + a working first-agent capstone (pillar 3 content) | [`docs/book-3-agentic-ai-and-agents/`](docs/book-3-agentic-ai-and-agents/00-start-here.md) (13 chapters — **locked/future feature**, not yet transcribed into the live course) |
| Visual system/class diagrams of the current codebase | [`docs/diagrams/whyai-blueprint.html`](docs/diagrams/whyai-blueprint.html) (open in a browser) |
| Docs index | [`docs/README.md`](docs/README.md) |
| The operational workflow for "do the next thing" requests | [`.claude/skills/whyai-roadmap/SKILL.md`](.claude/skills/whyai-roadmap/SKILL.md) — **invoke this skill** for any "continue the plan," "work on the ebook store," "next roadmap item" type request instead of re-deriving the process |

## The non-negotiable workflow (also encoded in the skill above)

1. One roadmap checklist item = one feature branch off `dev` = one PR. Never batch unrelated
   changes.
2. **Verify locally before claiming something works** — run it (`npm run dev`), actually look at
   UI changes (use the `run` skill to launch/screenshot). Never assert a change works unseen.
3. **Log every change in `CHANGELOG.md`** — not just roadmap items, every change to the repo. This
   was an explicit owner request; don't skip it.
4. Check off the roadmap item in `docs/ROADMAP.md` in the same change.
5. PR into `dev`, not `main`. Don't merge it yourself.
6. Never commit secrets — `.env.local` only, gitignored, `.env.example` for placeholders.

## Known gotchas — don't rediscover these the hard way

- **`src/index.css` is a static, pre-built CSS file, not live-compiled.** Confirmed by direct
  inspection: there are **zero** real `sm:`/`md:`/`lg:` responsive breakpoint media queries anywhere
  in it, and bracket/arbitrary-value classes (`top-[72px]`, `max-w-[720px]`, etc.) and many solid
  `bg-*-600` fills don't exist either — only the exact utility classes some component already used
  verbatim made it into this file. Using an unverified Tailwind class doesn't error, it just
  **silently renders as if the class weren't there** (e.g. `bg-blue-600 text-white` on an "active"
  state rendered invisible white-on-transparent text — found this exact bug in the course sidebar).
  Before relying on any Tailwind class you haven't seen elsewhere in this codebase, grep
  `src/index.css` for it first (e.g. `grep -c "bg-blue-600" src/index.css`); if it's not there,
  either find an already-used equivalent or use inline `style={{}}` / a small hand-written CSS file
  (see `src/pages/courses/viewer/courseViewer.css` and `courseDiagrams.css` for the pattern) —
  never guess. This also means `useIsMobile()`/`useIsMobile`-style JS checks are more reliable than
  CSS breakpoints for anything that must actually show/hide correctly.
- No `tsconfig.json` exists — `npm run build` does **not** type-check, only transpiles. A broken
  import only fails the build if something actually imports that file.
- `src/pages/courses/CoursesLayout.tsx` is unused *and* imports a non-existent `./Playground` file
  — wiring it up without first fixing/removing that import will break the build.
- `src/styles/globals.css` is never imported anywhere — the real compiled styles are in
  `src/index.css`. Don't edit `globals.css` expecting an effect.
- Course lesson content (`CourseViewer`) and news articles (`NewsDetail`) both render raw HTML via
  `dangerouslySetInnerHTML` — safe only because the owner writes every string today. Sanitize
  (DOMPurify) before any other content source is possible — already a roadmap Phase 1 item.
- `landing/NewsSection.tsx` duplicates (doesn't import) `pages/news/newsData.ts` — editing one
  doesn't update the other.

Full list with file/line references: [Book 1, Ch.19](docs/book-1-codebase-explained/19-known-issues-and-dead-code.md).

## Open decision, not blocking

Stripe vs Razorpay for payments — defaults to either until the owner picks one; only matters
starting roadmap Phase 2/3.
