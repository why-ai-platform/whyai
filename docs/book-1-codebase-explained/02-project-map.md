# Chapter 2: The Complete Project Map

Every file under `src/`, what it's for, and — importantly — whether it's actually used by the
running app or not. A file existing in the folder does **not** mean it's reachable; Chapter 19
collects every "exists but unused" finding from this map in one place.

Legend: ✅ live (reachable from the app a visitor uses) · 🟡 orphaned (exists, compiles, but nothing
currently imports/routes to it) · 📄 data file (no UI, just content/config) · 📝 project doc (not
app code).

```
whyai/
├── index.html                      ✅ the one HTML page ever served (Ch.4)
├── package.json                    ✅ dependency list + npm scripts (Ch.3)
├── package-lock.json               📄 exact installed dependency versions, auto-generated
├── vite.config.ts                  ✅ build tool configuration (Ch.3)
├── vercel.json                     ✅ deployment configuration for Vercel hosting (Ch.3)
├── README.md                       📝 project overview + original to-do roadmap
├── docs/                           📝 this book, Book 2, docs/ROADMAP.md, CHANGELOG.md
├── .claude/skills/whyai-roadmap/    📝 the AI-assistant workflow skill for this repo
│
└── src/
    ├── main.tsx                    ✅ JavaScript entry point (Ch.4)
    ├── App.tsx                     ✅ root component: routing table (Ch.5)
    ├── index.css                   ✅ compiled Tailwind CSS, imported by main.tsx (Ch.16)
    ├── logo.png                    ✅ the WhyAI logo image, used by Navbar & Footer
    ├── Attributions.md             📝 credits shadcn/ui + Unsplash (this was exported from a
    │                                  tool called "Figma Make" — explains some patterns below)
    ├── IMPLEMENTATION_SUMMARY.md   📝 an earlier author's feature-completion notes
    ├── PROJECT_STRUCTURE.md        📝 an earlier author's folder-structure notes
    │
    ├── guidelines/
    │   └── Guidelines.md           📝 empty template, never filled in
    │
    ├── styles/
    │   └── globals.css             🟡 orphaned — a Tailwind v4 *source* file with the light/dark
    │                                  design-token definitions, but nothing imports it (Ch.16)
    │
    ├── types/
    │   └── index.ts                ✅ shared TypeScript types: User, Course, Lesson, Problem,
    │                                  Contest, Submission (Ch.5) — note: several of these types
    │                                  are not yet used by any real component
    │
    ├── constants/
    │   └── index.ts                ✅ ROUTES (every URL path), difficulty/level enums, AI_CATEGORIES
    │                                  (Ch.5)
    │
    ├── utils/
    │   └── api.ts                  ✅ (imported nowhere today, but documents the planned shape)
    │                                  stub functions for a future backend — every function
    │                                  returns `[]` or `null` right now (Ch.5)
    │
    ├── hooks/
    │   └── useDarkMode.ts          ✅ dark-mode state + localStorage persistence (Ch.7)
    │
    ├── contexts/
    │   └── AuthContext.tsx         ✅ fake/mock login-signup-logout state (Ch.6)
    │
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx          ✅ top navigation bar, every page (Ch.8)
    │   │   ├── Footer.tsx          ✅ bottom footer, every page (Ch.8)
    │   │   └── BreadcrumbNav.tsx   ✅ "Home / Courses / ..." trail, used on several pages (Ch.8)
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx ✅ `<img>` wrapper that shows a placeholder on load failure
    │   │                              (Ch.8) — "figma" in the path is a leftover from the export
    │   │                              tool, not a reference to any Figma-specific behavior
    │   └── ui/                     ✅ 48 small UI building blocks (buttons, dialogs, cards, ...)
    │                                  — one shared pattern, covered once in Ch.9 with a full
    │                                  reference table rather than 48 separate write-ups
    │
    └── pages/
        ├── landing/
        │   ├── index.tsx           ✅ LandingPage — composes the 3 sections below (Ch.10)
        │   ├── Hero.tsx            ✅ animated headline + CTA buttons (Ch.10)
        │   ├── LoginDialog.tsx     ✅ the login/signup popup, used from Navbar and Hero (Ch.10)
        │   ├── NewsSection.tsx     ✅ "Latest AI News" preview cards on the landing page (Ch.10)
        │   └── FeaturesSection.tsx ✅ "Everything You Need" feature showcase (Ch.10)
        │
        ├── courses/
        │   ├── index.tsx           ✅ CoursesPage — course catalog + Playground/Dashboard tabs
        │   │                          (Ch.11)
        │   ├── viewer/
        │   │   ├── CourseViewer.tsx   ✅ the lesson-by-lesson reading view (Ch.11)
        │   │   └── courseContent.ts   📄 the actual lesson text (only course id "1" is filled in)
        │   ├── CourseDetail.tsx    🟡 orphaned placeholder, no route points to it
        │   ├── CoursesLayout.tsx   🟡 orphaned — not rendered by App.tsx, AND it imports a file
        │   │                          `./Playground` that doesn't exist in this repo (Ch.19)
        │   └── LearningPath.tsx    🟡 orphaned placeholder, no route points to it
        │
        ├── practice/
        │   ├── index.tsx           ✅ PracticePage — the full LeetCode-style problem UI (Ch.12)
        │   └── ProblemSolve.tsx    🟡 orphaned placeholder, no route points to it
        │
        ├── dashboard/
        │   └── index.tsx           ✅ DashboardPage — stats, continue-learning, achievements (Ch.13)
        │
        ├── profile/
        │   └── index.tsx           ✅ ProfilePage — account info + settings tabs (Ch.13)
        │
        ├── news/
        │   ├── index.tsx           ✅ NewsPage — filterable news grid (Ch.14)
        │   ├── NewsDetail.tsx      ✅ single-article reading view (Ch.14)
        │   └── newsData.ts         📄 the 4 hardcoded news articles (Ch.14)
        │
        └── contests/
            ├── index.tsx           🟡 orphaned placeholder, no route points to it
            └── ContestDetail.tsx   🟡 orphaned placeholder, no route points to it
```

## 2.1 The short version of what's "live"

If you only remember one thing from this chapter: open [App.tsx](../../src/App.tsx) — every `<Route>`
listed there is a page a real visitor can reach. Seven pages are wired up: Home, Courses, Course
Viewer, Dashboard, Practice, Profile, News (+ News Detail). Everything else under `pages/` that
isn't in that list — `CourseDetail.tsx`, `CoursesLayout.tsx`, `LearningPath.tsx`,
`ProblemSolve.tsx`, and the entire `contests/` folder — is written but currently unreachable by a
real user, no matter what they click. That's not a bug in the sense of "something is broken" (the
app builds and runs fine) — it's unfinished scaffolding left over from earlier iterations, exactly
the kind of thing [docs/ROADMAP.md](../ROADMAP.md) Phase 9 (`contests-mvp`) plans to either finish
or deliberately delete.
