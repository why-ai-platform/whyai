# Chapter 11: Courses — Catalog & Lesson Viewer

Two live routes: `ROUTES.COURSES` (`/courses`) → `CoursesPage`, and `ROUTES.COURSE_VIEWER`
(`/courses/:id/learn`) → `CourseViewer`. Three orphaned files (`CourseDetail.tsx`,
`CoursesLayout.tsx`, `LearningPath.tsx`) are covered at the end and in Chapter 19.

## 11.1 `CoursesPage` — [pages/courses/index.tsx](../../src/pages/courses/index.tsx)

**The `courses` array**: 8 hardcoded course objects (id, title, icon, level, duration, lessons
count, progress, description, topics, optional `locked`). This is a local `interface Course {...}`
— deliberately *not* the shared one from `types/index.ts` (Chapter 5 §5.3); the shapes differ
slightly (this one has `icon`/`level`/`progress`, the shared one has `thumbnail`/`lessons:
Lesson[]`).

**State**: `activeTab` (`'courses' | 'playground' | 'dashboard'`), initialized with a function
(lazy initial state, Chapter 7) that checks `sessionStorage.getItem('activeTab')` — this is the
other half of the breadcrumb trick from Chapter 8 §8.3: if `BreadcrumbNav` previously wrote
`'playground'` there before navigating here, this page opens directly on the Playground tab and
immediately clears the flag (`sessionStorage.removeItem(...)`) so it doesn't stick on a future
unrelated visit.

**Three render functions**, switched between by `activeTab`:

1. **`renderCoursesContent()`** — maps over `courses`, rendering a card per course with an icon, a
   level badge (color computed by `getLevelColor(level)`, a simple `switch` returning different
   Tailwind color classes), duration/lesson-count row, a progress bar (only shown `if
   (course.progress > 0)` — currently always `0` for every course since nothing sets it yet; this
   wires up once Chapter 11.2's `CourseViewer` localStorage progress, or later a real backend, is
   connected back to this page), up to 3 topic badges plus a "+N more" badge, and a "Start
   Course"/"Continue" button that calls `navigate(ROUTES.COURSE_VIEWER.replace(':id', course.id))`.
2. **`renderPlaygroundContent()`** — a static marketing/preview card for the practice platform
   (hardcoded Python code snippet shown as plain text, stat cards claiming "1000+" problems), ending
   in a button that calls `navigate(ROUTES.PRACTICE, { state: { fromPlayground: true } })` — the
   second argument to `navigate` here attaches **router state**, extra data that travels with the
   navigation without being visible in the URL; `PracticePage` (Chapter 12) reads this back via
   `useLocation().state` to adjust its breadcrumb trail.
3. **`renderDashboardContent()`** — only reachable via the `tabs` array, which conditionally
   includes the Dashboard tab `...(isAuthenticated ? [...] : [])` (same spread pattern as Chapter 8
   §8.1's `navLinks`). A smaller, in-page preview of stats and continue-learning cards, ending with
   a button to the full `/dashboard` page (Chapter 13). Note: `Math.random() * 100` is used here
   for each course's progress bar — meaning **this preview shows a different random progress value
   on every single render**, purely decorative, not reflecting any real saved progress.

**Layout**: a persistent left sidebar (the `tabs` array of 2–3 entries, icon + label, highlighted
by comparing `activeTab === tab.id`) next to whichever render function's output is active,
animated between via a `motion.div` keyed on `activeTab` (giving React a hint to treat each tab
switch as a fresh element to animate in, rather than patching the old one).

## 11.2 `CourseViewer` — [pages/courses/viewer/CourseViewer.tsx](../../src/pages/courses/viewer/CourseViewer.tsx)

Reads the `:id` URL parameter via `useParams<{ id: string }>()`, then looks up
`courseContentData[id]` from [courseContent.ts](../../src/pages/courses/viewer/courseContent.ts).
**Only `courseContentData['1']` exists today** — opening any other course id here (e.g. navigating
to `/courses/7/learn` for "Agentic AI") hits the `if (!courseContent)` branch and shows a "Course
Not Found" card with a button back to `/courses`. This is exactly the gap
[docs/ROADMAP.md](../ROADMAP.md) Phase 1 (`feat/course-content-agentic-ai` and siblings) fills in.

**State**: `currentLessonIndex` (which lesson is open), `showSidebar` (mobile lesson-list drawer),
`completedLessons` — a `Set<string>` of completed lesson ids. A `Set` (rather than an array) is used
specifically because checking "is this lesson already in here" (`completedLessons.has(id)`) and
adding/removing one item are both fast and don't require manually checking for duplicates the way
an array would.

**Three `useEffect`s**:
1. On mount (and whenever `id` changes), read `localStorage.getItem(`course-${id}-completed`)` and
   restore it into the `completedLessons` Set — **this is the only real data persistence in the
   entire app today**: course completion survives a page refresh, scoped per course id, entirely
   in the browser (nothing is sent anywhere).
2. Whenever `completedLessons` changes, write it straight back to that same `localStorage` key as a
   JSON array (`Array.from(completedLessons)` — converting the Set back to a plain array, since
   `JSON.stringify` can't serialize a `Set` directly).
3. Whenever `currentLessonIndex` changes, `window.scrollTo({ top: 0, behavior: 'smooth' })` — a
   small UX touch so switching lessons doesn't leave you scrolled halfway down the previous one.

**Navigation functions**: `handlePrevious`/`handleNext` move `currentLessonIndex` by one (bounded
at the array edges); `handleNext` also calls `markCurrentAsCompleted()` before advancing, so simply
reading through a course in order auto-marks each lesson done. `handleLessonSelect(index)` lets you
jump directly to any lesson from the sidebar list. `toggleComplete()` lets you manually mark/unmark
the *current* lesson regardless of navigation.

**Rendering the lesson content**:
```tsx
<div className="prose ..." dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
```
`currentLesson.content` is a plain string containing raw HTML (written directly inside
`courseContent.ts` — see the `<h2>`, `<ul>`, `<blockquote>` tags you can see if you open that file).
`dangerouslySetInnerHTML` is React's explicit, intentionally scary-named escape hatch for injecting
raw HTML instead of normal React-managed content — normal JSX text is automatically escaped
(meaning if a lesson's title contained `<script>`, it would show up as literal visible text, not
run), but this prop bypasses that protection entirely. That's safe *today* only because the owner
is the sole author of every string that ever reaches this prop. [docs/ROADMAP.md](../ROADMAP.md)
§6, risk #1, flags this directly and schedules a DOMPurify sanitization pass (Phase 1,
`feat/sanitize-lesson-html`) before any content source other than the owner's own commits is ever
possible — for example, a future admin content-editor UI, or buyer-submitted agent descriptions in
the marketplace pillar.

## 11.3 The three orphaned course files

- **`CourseDetail.tsx`** — an 8-line placeholder, no logic.
- **`LearningPath.tsx`** — an 8-line placeholder, no logic. (The "AI Learning Mindmap" feature
  mentioned in `FeaturesSection.tsx`'s marketing copy, Chapter 10, does not actually exist yet —
  this file is where it was intended to go.)
- **`CoursesLayout.tsx`** — the most structurally complete of the three (a full sidebar + routed
  sub-pages layout, 155 lines), but it is never rendered from `App.tsx`, and it imports
  `PlaygroundPage` from a file, `./Playground`, that **does not exist anywhere in this repository**.
  If anything ever changed to actually import `CoursesLayout` (directly or indirectly), the build
  would fail immediately on that missing-file import. Chapter 19 covers this as the most notable
  "known issue" in the whole codebase.
