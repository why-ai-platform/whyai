# Changelog

> Running record of every change made to this repo, kept up to date as changes happen — see the
> "Change tracking" section in [`.claude/skills/whyai-roadmap/SKILL.md`](.claude/skills/whyai-roadmap/SKILL.md)
> for the rule. One entry per change, terse, added in the same PR as the change itself.

## [Unreleased]

- **2026-10-09** — Planning/setup only, no app code changed yet:
  - Added `docs/ROADMAP.md`: the full phased development plan (Phases 0–9) covering the 3 product
    pillars (AI/agents courses, ebook store, AI agent marketplace) plus the 3 cross-cutting
    requirements (flexibility & scalability, security, full analytics/tracking).
  - Added `.claude/skills/whyai-roadmap/SKILL.md`: the project skill that picks up the next
    unchecked roadmap item, implements it on its own branch, verifies it locally, logs it here, and
    opens a PR into `dev` — one item at a time.
  - Added this `CHANGELOG.md`.
  - Saved two persistent memory files (outside the repo, in the user's Claude memory store — see the
    "Where things are saved" note below) capturing the project vision and the verify-locally /
    merge-one-by-one / log-every-change workflow.
  - Reviewed the full existing codebase (frontend-only Vite+React+TS app; no backend, no DB, no
    payments, mock auth) to ground the roadmap in what actually exists today.
  - Added goals 4–6 (flexibility/scalability, security, full analytics/tracking) to `docs/ROADMAP.md`
    as cross-cutting requirements woven into Phases 0–9 (renumbered from the original 0–7), plus a
    risk table (§6) and design-principles section (§5).
  - Added the mandatory change-tracking rule itself (this file's own existence + the "Change
    tracking" section in the skill) per explicit owner request.
  - Added **Book 1** (`docs/book-1-codebase-explained/`, 21 chapters, `00`–`20`): a from-zero
    explanation of every file in `src/`, function by function, including a consolidated "known
    issues & dead code" chapter (orphaned pages, the broken `./Playground` import in
    `CoursesLayout.tsx`, the missing `tsconfig.json`, duplicated news data, the unused
    `styles/globals.css`).
  - Added **Book 2** (`docs/book-2-tech-stack-and-scale/`, 12 chapters, `00`–`11`): where a database
    would go (Supabase/Postgres recommendation with table sketches), backend options, auth/security
    mechanisms explained from zero, caching/CDN, scaling to millions (staged, trigger-based — not
    "build it all now"), and a target architecture diagram mapped to `docs/ROADMAP.md`'s phases.
  - Added `docs/diagrams/whyai-blueprint.html`: a hand-drawn, engineering-blueprint-styled SVG
    diagram set (3 sheets — system architecture, data-model class diagram, component/context class
    diagram) of the codebase's *current* state, also published as a Claude Artifact for easy
    viewing.
  - Added `CLAUDE.md` at the repo root: the fast-orientation file Claude Code reads automatically
    at the start of every session in this folder, so a new session (or a new chat) doesn't need to
    re-explore the codebase or be re-told the plan/workflow/known gotchas. Added `docs/README.md`
    pointing back to it.

- **2026-10-09** — `feat/course-content-agentic-ai` (real app code, shipped to `main`):
  - Wrote 11 real lessons + 1 locked "coming soon" lesson into `courseContentData['7']`
    (`src/pages/courses/viewer/courseContent.ts`), covering agent architecture, planning/reasoning,
    tool use, memory, multi-agent systems, frameworks, safety, monetization, and a working capstone
    (a real tool-calling storefront-assistant agent, traced step by step). Unlocked the "Agentic AI"
    course card in `src/pages/courses/index.tsx` (was `locked: true`; the lock is now reserved for
    the one in-course lesson about the not-yet-built selling/marketplace feature, not the teaching
    content itself — course content and the commerce feature are different things, and only the
    latter is unbuilt).
  - Added `src/pages/courses/viewer/courseDiagrams.css`: hand-drawn HTML/CSS diagrams (loop boxes,
    brain/body split, comparison columns, tile grids, callouts) replacing stock Unsplash photos in
    every lesson.
  - **Rebuilt `CourseViewer.tsx`** from the original single-lesson-with-a-broken-sidebar layout into
    a persistent-left-sidebar, one-chapter-at-a-time page (W3Schools-style), after discovering — and
    fixing — a real pre-existing bug: this app's CSS (`src/index.css`) is a **static, pre-built
    file**, not live-compiled, so most Tailwind responsive variants (`sm:`, `md:`, `lg:` — confirmed
    zero actual breakpoint media queries in the whole file) and many arbitrary-value/bracket classes
    silently do nothing. This affected course `1`'s viewer too, not just the new course — its
    sidebar was invisible at every screen width before this fix. Added
    `src/pages/courses/viewer/courseViewer.css` with hand-written rules (sidebar active/hover state,
    full lesson typography hierarchy) to replace the unreliable Tailwind utility/`prose-*` classes
    for good, and switched `useIsMobile()` (already present, previously unused —
    `components/ui/use-mobile.ts`) to decide mobile-vs-desktop in JS instead of a CSS breakpoint.
  - Added `docs/book-3-agentic-ai-and-agents/` (13 chapters): the Agentic AI concept curriculum that
    was transcribed into the lessons above, plus Ch.13 preserving the owner's full "W3Schools-parity
    v2" specification (nested chapter/lesson tree, search, quizzes, exercises, real Python
    execution, a 21-topic curriculum) as a phased, not-yet-built roadmap — deliberately not attempted
    in one pass; real code execution specifically needs the same backend sandbox infrastructure
    already flagged for the Practice platform in `docs/ROADMAP.md` Phase 9, not a stub.
  - Verified locally throughout: `npm run build` after every change, plus actual browser screenshots
    (desktop, mobile, light, dark) via Playwright before calling any layout change done — caught the
    invisible-sidebar and invisible-heading bugs this way rather than assuming Tailwind classes work.

<!--
Template for future entries:

## [Unreleased]
- **YYYY-MM-DD** — `branch-name` (roadmap item): one-line description of what changed and why.
  Files/areas touched: ...

When dev → main for a release, retitle the accumulated block above to `## [YYYY-MM-DD]` and start a
fresh `## [Unreleased]` section.
-->
