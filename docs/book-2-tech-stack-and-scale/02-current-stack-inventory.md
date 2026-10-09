# Chapter 2: WhyAI's Current Stack, Inventoried

Precisely what exists today, layer by layer (using Chapter 1's vocabulary), and precisely what's
missing. Cross-referenced to Book 1 for anyone who wants the code-level detail behind each line.

## 2.1 What exists today

| Layer | What WhyAI uses | Book 1 reference |
|---|---|---|
| UI framework | React 18 + TypeScript | Ch.1 |
| Build tool | Vite (+ SWC-based React plugin) | Ch.1, Ch.3 |
| Styling | Tailwind CSS v4 | Ch.16 |
| UI components | shadcn/ui (Radix UI primitives + Tailwind) | Ch.9 |
| Client-side routing | React Router v6 | Ch.5 |
| Animation | Motion (Framer Motion) | Ch.10 |
| Toast notifications | Sonner | Ch.5 |
| Charting library (installed, unused) | Recharts | Ch.9, Ch.13 |
| Hosting | Vercel (static file hosting) | Ch.3, Ch.17 |
| Version control | Git + GitHub (`why-ai-platform/whyai`) | — |

## 2.2 What does **not** exist today

This is the important half of the inventory:

- **No database of any kind.** Not Postgres, not MongoDB, not Firebase — nothing. All "data" is
  either hardcoded in source files or living in a visitor's own `localStorage` (Book 1 Ch.17 §17.3).
- **No backend server.** No Node.js/Express/FastAPI process running anywhere, no serverless
  functions, nothing that executes logic server-side.
- **No real authentication.** `AuthContext` accepts any email/password with no verification at all
  (Book 1 Ch.6).
- **No payments integration.** Nothing resembling Stripe, Razorpay, or any payment provider exists
  in the code yet.
- **No real code execution** for the Practice platform — `handleRunCode` is a hardcoded fake result
  (Book 1 Ch.12).
- **No CDN configuration beyond whatever Vercel provides automatically** (Chapter 6 covers exactly
  what that default already gives you, which is more than it might sound).
- **No caching strategy** beyond the browser's own default HTTP caching of static files.
- **No monitoring, logging, or error tracking** — if something breaks for a real visitor today,
  nobody is automatically notified.
- **No automated tests, no CI pipeline, no type-checking step** (Book 1 Ch.3 §3.5, Ch.19 §19.3).

## 2.3 Why this gap is normal, not alarming

A project at this stage — pre-revenue, built by one person, validating product ideas — having zero
backend is the *correct* amount of infrastructure, not a deficiency. Building a database, auth
system, and payment integration before confirming anyone wants to buy a course/ebook/agent would be
solving a problem that doesn't exist yet. [docs/ROADMAP.md](../ROADMAP.md)'s own phase ordering
reflects this directly: Phases 2–3 (sellable eBook/Agent storefronts) are explicitly designed to
need **zero backend**, so a real sale can happen before any of the infrastructure described in the
rest of this book is built. Everything from Chapter 3 onward in this book describes what to add,
and *when* — not a backlog of things currently wrong.
