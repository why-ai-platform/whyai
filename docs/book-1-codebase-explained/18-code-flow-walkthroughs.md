# Chapter 18: Code-Flow Walkthroughs — Five Real User Actions, Traced

Each walkthrough names the exact function and file at every step. Read these after Chapters 1–17 —
they assume you already know what each referenced function does and focus purely on the *sequence*.

## 18.1 Walkthrough: loading the site for the first time

1. Browser requests `/`. Vercel serves `index.html` ([Ch.3](03-tooling-and-config.md) §3.3).
2. `<script src="/src/main.tsx">` runs. [`main.tsx`](../../src/main.tsx) imports `index.css` (styles
   active) and `App.tsx`, then calls `createRoot(root).render(<App />)` ([Ch.4](04-entry-point.md)).
3. `App()` runs ([Ch.5](05-app-shell-and-routing.md) §5.1): calls `useDarkMode()`
   ([Ch.7](07-hooks.md) §7.1), whose lazy initializer checks `localStorage.getItem('darkMode')` —
   first visit, nothing stored, so it falls back to `window.matchMedia('(prefers-color-scheme:
   dark)').matches`. Say the OS is in light mode: `darkMode` starts `false`.
4. `App` renders `<AuthProvider>` ([Ch.6](06-auth-context.md) §6.2), whose own `useState<User |
   null>(null)` starts with nobody logged in.
5. Inside that, `<Router>` reads the real URL (`/`) and matches the `ROUTES.HOME` route
   ([Ch.5](05-app-shell-and-routing.md) §5.1) → renders `<LandingPage />`.
6. `LandingPage` renders `<Hero />`, `<NewsSection />`, `<FeaturesSection />` in order
   ([Ch.10](10-landing-page.md)). `Hero`'s own `useEffect` for the typing animation
   ([Ch.10](10-landing-page.md) §10.1) starts its `setTimeout` loop immediately.
7. Browser paints. From here, nothing further happens until the visitor interacts with something.

## 18.2 Walkthrough: signing up, then immediately seeing the Dashboard link appear

1. Visitor clicks "Sign Up" in `Navbar` → `setShowLoginDialog(true)` ([Ch.8](08-common-components.md)
   §8.1) → `<LoginDialog open={true} .../>` ([Ch.10](10-landing-page.md) §10.2) now renders its
   visible dialog box instead of nothing.
2. Visitor switches to the "Sign Up" tab (`<Tabs>`, purely local UI state inside the Radix tabs
   primitive, [Ch.9](09-ui-library.md) §9.5), types a name/email/password — each keystroke fires
   `onChange`, calling `setName`/`setEmail`/`setPassword` ([Ch.10](10-landing-page.md) §10.2),
   updating `LoginDialog`'s own local state and re-rendering the input with the new value.
3. Visitor clicks "Create Account" — submits the `<form>`, firing `handleSignup(e)`.
   `e.preventDefault()` stops a full page reload. `setIsLoading(true)` re-renders the button to say
   "Creating Account..." and disables it.
4. `await signup(name, email, password)` calls into `AuthContext` ([Ch.6](06-auth-context.md)
   §6.4): waits a fake 1 second, builds a `mockUser` object, calls `setUser(mockUser)`.
5. **This is the key moment**: `setUser(...)` changes state inside `AuthProvider`. React now
   re-renders **every component that reads this context via `useAuth()`** — not just `LoginDialog`.
   That includes `Navbar`, which recomputes `isAuthenticated` as `true` and therefore recomputes its
   `navLinks` array ([Ch.8](08-common-components.md) §8.1) to now include the spread-in Dashboard
   link. No one explicitly told `Navbar` to update — it updates automatically because it subscribed
   to the same context value that just changed.
6. Back in `LoginDialog`: `toast.success('Account created successfully!')` shows a popup (rendered
   by the global `<Toaster />` in `App.tsx`, [Ch.5](05-app-shell-and-routing.md) §5.1, item 8),
   `onOpenChange(false)` closes the dialog, form fields are cleared, `setIsLoading(false)` restores
   the button.

## 18.3 Walkthrough: opening a course, reading a lesson, marking it complete, refreshing the page

1. On `/courses`, visitor clicks "Start Course" on the "Introduction to AI" card → `navigate(
   ROUTES.COURSE_VIEWER.replace(':id', '1'))` ([Ch.11](11-courses.md) §11.1) → URL becomes
   `/courses/1/learn`.
