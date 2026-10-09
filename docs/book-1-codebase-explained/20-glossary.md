# Chapter 20: Glossary

Every technical term used anywhere in this book, defined plainly. Alphabetical.

**API** — "Application Programming Interface." A defined way for one piece of software to ask
another for data or to do something, usually over the network for a web app's backend.

**Async / `await` / `Promise`** — a `Promise` is a value representing something that will finish
*later* (like a network request). `async function` marks a function as one that can `await` a
Promise — pause at that line until it resolves — without freezing the rest of the program.

**Backend** — the server-side part of an application: a database, business logic, authentication —
everything that doesn't run in the visitor's own browser. WhyAI currently has none (Book 1
Chapter 17).

**Bundle / bundler** — a bundler (Vite, in this project) combines many separate source files into a
small number of optimized files a browser can efficiently download and run. The output is called a
bundle.

**Child / parent component** — if component `A` renders `<B />` inside its own output, `B` is a
child of `A`, and `A` is `B`'s parent.

**Component** — a named, reusable function that returns a description of some UI (Book 1 Ch.1
§1.3).

**Context** — React's built-in mechanism for sharing a value with any descendant component without
manually passing it down as a prop through every intermediate layer (Book 1 Ch.1 §1.3, Ch.6).

**CSS** — the language that controls visual appearance (color, spacing, layout) of HTML.

**CSS custom property (CSS variable)** — a reusable named value in CSS, written `--name: value;`
and read with `var(--name)`. Used throughout `index.css`/`globals.css` for design tokens.

**Dependency (npm)** — a published package your project relies on, listed in `package.json`.

**Dependency array** — the array passed as the second argument to `useEffect`, controlling when the
effect re-runs (Book 1 Ch.1 §1.3).

**Hook** — any function whose name starts with `use`, giving a component function access to React
features like state or shared context (Book 1 Ch.1 §1.3).

**HTML** — the markup language that structures a webpage's content.

**JSON** — "JavaScript Object Notation," a plain-text format for structured data, widely used for
config files and for data sent between a browser and a server.

**JSX** — HTML-like syntax written directly inside TypeScript/JavaScript, compiled into plain
function calls before running (Book 1 Ch.1 §1.3).

**`localStorage`** — a small key-value store the browser keeps for a website, persisting across
page refreshes and browser restarts until explicitly cleared. Private to one browser on one device.

**Node.js** — a program that runs JavaScript outside a browser, used here to run build tools (Book
1 Ch.1 §1.2).

**npm** — Node Package Manager; downloads and manages a project's dependencies (Book 1 Ch.1 §1.2).

**Props** — data a parent component passes into a child component (Book 1 Ch.1 §1.3).

**React** — the JavaScript library this project's UI is built with (Book 1 Ch.1 §1.3).

**React Router** — the library handling client-side navigation/routing in this SPA (Book 1 Ch.5).

**Render (React)** — the act of a component function running and React updating the screen to match
its latest returned output.

**Route** — a mapping between a URL path and which component to show for it.

**`sessionStorage`** — like `localStorage`, but cleared automatically when the browser tab closes.

**SPA (Single-Page Application)** — a web app that loads one HTML page once and swaps content via
JavaScript afterward, rather than a full page reload per navigation (Book 1 Ch.1 §1.4).

**State** — data a component remembers between renders and can change over time, created with
`useState` (Book 1 Ch.1 §1.3).

**Tailwind CSS** — a utility-class-based CSS framework used throughout this project's styling (Book
1 Ch.1 §1.6).

**TypeScript** — JavaScript plus optional type-checking, used for every `.ts`/`.tsx` file in this
project (Book 1 Ch.1 §1.1).

**Vite** — the build tool used to run and bundle this project (Book 1 Ch.1 §1.5).

See also: **[Book 2's glossary](../book-2-tech-stack-and-scale/11-glossary.md)** for backend,
database, and scaling-specific terms (server, database, CDN, cache, latency, horizontal scaling,
and more) not needed to understand the current frontend-only codebase, but essential once a real
backend is added.
