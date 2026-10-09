# Chapter 10: The Landing Page

Route: `ROUTES.HOME` (`/`). Component: [pages/landing/index.tsx](../../src/pages/landing/index.tsx),
which is just:

```tsx
export function LandingPage() {
  return (<> <Hero /> <NewsSection /> <FeaturesSection /> </>);
}
```

Three sections, stacked. The `<>...</>` is a **Fragment** — a way to group multiple elements
without adding an extra, meaningless wrapper `<div>` to the actual HTML output.

## 10.1 `Hero.tsx`

The animated headline at the very top of the site.

**State**: `currentTermIndex` (which word is currently being typed), `displayedText` (the text
shown so far), `isDeleting` (typing forward or backspacing), `charIndex` (how many characters of
the current word are shown), `isLoginDialogOpen`.

**The typing-effect `useEffect`** is the most intricate piece of logic on this page:

```tsx
useEffect(() => {
  const currentTerm = aiTerms[currentTermIndex].text;
  const typingSpeed = isDeleting ? 50 : 100;
  if (!isDeleting && charIndex === currentTerm.length) {
    const timeout = setTimeout(() => setIsDeleting(true), 2000);
    return () => clearTimeout(timeout);
  }
  if (isDeleting && charIndex === 0) {
    setIsDeleting(false);
    setCurrentTermIndex((prev) => (prev + 1) % aiTerms.length);
    const timeout = setTimeout(() => setCharIndex(0), 500);
    return () => clearTimeout(timeout);
  }
  const timeout = setTimeout(() => {
    if (isDeleting) {
      setDisplayedText(currentTerm.substring(0, charIndex - 1));
      setCharIndex((prev) => prev - 1);
    } else {
      setDisplayedText(currentTerm.substring(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);
    }
  }, typingSpeed);
  return () => clearTimeout(timeout);
}, [charIndex, isDeleting, currentTermIndex]);
```

This effect re-runs on every change to `charIndex`, `isDeleting`, or `currentTermIndex` — which is
every single character typed or deleted, essentially running itself in a loop via `setTimeout`
instead of `setInterval`. Three cases, checked in order:
1. **Finished typing the full word** (`!isDeleting && charIndex === currentTerm.length`): wait 2
   seconds, then flip to deleting mode.
2. **Finished deleting back to nothing** (`isDeleting && charIndex === 0`): switch to the next word
   in the `aiTerms` array (`(prev + 1) % aiTerms.length` wraps back to index 0 after the last word
   — the modulo `%` operator is the standard way to make a counter cycle), with a short pause.
3. **Otherwise**: add or remove one character from `displayedText`, after a delay (`50`ms per
   character while deleting — faster — or `100`ms while typing).

Every branch returns a cleanup function (`() => clearTimeout(timeout)`, Chapter 7's cleanup pattern)
so that if the component re-renders before a scheduled timeout fires, the stale one is cancelled
rather than firing late and causing a visual glitch.

**`aiTerms`** is a hardcoded array of 4 phrases, each with a Tailwind gradient color pair, cycled
through endlessly by the effect above.

**Static content**: the badge, description paragraph, two CTA buttons ("Sign In" opens
`LoginDialog`; "Start Learning" calls `navigate(ROUTES.COURSES)`), a 3-column feature row
(Roadmaps/Playground/Contests — purely decorative, these specific boxes don't link anywhere), and a
3-stat row (`50+` courses, `200+` problems, `1000+` learners — hardcoded numbers, not computed from
any real data since there is no backend yet, Chapter 5 §5.4).

## 10.2 `LoginDialog.tsx`

The popup used from both `Navbar` (Chapter 8) and `Hero`. It's a **controlled dialog** (Chapter 9
§9.4): the parent owns `open`/`onOpenChange` and passes them in.

**State**: `email`, `password`, `name` (form field values), `isLoading` (disables the submit button
and changes its label while the fake network delay from `AuthContext.login`/`signup` runs, Chapter
6).

**`handleLogin`**:
```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await login(email, password);
    toast.success('Successfully logged in!');
    onOpenChange(false);
    setEmail(''); setPassword('');
  } catch (error) {
    toast.error('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```
`e.preventDefault()` stops the browser's default behavior for a form submission (which would
otherwise reload the entire page — exactly what an SPA must never let happen, Chapter 1 §1.4). It
then awaits the context's `login()` (Chapter 6, which — remember — currently never actually fails,
so the `catch` block is unreachable dead code today, but is there correctly in case a real backend
call starts throwing errors later), shows a success toast via the `sonner` library, closes the
dialog, and clears the form fields. `handleSignup` is the same shape, one field (`name`) longer.

**Layout**: a `<Tabs>` component (Chapter 9) with "Login" and "Sign Up" as the two tab values,
each containing its own `<form>`. A "Continue without login" link closes the dialog without
authenticating at all — every page that doesn't strictly require login remains fully browsable as a
guest.

## 10.3 `NewsSection.tsx`

A preview of 4 hardcoded news items (a **separate, smaller, duplicate copy** of the data also found
in full in [newsData.ts](../../src/pages/news/newsData.ts) — Chapter 19 flags this duplication),
rendered as a 2-column grid of cards. Clicking a card calls `navigate(ROUTES.NEWS_DETAIL.replace(
':id', id.toString()))` — this `.replace(':id', ...)` pattern is how a dynamic route constant like
`"/news/:id"` gets turned into a real, concrete URL like `"/news/3"` at the point of navigation; you
will see this exact pattern repeated anywhere the app links to a dynamic route (also in Chapter 11's
course links and Chapter 14's news links). A "View All News" button at the bottom navigates to the
full `/news` page (Chapter 14).

## 10.4 `FeaturesSection.tsx`

Entirely static marketing content: a 4-item "key highlights" grid, followed by 4 larger
alternating-side feature blocks (image left/text right, then text left/image right, flipping via
`index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'`). No state, no navigation, no logic beyond
`.map()` over two hardcoded arrays (`features`, `keyHighlights`) to avoid repeating the same JSX
structure four times.
