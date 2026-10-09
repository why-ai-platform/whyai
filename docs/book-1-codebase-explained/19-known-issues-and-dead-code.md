# Chapter 19: Known Issues & Dead Code — Found While Writing This Book

An honest, consolidated list of everything discovered while documenting the codebase chapter by
chapter, gathered here in one place so it's easy to triage. None of these stop the app from running
today — they range from "harmless leftover" to "worth fixing before building more on top of it."
Each links back to where it was first found and, where relevant, to the roadmap item that addresses
it.

## 19.1 Orphaned pages (exist, but no route reaches them)

| File | Chapter | Why it matters |
|---|---|---|
| `pages/courses/CourseDetail.tsx` | [Ch.11](11-courses.md) §11.3 | Empty placeholder |
| `pages/courses/LearningPath.tsx` | [Ch.11](11-courses.md) §11.3 | Empty placeholder; "AI Learning Mindmap" is advertised in marketing copy ([Ch.10](10-landing-page.md) §10.4) but doesn't exist |
| `pages/courses/CoursesLayout.tsx` | [Ch.11](11-courses.md) §11.3 | See §19.2 below — this one is a real latent bug, not just unused |
| `pages/practice/ProblemSolve.tsx` | [Ch.12](12-practice.md) | Empty placeholder |
| `pages/contests/index.tsx` | [Ch.15](15-contests-stub.md) | Empty placeholder, no route |
| `pages/contests/ContestDetail.tsx` | [Ch.15](15-contests-stub.md) | Empty placeholder, no route |

**Decision needed, not urgent**: finish each of these, or delete them along with the marketing copy
that references them. [docs/ROADMAP.md](../ROADMAP.md) Phase 9 treats contests explicitly as an
open decision.

## 19.2 A genuinely broken import, currently invisible

`pages/courses/CoursesLayout.tsx` contains `import { PlaygroundPage } from './Playground';` — **no
file named `Playground.tsx` exists anywhere in this repository.** Today this causes no visible
problem only because nothing imports `CoursesLayout` itself, so Vite's bundler never has to resolve
that broken import. The moment anyone — human or AI assistant — tries to wire `CoursesLayout` into
`App.tsx` (a very natural thing to attempt, since it's the most structurally complete of the
orphaned files), the build will fail immediately with a "cannot resolve module './Playground'"
error. Flagging this explicitly so no one loses time being confused by it later: either delete
`CoursesLayout.tsx` as superseded by the current `CoursesPage` tabs ([Ch.11](11-courses.md) §11.1,
which already covers the same "Courses / Playground / Dashboard" idea without a separate layout
file), or write the missing `Playground.tsx` before ever wiring this file in.

## 19.3 No `tsconfig.json` — type errors aren't caught by the build

Covered in full in [Ch.3](03-tooling-and-config.md) §3.5. `npm run build` strips types but never
checks them. Fixing this is a natural fit for [docs/ROADMAP.md](../ROADMAP.md) Phase 0
(`chore/ci`).

## 19.4 `dangerouslySetInnerHTML` used for lesson and news content

Two places inject raw HTML strings directly: `CourseViewer.tsx` ([Ch.11](11-courses.md) §11.2) and
`NewsDetail.tsx` ([Ch.14](14-news.md) §14.3). Safe today only because every string reaching this
prop is hand-written by the project owner. [docs/ROADMAP.md](../ROADMAP.md) §6 risk #1 schedules a
DOMPurify sanitization pass before any other content source (an admin UI, a third-party agent
listing) becomes possible.

## 19.5 Duplicated data that can silently drift apart

`landing/NewsSection.tsx`'s own hardcoded preview array duplicates (rather than imports/slices) the
full `newsData.ts` array ([Ch.14](14-news.md) §14.1). Editing an article in one place does not
update the other. No other duplication of this kind was found elsewhere in the codebase.

## 19.6 Forms with no save logic

Every form field on `ProfilePage`'s three tabs, and the "Edit Profile" button, have no `onClick`/
`onSubmit` handler at all ([Ch.13](13-dashboard-and-profile.md) §13.3) — not broken, just
unfinished. Contrast with `LoginDialog`, which *does* fully wire up its form handlers
([Ch.10](10-landing-page.md) §10.2).

## 19.7 Inconsistent use of the shared UI primitives

- `ProfilePage` uses plain `<input type="radio">`/`<input type="checkbox">`/`<textarea>` instead of
  the styled `components/ui/radio-group.tsx`, `checkbox.tsx`, `textarea.tsx` wrappers that exist in
  the project specifically for this ([Ch.9](09-ui-library.md) §9.5, [Ch.13](13-dashboard-and-profile.md)
  §13.3).
- Several pages (`CoursesPage`, `PracticePage`) define their own local `interface Course {...}` /
  `interface Problem {...}` rather than importing the shared ones from `types/index.ts`
  ([Ch.5](05-app-shell-and-routing.md) §5.3), and the shapes have drifted slightly apart from each
  other.
- `ROUTES`, `DIFFICULTY_LEVELS`, `COURSE_LEVELS`, and `AI_CATEGORIES` from `constants/index.ts` are
  defined but several are not actually imported by the pages that could use them — difficulty/level
  badge colors are instead recomputed locally with a near-identical `switch` statement in multiple
  files (`CoursesPage`, `PracticePage`).

None of these block anything from working; they're exactly the kind of small inconsistency worth
tidying up opportunistically (e.g. while touching a file for an unrelated roadmap item) rather than
as a dedicated cleanup project.

## 19.8 `utils/api.ts` is fully unused

Every function in it returns a hardcoded `[]`/`null` stub, and no file in the project imports `api`
at all ([Ch.5](05-app-shell-and-routing.md) §5.4) — every page instead keeps its own local mock
data directly. This file is a sketch of the intended future call shape, not currently load-bearing.

## 19.9 `styles/globals.css` is never imported

Covered fully in [Ch.16](16-styling-system.md) §16.1 — a leftover Tailwind *source* file from the
original "Figma Make" export, superseded by the already-compiled `index.css` that `main.tsx`
actually imports.

## 19.10 Loose dependency version pins

`clsx`, `motion`, `react-router-dom`, and `tailwind-merge` are all pinned to `"*"` (any version) in
`package.json` ([Ch.3](03-tooling-and-config.md) §3.1) rather than a specific range — a future
`npm install` could pull in an unexpected breaking major version with no warning. Worth tightening
whenever `package.json` is next touched.
