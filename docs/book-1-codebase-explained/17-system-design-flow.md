# Chapter 17: System Design — The Big Picture

Everything in Chapters 2–16 described individual files. This chapter steps back and draws the
whole system as diagrams — what *kind* of application this is, and how its pieces fit together
today.

## 17.1 What kind of system is this, today?

```
┌─────────────────────────────────────────────────────────────┐
│                      VISITOR'S BROWSER                       │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  index.html  (loaded once)                            │  │
│   │     └─ main.tsx  →  App.tsx  →  React component tree  │  │
│   │                                                        │  │
│   │  State lives only here, in memory, while the tab is   │  │
│   │  open — EXCEPT two things written to localStorage:    │  │
│   │    • dark-mode preference                              │  │
│   │    • per-course lesson-completion sets                 │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │  (one-time download of static files)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL (static hosting)                    │
│   dist/  — the output of `npm run build`:                    │
│   one HTML file + a few bundled .js/.css files                │
│   (no server-side code runs here — it's just file hosting)    │
└─────────────────────────────────────────────────────────────┘

                 NO DATABASE. NO BACKEND SERVER.
                 NO AUTHENTICATION SERVER. NO PAYMENTS.
                 (all of this is "to be built" — see Book 2)
```

In architecture terms, this is a **static single-page application with zero backend**. Every
"account," "course progress," "problem solved," "achievement," and "news article" that appears
anywhere in the app is either (a) a hardcoded array sitting directly in a `.ts`/`.tsx` source file,
compiled into the JavaScript bundle at build time, identical for every single visitor, or (b) one
of the two small `localStorage` writes mentioned above, private to one browser on one device. There
is currently no way for data to move between two different people's browsers, or to survive a
visitor switching devices.

## 17.2 The component tree (what renders what)

```
App
├── AuthProvider                     (Ch.6 — supplies user/login/logout to everything below)
│   └── Router
│       ├── Navbar                   (Ch.8 — every page)
│       ├── Routes  (exactly one of the following renders, based on URL)
│       │   ├── "/"                  → LandingPage → Hero, NewsSection, FeaturesSection (Ch.10)
│       │   ├── "/courses"           → CoursesPage (Ch.11)
│       │   ├── "/courses/:id/learn" → CourseViewer (Ch.11)
│       │   ├── "/dashboard"         → DashboardPage (Ch.13)
│       │   ├── "/practice"          → PracticePage (Ch.12)
│       │   ├── "/profile"           → ProfilePage (Ch.13)
│       │   ├── "/news"              → NewsPage (Ch.14)
│       │   ├── "/news/:id"          → NewsDetail (Ch.14)
│       │   └── *  (anything else)   → redirect to "/"
│       ├── Footer                   (Ch.8 — every page)
│       └── Toaster                  (global toast popups)
```

Every box in the `Routes` list is mutually exclusive — React Router renders exactly one page
component at a time, swapping it out instantly (no network request, no full reload) whenever the
URL changes, per Chapter 1 §1.4.

## 17.3 Where state actually lives, mapped out

| Kind of data | Lives in | Survives refresh? | Shared across devices/users? |
|---|---|---|---|
| Who's logged in | `AuthContext`'s `useState` (Ch.6) | ❌ No | ❌ No |
| Dark mode preference | `localStorage` via `useDarkMode` (Ch.7) | ✅ Yes | ❌ No (per browser) |
| Course lesson completion | `localStorage`, per course id (Ch.11) | ✅ Yes | ❌ No (per browser) |
| Course/ebook/problem/news catalog content | Hardcoded in source files, compiled into the bundle | N/A — identical for everyone | N/A — same for everyone, always |
| Dashboard stats, achievements, submission history | Hardcoded in source files | N/A | N/A — same for everyone, always |
| Everything in a `<Dialog>`/tab/sidebar open-or-closed | Local `useState` inside that one component | ❌ No | ❌ No |

This table is the single clearest way to see the gap that [docs/ROADMAP.md](../ROADMAP.md) exists
to close: nearly every row in the "survives refresh / shared across devices" columns needs to
become "yes" before courses, ebooks, or AI agents can actually be *sold* and tracked per real
customer — which is precisely why that roadmap's early phases (4 onward) introduce Supabase.

## 17.4 Request/response lifecycle for a typical page visit

```
1. Browser requests https://whyai.co.in/practice
2. Vercel's rewrite rule (vercel.json, Ch.3 §3.4) serves index.html regardless of the path
3. Browser downloads & runs main.tsx's bundle
4. React renders App → AuthProvider → Router
5. React Router reads window.location, sees "/practice", matches the PracticePage route
6. PracticePage's component function runs, setting up its hardcoded mockProblems state
7. Browser paints the page — total round trips to ANY server: one (the initial file download)
8. Every subsequent click (selecting a problem, typing code, clicking "Run Code") is handled
   entirely by JavaScript already loaded in the browser — zero further network requests happen,
   because there is nothing on a server to request from yet
```

Compare this to Book 2's Chapter on latency: once a real backend exists, steps 6 and 8 start
involving real network round-trips (fetching real course data, submitting real code to a real
execution service, etc.), and that's exactly where the performance considerations in Book 2 start
to matter.

## 17.5 Build-time vs run-time, one more time

It's worth being explicit about this distinction since it comes up throughout this book:
**build-time** is when `npm run build` (or `npm run dev`) runs on a developer's or Vercel's
machine, converting source `.tsx`/`.ts`/`.css` files into the bundle a browser can run.
**Run-time** is everything that happens afterward, inside a visitor's own browser, once that bundle
is loaded. Nothing described as "state," "click," "render," or "navigate" anywhere in this book
happens on a server — today, there is no server-side run-time at all for this application, only
build-time (Vite) and client-side run-time (the browser).