2. React Router matches this against `ROUTES.COURSE_VIEWER` and renders `<CourseViewer />`
   ([Ch.5](05-app-shell-and-routing.md) §5.1).
3. `CourseViewer` reads `useParams()` → `id = "1"` → `courseContentData['1']` exists
   ([Ch.11](11-courses.md) §11.2) → its first `useEffect` reads
   `localStorage.getItem('course-1-completed')`; first visit, nothing stored, `completedLessons`
   stays an empty `Set`.
4. The first lesson renders, including its raw HTML content via `dangerouslySetInnerHTML`
   ([Ch.11](11-courses.md) §11.2).
5. Visitor clicks "Next Lesson" → `handleNext()` calls `markCurrentAsCompleted()` (adds lesson id
   `'1'` to the `completedLessons` Set) **then** `setCurrentLessonIndex(1)`.
6. Both state changes trigger a re-render: the progress bar recalculates
   (`completedLessons.size / courseContent.lessons.length * 100`), and the second `useEffect`
   fires because `completedLessons` changed, writing `localStorage.setItem('course-1-completed',
   '["1"]')`. A third `useEffect` fires because `currentLessonIndex` changed, scrolling to top.
7. Visitor refreshes the browser tab entirely (a real, full page reload this time — not React
   Router navigation). **Everything in every component's memory is wiped** — `App` runs from
   scratch again (step 18.1 all over again), `AuthProvider`'s `user` resets to `null` (logged out!
   — Ch.6 §6.3 noted this explicitly), **but** `CourseViewer`'s first `useEffect` reads
   `localStorage.getItem('course-1-completed')` again, finds `'["1"]'` this time, and restores
   `completedLessons` to contain lesson `'1'` — so the progress bar correctly shows 1 lesson done
   again, even though the visitor is no longer logged in. This is the concrete proof of the state
   table in [Ch.17](17-system-design-flow.md) §17.3: login state and course progress have
   completely different, independent lifetimes today.

## 18.4 Walkthrough: toggling dark mode

1. Visitor clicks the `<Switch>` in `Navbar` → fires `onCheckedChange` → calls the
   `toggleDarkMode` function `App` passed down as a prop ([Ch.5](05-app-shell-and-routing.md) §5.1,
   [Ch.8](08-common-components.md) §8.1).
2. That function is `useDarkMode()`'s `toggleDarkMode` ([Ch.7](07-hooks.md) §7.1):
   `setDarkMode(!darkMode)` flips the boolean.
3. `App` re-renders because its own state changed. Its `useEffect` (inside `useDarkMode`, actually
   — the effect lives in the hook, not in `App` itself) fires: adds or removes the `dark` class on
   `document.documentElement`, and writes the new value to `localStorage`.
4. **No component needed to be told individually to change color.** Every element anywhere in the
   whole rendered tree that has a `dark:`-prefixed Tailwind class ([Ch.16](16-styling-system.md)
   §16.2) re-evaluates instantly against that one class on `<html>` — this is a pure CSS effect, not
   something React re-renders component-by-component for.

## 18.5 Walkthrough: typing an unknown URL directly into the address bar

1. Visitor types `whyai.co.in/contests` and presses Enter — a **real browser navigation**, not a
   React Router link click.
2. The browser makes a real HTTP request to Vercel for the path `/contests`.
3. Vercel's `rewrites` rule ([Ch.3](03-tooling-and-config.md) §3.4) matches `/(.*)` and serves
   `index.html` anyway (there is no real file at `/contests` on the server — this rewrite is the
   only reason this doesn't produce a blunt 404 page from Vercel itself).
4. The whole app boots fresh (§18.1's sequence again). This time, `<Router>` reads the URL
   `/contests` and checks it against every `<Route>` in `App.tsx` — none of the explicit paths
   match (`ContestsPage` has no route, per [Ch.15](15-contests-stub.md)), so it falls through to
   the catch-all `<Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />`
   ([Ch.5](05-app-shell-and-routing.md) §5.1, item 7).
5. `<Navigate>` is a React Router component that, as soon as it renders, immediately triggers
   another client-side navigation to `/` — the visitor sees the URL bar flip to `/` and the
   landing page render, with no further full page reload.
