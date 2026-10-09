# Chapter 1: Before You Start — Concepts You Need

Skip nothing in this chapter even if a term sounds familiar — the rest of the book uses these words
precisely, and assumes you read this first.

## 1.1 What is JavaScript, and what is TypeScript?

JavaScript is the programming language that runs inside every web browser — it's the only language
browsers natively understand for making a page interactive (clicking, typing, animating, etc.).

TypeScript is JavaScript **plus a type-checking layer on top**. A "type" is just a label saying what
kind of value something is — a `string` (text), a `number`, a `boolean` (true/false), or a custom
shape like "an object with a `name` and an `email`." TypeScript lets you write `function add(a:
number, b: number)` instead of just `function add(a, b)`, so tools can catch a mistake like
`add("hello", 5)` *before* the code ever runs, instead of crashing later. Every file in this project
ending in `.ts` or `.tsx` is TypeScript. Browsers cannot run TypeScript directly — a build tool
strips out the type information and turns it into plain JavaScript before it ever reaches a browser
(see §1.5, Vite).

## 1.2 What is Node.js and npm?

**Node.js** is a program that lets JavaScript run outside a browser — on your own computer, as a
command-line tool. It's what runs the *build tools* for this project (not the website itself once
it's live — the website that visitors see runs entirely in their browser).

**npm** ("Node Package Manager") is a tool that comes with Node.js for downloading and managing
other people's published code ("packages" or "libraries") so you don't have to write everything
from scratch. When you run `npm install` in this project's folder, npm reads
[package.json](../../package.json), downloads every package listed there into a folder called
`node_modules/` (never checked into git — see [.gitignore](../../.gitignore)), and records exact
versions in `package-lock.json`.

## 1.3 What is React, and what is a "component"?

React is a JavaScript library for building user interfaces out of small, reusable, named pieces
called **components**. A component is just a function that returns a description of some UI. For
example, in this codebase:

```tsx
export function Footer() {
  return <footer>© 2026 WhyAi</footer>;
}
```

`Footer` is a component. Anywhere else in the code, writing `<Footer />` drops that whole chunk of
UI in. Components can be nested inside each other — `App.tsx` renders `<Navbar />`, which internally
renders `<Button />`, and so on, forming a **tree** of components. That nesting is why
[17-system-design-flow.md](17-system-design-flow.md) draws the app as a tree diagram.

### JSX

The `<footer>© 2026 WhyAi</footer>` syntax above, written directly inside a JavaScript/TypeScript
function, is called **JSX**. It looks like HTML but it isn't HTML — it's a shorthand that gets
converted into plain JavaScript function calls before running. Any file that contains JSX must have
a `.tsx` extension (not `.ts`) — that's the entire difference between the two extensions in this
project.

### Props

**Props** ("properties") are how a parent component passes data into a child component — exactly
like function arguments. In [Navbar.tsx](../../src/components/common/Navbar.tsx):

```tsx
export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) { ... }
```

`darkMode` and `toggleDarkMode` are props. Whoever renders `<Navbar darkMode={true} toggleDarkMode={fn} />`
decides what values they are; `Navbar` itself just receives and uses them. The `NavbarProps` part is
a TypeScript type describing exactly what shape the props must have — so passing the wrong thing is
caught early.

### State and `useState`

**State** is data a component remembers between renders and can change over time — for example,
whether a mobile menu is currently open. React gives you this with the `useState` function:

```tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

This line creates a piece of state called `mobileMenuOpen`, starting at `false`, plus a function
`setMobileMenuOpen` to change it. **Calling `setMobileMenuOpen(true)` doesn't just change the
variable — it tells React "re-run this component's function and redraw the screen using the new
value."** That re-run-and-redraw cycle is called a **render**, and it's the single most important
idea in React: nothing on screen updates until some piece of state changes and React re-renders.

### `useEffect`

**`useEffect`** lets a component run some code *after* it renders — typically to talk to something
outside React itself: the browser's `localStorage`, a timer, or (in a real backend-connected app) a
network request. [useDarkMode.ts](../../src/hooks/useDarkMode.ts) uses it to save the dark-mode
preference to `localStorage` every time it changes:

```tsx
useEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
}, [darkMode]);
```

The array `[darkMode]` at the end is the **dependency array** — it tells React "only re-run this
effect when `darkMode` changes," rather than after every single render.

### Hooks, in general

Any function whose name starts with `use` (`useState`, `useEffect`, `useAuth`, `useNavigate`...) is
called a **hook**. Hooks are React's mechanism for giving a plain function component access to
features like state, side effects, or shared data — they only work inside component functions (or
inside other hooks).

### Context

**Context** is React's built-in way to share a piece of data with *any* component deep in the tree,
without manually passing it down as props through every single layer in between. This project uses
one: [AuthContext.tsx](../../src/contexts/AuthContext.tsx) shares "who is logged in" with any
component that calls `useAuth()`, no matter how deeply nested it is. Chapter 6 covers it in full.

## 1.4 What is a Single-Page Application (SPA)?

A traditional website loads a brand-new HTML page from the server every time you click a link. A
**Single-Page Application** loads one HTML page once, then uses JavaScript to swap out what's on
screen as you navigate — no full page reload, no round trip to a server for each click. This project
is an SPA: [index.html](../../index.html) is the *only* HTML file that ever gets served; everything
you see after that is React drawing and redrawing inside the one `<div id="root">` in that file.
This is also why [vercel.json](../../vercel.json) has a "rewrite everything to index.html" rule —
Chapter 3 explains exactly why that's necessary for an SPA deployed to a host like Vercel.

**Routing** (deciding what to show for a given URL like `/courses` or `/profile`) is therefore
handled entirely in JavaScript, by a library called **React Router** — not by the server. Chapter 5
covers how.

## 1.5 What is Vite, and why does a "build tool" even exist?

Browsers can't run TypeScript, can't efficiently load 86+ separate source files one by one, and
don't understand some of the shorthand this project's code uses. **Vite** is the build tool that
solves all three problems:

- **While developing** (`npm run dev`), Vite runs a local server that converts TypeScript/JSX to
  plain JavaScript on the fly, instantly, as you request each file — so you can see changes in the
  browser within milliseconds of saving a file.
- **For production** (`npm run build`), Vite bundles all 86+ source files into a small number of
  optimized `.js`/`.css` files in a `dist/` folder, ready to be uploaded to a host.

Vite's behavior is configured in [vite.config.ts](../../vite.config.ts) — Chapter 3 walks through
every line of it.

## 1.6 What is Tailwind CSS?

CSS is the language that controls how things *look* (colors, spacing, layout). Writing CSS by hand
for every element gets repetitive fast. **Tailwind CSS** instead gives you hundreds of small,
single-purpose class names you combine directly in your markup — `className="flex items-center
space-x-3 px-4 py-2 rounded-lg bg-gray-100"` means, roughly, "lay out children in a row, center them
vertically, 12px gap between them, some padding, rounded corners, light gray background." You will
see class names like this on nearly every line of UI code in this project. Chapter 16 explains the
color/dark-mode system behind these classes in more depth.

## 1.7 What does `npm install` / `npm run dev` / `npm run build` actually do here?

From [package.json](../../package.json)'s `scripts` section:

- `npm install` — downloads every package listed in `dependencies`/`devDependencies` into
  `node_modules/`.
- `npm run dev` — runs `vite`, starting the local development server (default port `3000`, per
  [vite.config.ts](../../vite.config.ts)), which you then open in a browser to see the app running
  live with instant updates on save.
- `npm run build` — runs `vite build`, producing the optimized, production-ready files in `dist/`
  that actually get deployed (Vercel runs this automatically on every push, per
  [vercel.json](../../vercel.json)).

With that vocabulary in place, Chapter 2 maps out every file in the project.
