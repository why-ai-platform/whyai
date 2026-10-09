# Chapter 3: Tooling & Configuration Files

These files don't render anything on screen — they tell the build tools and the hosting platform
how to treat the code that does.

## 3.1 `package.json`

This is the project's identity card and its list of ingredients.

- `"name": "WhyAi"`, `"version": "0.1.0"`, `"private": true` — metadata; `private: true` stops
  anyone from accidentally publishing this to the public npm registry.
- `"dependencies"` — packages the *running app* needs: React itself, React Router (page
  navigation), 25 `@radix-ui/react-*` packages (unstyled, accessible UI primitives — dialogs,
  dropdowns, tooltips, etc. — that the `components/ui/` layer wraps, see Chapter 9), `lucide-react`
  (the icon set used everywhere — every `<Icon className="w-5 h-5" />` you see imported from
  `lucide-react`), `motion` (animation, imported in code as `motion/react` — this is the `framer-
  motion` library's newer package name), `recharts` (charting, currently unused by any live page),
  `sonner` (the toast/notification popups you see after login), `class-variance-authority` +
  `clsx` + `tailwind-merge` (small helpers for combining Tailwind class names conditionally — see
  `components/ui/utils.ts` in Chapter 9), `react-hook-form`, `cmdk`, `vaul`, `embla-carousel-react`,
  `input-otp`, `react-day-picker`, `react-resizable-panels`, `next-themes` — all of these exist
  because `components/ui/` includes a wrapper for them, but most are not yet used by a real page.
- `"devDependencies"` — packages only needed *while building*, never shipped to the browser:
  TypeScript's own type definitions for Node/React/React-DOM, the Vite React plugin, and Vite
  itself.
- `"scripts"` — the commands `npm run <name>` can execute: `dev` → `vite` (Chapter 1, §1.7),
  `build` → `vite build`. There is currently no `lint`, `test`, or `typecheck` script —
  [docs/ROADMAP.md](../ROADMAP.md) Phase 0 plans to add these.

**A version-number detail worth noticing**: some dependencies are pinned to an exact version
(`"lucide-react": "^0.487.0"`), while a few say `"*"` (`clsx`, `motion`, `react-router-dom`,
`tailwind-merge`) — meaning "any version at all." That's unusually loose and a little risky (a
future `npm install` could silently pull in a breaking major version); tightening these is a
reasonable `chore/` item to fold into Phase 0 of the roadmap if it ever causes a surprise.

## 3.2 `vite.config.ts`

```ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: { /* ~30 entries */ '@': path.resolve(__dirname, './src') },
  },
  build: { target: 'esnext', outDir: 'dist', chunkSizeWarningLimit: 1000 },
  server: { port: 3000, open: true },
});
```

- `plugins: [react()]` — enables the Vite plugin that understands JSX/TSX and converts it to plain
  JavaScript (using a fast Rust-based compiler called SWC, per the package name
  `@vitejs/plugin-react-swc`).
- `resolve.alias` — this is the most unusual part of this file, and it exists for a specific
  historical reason: this project was exported from a design tool called **Figma Make**, which
  writes imports with the exact version number baked into the import path, like
  `import { XIcon } from "lucide-react@0.487.0"` (you'll see these inside most files in
  `components/ui/`, e.g. [dialog.tsx](../../src/components/ui/dialog.tsx)). A real npm package is
  not actually named `"lucide-react@0.487.0"` — it's named `"lucide-react"`. Every line in this
  alias list rewrites one of those versioned import strings back to the plain package name Vite
  can actually resolve in `node_modules/`. The last entry, `'@': path.resolve(__dirname, './src')`,
  is unrelated and more conventional: it lets any file write `import { Button } from
  '@/components/ui/button'` instead of a long relative path like `'../../components/ui/button'` —
  though in practice, most files in this project still use relative paths rather than `@/`.
- `build.target: 'esnext'` — produces modern JavaScript output without extra compatibility code for
  very old browsers, keeping the bundle smaller.
- `build.outDir: 'dist'` — where `npm run build`'s output goes; this is the exact folder Vercel
  uploads (see §3.4).
- `server.port: 3000` / `open: true` — `npm run dev` listens on `http://localhost:3000` and
  auto-opens it in your default browser.

## 3.3 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WhyAi</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

This is the **only** HTML file in the entire project that gets served to a browser (see §1.4, SPA).
`<div id="root">` is an empty box that React will fill with everything you see. The `<script
type="module" src="/src/main.tsx">` tag is what starts the whole application — Chapter 4 picks up
exactly there.

## 3.4 `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This tells Vercel (the hosting platform) exactly how to build and serve the project:
`npm install` → `npm run build` → upload everything in `dist/`. The `rewrites` rule is essential for
an SPA: without it, a visitor who directly types `whyai.co.in/profile` into their browser (rather
than clicking to it from the home page) would get a real server-level 404, because there is no
actual file at `/profile` — there's only `index.html` plus JavaScript that *decides*, after loading,
to show the profile page. The rewrite rule says "no matter what path is requested, serve
`index.html` anyway" — then React Router (Chapter 5) reads the URL client-side and renders the
right page.

## 3.5 The missing `tsconfig.json`

Worth flagging explicitly: this project has **no `tsconfig.json` file at all**. Normally a
TypeScript project has one, configuring how strictly types are checked. Its absence here means two
things in practice: (1) Vite's SWC-based plugin still strips types and compiles `.tsx`/`.ts` files
fine without it — the dev server and build both work; but (2) **nothing in `npm run build` actually
type-checks the code** — SWC only *removes* type annotations, it doesn't *verify* them. A file with
a real type error, or one that imports a module that doesn't exist (see Chapter 19's
`CoursesLayout.tsx` finding), will not be caught by `npm run build` unless that broken file happens
to be reachable from `main.tsx`'s import graph. Adding a `tsconfig.json` plus a `tsc --noEmit`
type-check step in CI is a cheap, high-value addition — it already has a natural home in
[docs/ROADMAP.md](../ROADMAP.md) Phase 0 (`chore/ci`).
