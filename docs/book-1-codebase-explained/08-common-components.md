# Chapter 8: Shared Components — Navbar, Footer, Breadcrumb, Image Fallback

These four components are used across many pages rather than belonging to just one.

## 8.1 `Navbar.tsx`

File: [src/components/common/Navbar.tsx](../../src/components/common/Navbar.tsx). Rendered once,
unconditionally, by `App.tsx` (Chapter 5) — it appears on every single page.

**Props**: `{ darkMode, toggleDarkMode }` — passed down from `App.tsx`, which got them from
`useDarkMode()` (Chapter 7).

**Local state**:
- `mobileMenuOpen` (boolean) — whether the hamburger menu is expanded on small screens.
- `showLoginDialog` (boolean) — whether the `<LoginDialog>` popup (Chapter 10) is visible.

**From context/router**:
- `const { isAuthenticated, user, logout } = useAuth();` (Chapter 6).
- `const navigate = useNavigate();` and `const location = useLocation();` — two React Router
  hooks: `useNavigate()` returns a function to programmatically change the URL (used here after
  logout); `useLocation()` returns an object describing the current URL, used to highlight
  whichever nav link matches the current page.

**`handleLogout`**:
```tsx
const handleLogout = () => {
  logout();
  navigate(ROUTES.HOME);
};
```
Calls the context's `logout()` (clears the user), then immediately navigates back to the home page
— without this second line, a logged-out user could remain sitting on a page like `/profile` that's
only meant for logged-in users (the pages themselves separately re-check `isAuthenticated` too, as
Chapter 13 shows, so this is a UX nicety, not the only safety net).

**`navLinks`**:
```tsx
const navLinks = [
  { name: 'Home', path: ROUTES.HOME },
  { name: 'Courses', path: ROUTES.COURSES },
  ...(isAuthenticated ? [{ name: 'Dashboard', path: ROUTES.DASHBOARD }] : []),
];
```
The `...(isAuthenticated ? [...] : [])` is the **spread operator** combined with a conditional: if
logged in, spread a one-item array containing the Dashboard link into `navLinks`; if not, spread an
empty array (adding nothing). This is a common React pattern for conditionally including items in a
list without `if`/`else` branches breaking up the array literal.

**Rendering**: shows the logo (linking home), the nav links (highlighted via comparing
`location.pathname === link.path`), a dark-mode `<Switch>` with sun/moon icons, and then either
Login/Sign Up buttons (opening `showLoginDialog`) or a profile icon + logout button + the user's
name, depending on `isAuthenticated`. Below `md` breakpoint, a hamburger button toggles a
`<motion.div>`-animated dropdown (via the `motion`/Framer Motion library) containing the same links
stacked vertically.

## 8.2 `Footer.tsx`

File: [src/components/common/Footer.tsx](../../src/components/common/Footer.tsx). Also rendered
unconditionally by `App.tsx`, on every page. No props, no state that changes — it's a purely
presentational component with four hardcoded link columns (`product`, `company`, `resources`,
`legal` — every link currently points to `href: '#'`, i.e. nowhere real yet), four real social
media links, and a copyright line using `new Date().getFullYear()` so the year updates automatically
every January 1st without a code change.

## 8.3 `BreadcrumbNav.tsx`

File: [src/components/common/BreadcrumbNav.tsx](../../src/components/common/BreadcrumbNav.tsx).
**Not** rendered globally — individual pages (`PracticePage`, `DashboardPage`, `CoursesPage` in
Chapter 11) include it explicitly where it makes sense.

**Props**: `{ items? }` — an *optional* array of `{ label, path }`. If a page doesn't supply one,
the component builds its own automatically from the current URL.

**The auto-generation logic**, `getRouteLabel`:
```ts
const getRouteLabel = (path: string): string => {
  const labels: Record<string, string> = { '/': 'Home', '/courses': 'Courses', ... };
  if (labels[path]) return labels[path];
  if (path.startsWith('/courses')) {
    if (path.includes('playground')) return 'Playground';
    if (path.includes('dashboard')) return 'Dashboard';
  }
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ') : 'Home';
};
```
It first checks a lookup table of known friendly names, then falls back to taking the last URL
segment and capitalizing it (turning a hypothetical `/some-path` into `"Some path"`).

**Building the trail** when no `items` prop is given:
```ts
const pathnames = location.pathname.split('/').filter((x) => x);
const crumbs = [{ label: 'Home', path: ROUTES.HOME }];
let currentPath = '';
pathnames.forEach((segment) => {
  currentPath += `/${segment}`;
  crumbs.push({ label: getRouteLabel(currentPath), path: currentPath });
});
```
For a URL like `/courses/dashboard`, this builds up `currentPath` segment by segment —
`/courses`, then `/courses/dashboard` — producing three breadcrumb entries: Home → Courses →
Dashboard.

**`handleClick`** intercepts clicks on all but the last crumb (the last one, the current page, is
rendered as plain text, not a link) and calls `navigate(path)` — except for a special case: if the
label is "Playground," it instead writes `sessionStorage.setItem('activeTab', 'playground')` before
navigating to the Courses page. `sessionStorage` is like `localStorage` but cleared when the
browser tab closes; this specific line is how clicking that breadcrumb tells `CoursesPage` (Chapter
11) which sidebar tab to open automatically when it mounts.

## 8.4 `ImageWithFallback.tsx`

File: [src/components/figma/ImageWithFallback.tsx](../../src/components/figma/ImageWithFallback.tsx).
A drop-in replacement for a plain `<img>` tag, used everywhere an image comes from an external URL
(Unsplash links in news/features content, Chapters 10 and 14) that might fail to load.

```tsx
export function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const handleError = () => setDidError(true);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`} style={style}>
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
}
```

- It renders a normal `<img>` with an `onError` handler attached — this is a real browser event
  that fires automatically if the image URL 404s, times out, or the request otherwise fails.
- If that happens, `didError` flips to `true`, and the component re-renders showing a small
  generic "broken image" icon (`ERROR_IMG_SRC`, a `data:image/svg+xml;base64,...` string — an image
  encoded directly as text, so no separate file or network request is needed to show the fallback
  icon itself) instead of a browser's default broken-image box.
- `{ src, alt, style, className, ...rest }` — destructures the named props out and collects
  everything else passed in (like `onClick`, `width`, etc.) into `rest`, which then gets spread onto
  whichever `<img>` actually renders, so callers can pass any normal `<img>` attribute through
  transparently.
