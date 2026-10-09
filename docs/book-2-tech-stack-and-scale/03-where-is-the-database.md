# Chapter 3: Where Is the Database, and Where Should It Go?

This chapter exists to directly answer the question: *"where is database or we can add."*

## 3.1 The direct answer

There is no database today (Chapter 2). It does not live in this codebase at all — a database is a
separate running service, not a file in a GitHub repository. You don't "add" a database by writing
code in `whyai/src/`; you **create one with a database provider**, and then this codebase connects
to it over the network using a small client library and a secret connection key.

## 3.2 The recommended choice: Supabase

[docs/ROADMAP.md](../ROADMAP.md) already settles on this as the default, for reasons worth repeating
here: **Supabase** is a company that runs managed PostgreSQL databases (Chapter 1 §1.2) for you,
and bundles several other things a small team needs alongside it — all under one account, one
dashboard, one set of API keys:

- **The Postgres database itself** — tables, rows, relationships, exactly as described in Chapter 1.
- **Authentication** — real signup/login/password-reset/session handling, replacing the mock
  `AuthContext` from Book 1 Ch.6 entirely.
- **File storage** — for the actual ebook PDFs and AI agent package files that get sold.
- **Auto-generated APIs** and a JavaScript client library, so this React app can read/write data
  directly (with security rules enforced — Chapter 5) without hand-writing a separate server for
  every single database operation.

**Why this fits WhyAI specifically, right now**: a single person/small team, no dedicated backend
engineer, needing to move fast on three product pillars simultaneously (courses, ebooks, agents).
Supabase removes the need to write, deploy, and maintain a custom backend server just to have a
database — you get a real Postgres database and secure API with a few hours of setup, not weeks.

**Honest alternatives, and why they weren't picked**: Firebase (Google's equivalent; a different
kind of database — "NoSQL," meaning less structured, trading some of Postgres's guarantees for
flexibility — a reasonable choice too, but Postgres/Supabase is generally the better fit once you
know your data has clear relationships, like "a user has many orders," which this app clearly does);
a fully custom Node.js/FastAPI server with your own Postgres instance (full control, but
significantly more setup and ongoing maintenance — the right move *eventually* if the app outgrows
Supabase's limits, covered in Chapter 9, but premature today).

## 3.3 What tables would actually look like

Sketched directly from WhyAI's three pillars (not final, but concrete enough to make "where would
the data go" tangible):

```
users                         (mostly managed automatically by Supabase Auth)
  id, email, created_at, display_name

courses
  id, title, description, level, category

lessons
  id, course_id (→ courses.id), title, content, order

course_progress
  id, user_id (→ users.id), course_id (→ courses.id), lesson_id, completed_at

products                       (unifies ebooks + AI agents, per docs/ROADMAP.md §5)
  id, type ('ebook' | 'agent' | 'course'), title, description, price, asset_url

orders
  id, user_id (→ users.id), product_id (→ products.id), status, provider_ref, created_at
```

The `(→ table.column)` notation marks a **foreign key** — a column whose value refers to a row in
another table. This is the "relational" part of "relational database": `course_progress.user_id`
pointing at a row in `users` is how the database knows *which* user's progress a given row
represents, rather than that information living anywhere else.

## 3.4 How the React app actually talks to it, once it exists

A small file, conventionally `src/utils/supabaseClient.ts` (named and scoped in
[docs/ROADMAP.md](../ROADMAP.md) Phase 5), holds the one connection setup:

```ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
```

From then on, any component can write something like `await supabase.from('courses').select('*')`
to fetch real rows — this is the line that would finally replace the hardcoded `courses` array in
`CoursesPage` (Book 1 Ch.11 §11.1) with real, shared, persistent data. `import.meta.env.VITE_...`
is how Vite exposes environment variables (values configured outside the code, per deployment —
local development vs. the live Vercel site each get their own) to client-side code; anything
prefixed `VITE_` is intentionally safe to expose to the browser (Chapter 5 covers exactly which
keys are safe to expose this way, and which must never be).

## 3.5 What changes in the code once this exists

Concretely, per file, referencing Book 1's chapters:
- `AuthContext.tsx` (Book 1 Ch.6) — `login`/`signup`/`logout` call real Supabase Auth functions
  instead of the fake delay-and-mock-object pattern.
- `utils/api.ts` (Book 1 Ch.5 §5.4) — every stub function gets a real `supabase.from(...)` query
  behind it; this file finally becomes load-bearing.
- `CoursesPage`, `CourseViewer`, `PracticePage`, `DashboardPage`, `ProfilePage` (Book 1 Ch.11–13) —
  each swaps its hardcoded array for a real fetched one, typically loaded in a `useEffect` on
  mount.
- `localStorage`-based course progress (Book 1 Ch.11 §11.2) — migrates to the `course_progress`
  table, so progress follows an account across devices instead of staying trapped on one browser.

This is exactly the work [docs/ROADMAP.md](../ROADMAP.md) Phases 5–7 schedule, broken into small,
independently-verifiable steps.
