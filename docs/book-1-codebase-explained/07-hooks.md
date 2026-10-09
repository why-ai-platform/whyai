# Chapter 7: The Custom Hooks

Two small, self-contained hooks (see Chapter 1 §1.3 for what a hook is) — both reused across
multiple components.

## 7.1 `useDarkMode.ts`

File: [src/hooks/useDarkMode.ts](../../src/hooks/useDarkMode.ts).

```ts
export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return { darkMode, toggleDarkMode };
}
```

**The initial state function** — `useState` is given a *function* here, `() => {...}`, rather than
a plain value. React only calls this function once, on the very first render, to compute the
starting value (this is called "lazy initial state" — useful when computing the initial value takes
real work, like reading from `localStorage`, that you don't want to redo on every render). Inside it:

1. `typeof window !== 'undefined'` — a defensive check. In a pure browser app like this one it's
   always true, but this pattern is a holdover from frameworks where code can also run on a server
   (where there is no `window` object at all) — harmless here, just not strictly necessary.
2. `localStorage.getItem('darkMode')` — checks if the user already chose a preference on a
   previous visit. `localStorage` is a small key-value store the browser keeps *per website,
   permanently*, until explicitly cleared — unlike normal variables, it survives page refreshes and
   browser restarts.
3. If nothing is stored yet, `window.matchMedia('(prefers-color-scheme: dark)').matches` asks the
   *operating system* whether the user's device is set to dark mode, and uses that as a sensible
   default for a first-time visitor.

**The effect** — runs every time `darkMode` changes (including the very first render): it adds or
removes a CSS class named `dark` on `<html>` (`document.documentElement`), and saves the current
choice back to `localStorage` so it's remembered next time. Chapter 16 explains exactly how that one
`dark` class on `<html>` cascades down to change every single color in the app via Tailwind's
`dark:` variant.

**`toggleDarkMode`** simply flips the boolean. Note this isn't a true "toggle function" in the
strictest sense — it reads the *current* `darkMode` value from this render's closure, which is safe
here because the toggle is only ever triggered by a direct user click (one render apart), but would
be subtly unsafe if called rapidly in a tight loop (it isn't, in this codebase).

**Used by**: only `App.tsx`, which calls it once and passes the two returned values down to
`Navbar` as props (Chapter 5).

## 7.2 `use-mobile.ts`

File: [src/components/ui/use-mobile.ts](../../src/components/ui/use-mobile.ts) — note this lives
under `components/ui/`, not `hooks/`, because it was bundled as part of the shadcn/ui component
library export rather than written specifically for this app (Chapter 9 explains that distinction).

```ts
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

- `window.matchMedia(...)` creates a live "media query" object the browser will notify you about
  whenever the screen crosses the 768px boundary (for example, rotating a tablet, or resizing a
  browser window past that width) — `767px` and narrower counts as mobile.
- `mql.addEventListener("change", onChange)` subscribes to that notification, so `isMobile` updates
  automatically and live, without requiring a page refresh, if the window is resized across the
  boundary.
- `setIsMobile(...)` is also called once immediately (outside the event, right after subscribing)
  to set the correct value right away rather than waiting for the first resize.
- **The cleanup function**: `return () => mql.removeEventListener("change", onChange);` — this is
  `useEffect`'s cleanup mechanism. If the component using this hook is ever removed from the screen
  entirely, React calls this returned function to unsubscribe, preventing a "memory leak" (the
  browser continuing to notify a component that no longer exists).
- `return !!isMobile` — converts the initial `undefined` state to `false` for that one first
  instant before the effect runs, using the same double-negation trick from Chapter 6 §6.2.

**Used by**: [components/ui/sidebar.tsx](../../src/components/ui/sidebar.tsx) only — and `sidebar.tsx`
itself is not currently used by any live page (Chapter 9), so this hook, while fully functional, has
no actual effect on anything a visitor sees today.
