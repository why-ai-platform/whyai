# Chapter 5: The App Shell — Routing, Constants, Types

## 5.1 `App.tsx`, function by function

[src/App.tsx](../../src/App.tsx) exports a single component, the default export, `App`. There is
only one function here, so this chapter covers it statement by statement.

```tsx
export default function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.COURSES} element={<CoursesPage />} />
            <Route path={ROUTES.COURSE_VIEWER} element={<CourseViewer />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PRACTICE} element={<PracticePage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.NEWS} element={<NewsPage />} />
            <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}
```

1. **`const { darkMode, toggleDarkMode } = useDarkMode();`** — calls the custom hook from Chapter 7
   once, at the very top of the component tree, so the dark-mode value and its toggle function can
   be passed down to `Navbar` as props.
2. **`<AuthProvider>` wraps everything** — this is React Context in action (Chapter 1 §1.3): by
   putting `AuthProvider` above `Router` and every page, *any* component anywhere in the tree —
   `Navbar`, `LoginDialog`, `DashboardPage`, all of them — can call `useAuth()` (Chapter 6) and get
   the current login state, without `App` having to manually pass it down as a prop through every
   layer.
3. **`<Router>`** — this is `BrowserRouter` from `react-router-dom`, renamed to `Router` on import.
   It reads the browser's current URL and makes routing decisions available to everything inside
   it. "Browser" router specifically means it uses the real URL bar (`/courses`, `/profile`, ...)
   rather than, say, a `#hash`-based scheme.
4. **The outer `<div>`** — sets the page background color (white in light mode, dark gray in dark
   mode, via Tailwind's `dark:` variant — Chapter 16) and a smooth color transition when toggling.
   `min-h-screen` ensures the page is always at least the full viewport height even if content is
   short, so the Footer doesn't float in the middle of the screen on short pages.
5. **`<Navbar />`** — rendered *outside* `<Routes>`, meaning it appears on literally every page,
   unconditionally. Same for `<Footer />` and `<Toaster />` below.
6. **`<Routes>...</Routes>`** — the actual routing table. Each `<Route path="..." element={...} />`
   says "if the current URL matches this path, render this component instead of anything else in
   the list." React Router checks these in order and renders the first exact match (and dynamic
   segments like `:id`, used in `COURSE_VIEWER` and `NEWS_DETAIL`, match any text in that URL
   position — more on this in Chapters 11 and 14).
7. **The catch-all `<Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />`** — matches
   *any* URL that didn't match one of the routes above (for example `/contests`, which — per
   Chapter 2 — has no registered route despite the page file existing) and immediately redirects to
   the home page. `replace` means this redirect doesn't add a new entry to browser history, so
   clicking "back" from the home page after being redirected doesn't bounce you back to the broken
   URL.
8. **`<Footer />` and `<Toaster />`** — the footer (Chapter 8) and the global toast-notification
   renderer (from the `sonner` package) that actually displays the little popup messages triggered
   elsewhere in the code by calling `toast.success(...)` or `toast.error(...)` (first used in
   Chapter 10's `LoginDialog`).

## 5.2 `constants/index.ts`

A small file of values used across many other files, so they're defined once:

- `APP_NAME`, `APP_DESCRIPTION` — currently defined but not actually rendered anywhere in the UI
  (the Navbar/landing page hardcode "WhyAi" text directly instead of importing these).
- **`ROUTES`** — every URL path in the app as a named constant, e.g. `ROUTES.COURSES = "/courses"`.
  Using `ROUTES.COURSES` instead of writing the string `"/courses"` everywhere means renaming a URL
  later only requires changing it in this one file. Note some entries here —
  `ROUTES.COURSE_DETAIL`, `ROUTES.LEARNING_PATH`, `ROUTES.PROBLEM_SOLVE`, `ROUTES.CONTESTS`,
  `ROUTES.CONTEST_DETAIL` — have **no matching `<Route>` in `App.tsx`**, confirming the "orphaned
  page" findings from Chapter 2.
- `DIFFICULTY_LEVELS`, `COURSE_LEVELS` — `as const` string-literal objects (an `as const` tells
  TypeScript to treat the values as exact fixed strings like `"easy"`, not the general type
  `string`), defined but not yet actually imported by the pages that display difficulty/level
  badges (those pages currently hardcode `'Easy' | 'Medium' | 'Hard'` etc. locally instead — see
  Chapters 11–13).
- `AI_CATEGORIES` — a list of 8 category names, also not yet wired into any live filter UI.

## 5.3 `types/index.ts`

Shared TypeScript shapes: `User`, `Course`, `Lesson`, `LessonContent`, `Problem`, `TestCase`,
`Contest`, `Submission`. These describe the data model the app is *designed* to eventually have once
a real backend exists (Book 2 covers this). Today, most live pages define their own local, slightly
different `interface Course { ... }` / `interface Problem { ... }` shapes directly inside the page
file (e.g. `CoursesPage` in Chapter 11, `PracticePage` in Chapter 12) rather than importing these
shared ones — another sign of the "scaffolded but not yet consolidated" state covered in Chapter 19.

## 5.4 `utils/api.ts`

```ts
export const api = {
  courses: { getAll: async () => { return []; }, getById: async (id: string) => { return null; } },
  problems: { getAll: async () => { return []; }, getById: ..., submit: ... },
  contests: { getAll: ..., getById: ... },
  user: { getProfile: ..., updateProfile: ... },
};
```

Every single function here is an `async` function (meaning it returns a `Promise` — a value that
will resolve at some point in the future, the standard shape for anything that will eventually make
a real network request) that currently just immediately returns `[]` or `null` with a `// TODO`
comment. **No file in the project currently imports `api` at all** — every page instead defines its
own hardcoded mock data directly (Chapters 10–15). This file exists purely as a sketch of the
`api.*` call shape pages are expected to switch to once [docs/ROADMAP.md](../ROADMAP.md) Phase 5/6
wires up a real Supabase backend.
