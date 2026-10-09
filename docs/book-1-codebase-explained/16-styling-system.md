# Chapter 16: The Styling System — Colors, Dark Mode, and Two CSS Files

## 16.1 Two CSS files, only one of them live

There are **two** CSS files in `src/`, and understanding the difference between them resolves a
question that trips up a lot of people reading this codebase for the first time.

- **[src/index.css](../../src/index.css)** — imported by `main.tsx` (Chapter 4), so this is the
  CSS that actually reaches the browser. It is the fully **compiled output** of Tailwind CSS
  v4 — thousands of lines of generated utility classes (`.flex { display: flex; }`, `.px-4 {
  padding-inline: 1rem; }`, and so on, one rule per class actually used somewhere in the project),
  plus the specific color/spacing/typography **design tokens** baked in as CSS custom properties
  (variables) at the top, under `@layer theme`.
- **[src/styles/globals.css](../../src/styles/globals.css)** — this is a Tailwind **source** file
  (the kind you'd normally feed *into* a build step to produce something like `index.css`),
  defining the same category of design tokens (`--background`, `--foreground`, `--primary`,
  `--border`, `--radius`, etc.) for both light and dark mode, plus a `@theme inline` block mapping
  them to the names Tailwind's utility classes expect. **Nothing in the project imports this
  file** — not `main.tsx`, not any component, not `index.css` itself. It has no effect on anything
  a visitor sees. It's a leftover source file from how the project was originally exported (from
  the "Figma Make" tool mentioned in Chapter 3 §3.2) that was never wired into an actual build step
  after that export — `index.css` instead appears to already contain its own compiled token values
  directly.

**The practical consequence**: if you ever want to change a core color (say, the primary blue), the
tokens in `globals.css` are the ones that *look* like the obvious place to edit, but editing them
would currently do nothing. The real, effective values live baked into `index.css`'s own `@layer
theme` block, or — far more commonly in this codebase — are simply written inline as Tailwind
utility classes directly in each component (`bg-gradient-to-r from-blue-500 to-purple-600` appears
dozens of times across pages, rather than most components reading from the token variables at
all). Reconciling this — picking one real source of truth for the design tokens and actually wiring
it into the build — is a reasonable, low-risk cleanup item for a future `chore/` entry in
[docs/ROADMAP.md](../ROADMAP.md) Phase 0.

## 16.2 How dark mode actually works, end to end

Three pieces work together, each covered in its own chapter — this section connects them:

1. **[useDarkMode.ts](../../src/hooks/useDarkMode.ts)** (Chapter 7) holds the one `darkMode`
   boolean and, whenever it changes, adds or removes a plain CSS class named `dark` on the `<html>`
   element (`document.documentElement.classList.add('dark')`).
2. **Tailwind's `dark:` variant.** Throughout the codebase you'll see paired classes like
   `className="bg-white dark:bg-gray-900"`. Tailwind compiles `dark:bg-gray-900` into a CSS rule
   that only applies *when some ancestor element has the `dark` class* — specifically, in this
   project's configuration, it's written to key off a class on `<html>` (the "class strategy," as
   opposed to automatically following the OS-level dark mode setting via `@media
   (prefers-color-scheme: dark)` directly in CSS). This is exactly why step 1 toggling a class on
   `<html>` is sufficient to flip the *entire* page's colors — every element with a `dark:`-prefixed
   class re-evaluates against that one class, all at once.
3. **Every page/component writes both halves itself.** There's no central theme file that
   automatically supplies a light/dark pair — each component manually writes `text-gray-900
   dark:text-white`, `bg-gray-50 dark:bg-gray-800`, etc., next to each other, for every single
   element that needs to change appearance. This is straightforward to read but means **adding a
   new themed color somewhere requires remembering to write the `dark:` variant yourself, every
   time** — nothing will warn you if you forget one and that one element stays the wrong color in
   dark mode.

## 16.3 The handful of design tokens that *are* actually used

Despite most of the app using hardcoded Tailwind colors directly (`blue-500`, `purple-600`,
`gray-900`, etc.) rather than the semantic tokens, the tokens defined in `globals.css`/baked into
`index.css` (`--background`, `--foreground`, `--card`, `--primary`, `--border`, `--radius`, etc.)
are what the `components/ui/` library (Chapter 9) consistently builds on — e.g. `button.tsx`'s
`bg-primary text-primary-foreground`, `dialog.tsx`'s `bg-background`. So while page-level code
mostly bypasses the token system, the shared UI primitives mostly respect it — another small
inconsistency in the codebase's current styling approach worth being aware of rather than confused
by.
