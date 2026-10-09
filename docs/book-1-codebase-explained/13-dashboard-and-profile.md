# Chapter 13: Dashboard & Profile

Both routes require login and share the exact same guard pattern — covered once, then each page's
unique content.

## 13.1 The shared login-guard pattern

Both [pages/dashboard/index.tsx](../../src/pages/dashboard/index.tsx) and
[pages/profile/index.tsx](../../src/pages/profile/index.tsx) open with:

```tsx
const { user, isAuthenticated } = useAuth();
const navigate = useNavigate();

if (!isAuthenticated) {
  return (
    <div className="... flex items-center justify-center">
      <Card className="p-8 max-w-md text-center">
        <h2>Login Required</h2>
        <p>Please log in to access your ...</p>
        <Button onClick={() => navigate(ROUTES.HOME)}>Go to Home</Button>
      </Card>
    </div>
  );
}
// ... the real page content below, only reached if isAuthenticated is true
```

This is an **early return** — a common React pattern where a component checks a condition at the
very top and returns a completely different, simpler UI before reaching its main content. Note
precisely what this does and doesn't protect: it stops the *page's own rendering*, but — since
there is no server here checking anything — it's purely a client-side UI convenience. Nothing
stops someone from editing `App.tsx`'s routing or (today) from the mock `AuthContext` simply being
unable to enforce anything server-side, because there is no server. Once a real backend exists
(roadmap Phase 5+), enforcement must additionally happen server-side (e.g. Supabase RLS, see
[docs/ROADMAP.md](../ROADMAP.md) §6 risk #3) — a client-side check like this one is a UX nicety,
never a security boundary by itself.

## 13.2 `DashboardPage`

All data is hardcoded at the top of the file, outside the component — `activityData` (7 days ×
problems/courses counts), `recentCourses` (3 items with icon/progress/lastAccessed/nextLesson),
`achievements` (6 items, each with `earned: boolean` and a `date` or `null`), `recentProblems` (4
items with status/difficulty/time). None of this reflects the logged-in user's actual activity —
every visitor who logs in (with *any* email/password, per Chapter 6) sees identical numbers.

**Sections, top to bottom**:
1. **Welcome header** — `Welcome back, {user?.name}!` is the one piece of genuinely personalized
   text on the page (the `?.` optional-chaining guards against `user` being `null` for a split
   second before the `isAuthenticated` check above would have already redirected — defensive, but
   technically redundant here since we've already confirmed `isAuthenticated`).
2. **4 stat cards** — Courses Enrolled, Problems Solved, Day Streak, Total Points — all hardcoded
   numbers.
3. **Continue Learning** (2/3 width) + **Weekly Activity** (1/3 width) side by side. The activity
   chart is not a real charting library (`recharts` is installed per Chapter 3 but unused here) —
   it's hand-built: `Array.from({ length: Math.max(day.problems, 1) })` creates an array with no
   real values, just the right *length*, purely so `.map()` can be used to draw that many small
   colored bar segments — a lightweight bar-chart illusion using plain `<div>`s.
4. **Tabs**: "Recent Problems" (a list from `recentProblems`) and "Achievements" (a grid from
   `achievements`, with earned ones shown in a gold gradient and locked ones dimmed via `opacity-60`
   — the `achievement.earned` boolean is the only thing driving that visual difference).

Every "Continue"/"View All" button simply calls `navigate(...)` to another route — there is no
deeper interaction (clicking a specific recent problem doesn't open that problem, for example; it
navigates generically to `/practice`).

## 13.3 `ProfilePage`

**Header card**: an `<Avatar>` showing the user's initial (`user?.name?.charAt(0).toUpperCase()`),
name, email, 3 hardcoded badges ("AI Enthusiast," "Level 5," "2,450 Points"), join date and
achievement count (both hardcoded, not derived from `user`), and an "Edit Profile" button that —
notably — **has no `onClick` handler at all**; clicking it does nothing. This is an incomplete
feature, not a bug that throws an error, just a button that doesn't do anything yet.

**4 stat cards** — Courses, Problems, Day Streak, Rank — same hardcoded-numbers pattern as the
Dashboard.

**Three tabs**:
1. **Settings** — a form with Name/Email (pre-filled via `defaultValue={user?.name}` /
   `defaultValue={user?.email}` — these are **uncontrolled** inputs, meaning React isn't tracking
   their live value in state the way `LoginDialog`'s form was in Chapter 10; they just show an
   initial value and the browser manages typing into them from there), Bio, GitHub, LinkedIn, and a
   "Save Changes" button that — like "Edit Profile" — has no `onClick`; nothing is actually saved
   anywhere.
2. **Preferences** — radio buttons for learning style and checkboxes for notification preferences,
   using plain uncontrolled HTML `<input type="radio">`/`<input type="checkbox">` rather than the
   styled `components/ui/radio-group.tsx`/`checkbox.tsx` wrappers from Chapter 9 (another small
   inconsistency worth knowing about if you go looking for where those UI primitives are actually
   used). "Save Preferences" — again, no handler.
3. **Security** — password change fields, a 2FA "Enable" button, and a "Delete Account" button
   under a "Danger Zone" heading — all purely visual, no handlers wired to any of them.

**The honest summary for this whole page**: the *visual design* of account settings is fully built,
but **none of the forms on this page actually do anything when submitted** — there is no save
logic anywhere in this file. This is exactly the kind of gap a real backend (roadmap Phase 5+) and
a few missing `onClick`/`onSubmit` handlers will need to close.
