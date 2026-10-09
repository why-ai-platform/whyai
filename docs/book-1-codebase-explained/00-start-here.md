# Book 1: The WhyAI Codebase, Explained From Zero

## Who this book is for

Someone who has **never read Node.js or TypeScript code before** and wants to understand exactly
what every file in this repository does — not roughly, but precisely: which function runs when,
what each piece of state means, and how a click on a button turns into something appearing on
screen. If you can read English sentences, you can follow this book; it does not assume you know
what "JSX" or "a hook" means before Chapter 1.

## How this book is organized

1. **[01-before-you-start.md](01-before-you-start.md)** — the vocabulary and concepts you need
   before any of the code will make sense: Node.js, npm, TypeScript, React, components, Vite,
   Tailwind. Read this first even if some of it sounds familiar.
2. **[02-project-map.md](02-project-map.md)** — the complete folder/file tree with a one-line job
   description for every single file, including which files are actually used and which are
   leftover/dead code.
3. **[03-tooling-and-config.md](03-tooling-and-config.md)** — the non-"page" files that make the
   project buildable and runnable: `package.json`, `vite.config.ts`, `index.html`, `vercel.json`.
4. **[04-entry-point.md](04-entry-point.md)** — the exact sequence of events from "you type
   `npm run dev`" to "a webpage appears."
5. **[05-app-shell-and-routing.md](05-app-shell-and-routing.md)** — `App.tsx`, routing, shared
   constants and types.
6. **[06-auth-context.md](06-auth-context.md)** — how login/logout/signup currently work (and why
   they're fake today).
7. **[07-hooks.md](07-hooks.md)** — the two small reusable pieces of logic (`useDarkMode`,
   `useIsMobile`).
8. **[08-common-components.md](08-common-components.md)** — Navbar, Footer, breadcrumb, image
   fallback — the pieces shared across every page.
9. **[09-ui-library.md](09-ui-library.md)** — the 48 small "building block" UI components
   (buttons, dialogs, cards...) and the one pattern they all follow.
10. **[10-landing-page.md](10-landing-page.md)** through **[15-contests-stub.md](15-contests-stub.md)**
    — every page in the app, feature by feature, function by function.
11. **[16-styling-system.md](16-styling-system.md)** — how colors, dark mode, and spacing work.
12. **[17-system-design-flow.md](17-system-design-flow.md)** — the big picture: what kind of
    application this is, drawn as diagrams.
13. **[18-code-flow-walkthroughs.md](18-code-flow-walkthroughs.md)** — five real user actions
    traced step by step through the actual function calls that handle them.
14. **[19-known-issues-and-dead-code.md](19-known-issues-and-dead-code.md)** — an honest list of
    things in the codebase today that are incomplete, unused, or risky, found while writing this
    book.
15. **[20-glossary.md](20-glossary.md)** — every technical term used anywhere in this book,
    defined in one or two plain sentences.

## The one-paragraph version

WhyAI, today, is a **single webpage application** (no separate backend server, no database) built
with React and TypeScript, bundled by a tool called Vite, and styled with Tailwind CSS. When
someone visits the site, their browser downloads one small HTML file and one JavaScript bundle;
from then on, React draws everything on screen and handles every click, without ever reloading the
page. "Logging in," "course progress," and "problems solved" are currently either fake (held only
in memory, gone on refresh) or stored in the browser's own `localStorage` — there is no server
anywhere keeping track of users yet. That's not a flaw to be embarrassed about — it's exactly where
a project should be before [docs/ROADMAP.md](../ROADMAP.md)'s Phase 4+ adds a real backend. This
book documents what exists *right now*, precisely.

Companion volume: **[Book 2 — Tech Stack & Scaling to Millions](../book-2-tech-stack-and-scale/00-start-here.md)**
answers the separate question of where a database would go and how this app would need to change to
serve a very large number of users at once.
