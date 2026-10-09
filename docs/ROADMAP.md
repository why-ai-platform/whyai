# WhyAI — Development Roadmap

> Living document. Check off items as they ship. One checklist item = one feature branch = one local
> verification pass = one PR. Don't batch unrelated items into a single branch/PR.

## 0. Current State (as of 2026-10-09)

- **Frontend only.** Vite + React 18 + TypeScript + Tailwind + shadcn/ui (Radix) + React Router v6 +
  Framer Motion ("motion") + Recharts + Sonner. Deployed to Vercel as a static SPA
  ([vercel.json](../vercel.json) rewrites everything to `index.html`).
- **No backend, no database, no payments.** `src/utils/api.ts` is all stubs returning `[]`/`null`.
- **Auth is fake.** [AuthContext.tsx](../src/contexts/AuthContext.tsx) accepts any email/password,
  holds a user object in memory only — refreshing the page logs you out.
- **Pages that exist:** landing, courses (list + sidebar tabs + `CourseViewer` + `LearningPath`),
  practice (LeetCode-style UI, mock run output), dashboard (mock stats), profile (mock settings),
  news (list + detail), contests (list + detail, placeholder).
- **Course content:** only course id `1` ("Introduction to AI") has real lesson content in
  [courseContent.ts](../src/pages/courses/viewer/courseContent.ts), rendered via
  `dangerouslySetInnerHTML` — fine while only the owner authors it, a real risk later (see §6).
- **Git workflow already in use:** feature branches → PR → `dev` and/or `main` (see recent history:
  `dev`, `test/my-first-change`, `1-not-responsive-in-playground`).

## 1. The Goals

**Three product pillars**, in priority order:

1. **AI & Agents courses** — the core learning product (already scaffolded, needs real content + a
   dedicated Agentic AI / "build your own agent" track).
2. **Sell eBooks** — a digital storefront for AI/ML ebooks.
3. **Sell AI Agents** — a marketplace for pre-built agents/templates customers can buy.

**Three cross-cutting qualities** the product must have as it grows — these aren't separate
features, they're requirements woven into how every phase above gets built:

4. **Flexible, scalable, market-adaptable** — adding a new course category, pricing model, product
   type, or payment provider later should be config/data changes, not rewrites (§5).
5. **Secure by design** — payments, user data, downloadable content, and (eventually) third-party
   agent code all carry real risk; mitigations are mapped to the phase that introduces each risk (§6).
6. **Full user tracking & analytics** — know what pages/products users actually engage with and
   where they drop off before buying, across the whole funnel (§7, Phase 4 + Phase 8).

Explicit instruction from the project owner: **start from the most basic working version of each
pillar, verify it locally in the browser, merge it, then layer on the next increment.** No big-bang
backend rewrite before anything is sellable.

## 2. Architecture decisions (assumed defaults — flag if you want to change these)

| Decision | Default | Why | Swap cost later |
|---|---|---|---|
| Backend/DB/Auth | **Supabase** (Postgres + Auth + Storage) | Already referenced as "planned" in 3 existing TODO comments in the repo; no server to run/host for an MVP | Low — it's just Postgres + REST/JS client behind `src/utils/api.ts` |
| Payments (v0) | **Payment links** (Stripe Payment Links *or* Razorpay Payment Pages) — no checkout code at all | Fastest path to a real sale; zero backend needed | N/A, replaced in v1 |
| Payments (v1) | **Stripe Checkout** (or Razorpay if the business is India-only), behind a provider-agnostic interface | Webhooks give a reliable "payment succeeded" event; the interface is what makes it swappable (§5) | — |
| Course/ebook/agent content before DB exists | **Static TS/JSON files** (same pattern as `courseContent.ts`) | Matches existing convention, zero infra | Migrate rows into Supabase tables in one script later |
| Code execution (Practice) | Stays **simulated** for now | Real sandboxed execution (Judge0/Piston) is a big lift unrelated to the 3 revenue pillars | Separate phase, deprioritized |
| Analytics | **PostHog** (self-hostable or cloud free tier) | One tool gives pageviews/events/funnels/session replay *and* feature flags — doubles as the flexibility lever in §5 | Medium — event-tracking calls are a thin wrapper either way |

**Open question for the project owner** (not blocking — pick the default and move on if no reply):
Stripe vs Razorpay for payments. Razorpay is the stronger fit if customers are India-only (UPI
support); Stripe is simpler if you expect international buyers. This only matters starting Phase 3.

## 3. Non-goals for now

Explicitly out of scope until the 3 pillars have a working v1: native mobile app, real-time contest
leaderboards, in-browser real code execution, AI chat tutor, multi-agent hosted execution runtime,
discussion forums/comments, i18n.

## 4. Non-goals doesn't mean "ignore" — cross-cutting work is scheduled, not deferred to the end

Goals 4–6 are deliberately **not** one giant phase at the end. Flexibility is a set of design rules
applied from Phase 1 onward (§5), security items are inserted into the exact phase that introduces
each risk (§6), and analytics gets a lightweight v0 as soon as there's real traffic to measure
(Phase 4) with a full v1 later (Phase 8) — see the checklists below.

---

## 5. Flexibility, scalability & market-adaptability — design rules

Applied across every phase, not a standalone feature:

- **Provider-agnostic interfaces, not direct SDK calls scattered through components.** Payments,
  auth, and analytics each get one thin wrapper module (`src/lib/payments.ts`,
  `supabaseClient.ts`, `analytics.ts`). Components call the wrapper; swapping Stripe→Razorpay or
  PostHog→GA4 later means editing one file, not every page.
- **Data-driven content over hardcoded content.** Courses/ebooks/agents already follow this
  (`courseContent.ts`, `ebookData.ts`, `agentData.ts` → later Supabase `products` table). Keep new
  product types (e.g. a future "cohort/live class" pillar) fitting the same `products` shape instead
  of inventing a parallel system each time.
- **Feature flags for anything market-facing you're not sure about.** New pricing experiment, a
  course paywall, a new catalog layout — ship it behind a PostHog feature flag so it can be toggled
  or A/B tested without a redeploy. This is why PostHog was picked for analytics (§2): flags and
  analytics share one tool.
- **Config over code for pricing/regional variants.** Prices, currency, and available payment
  providers live in the `products` table / a small config object, not inline in JSX, so adding
  INR/USD pricing or a new region doesn't touch component code.
- **Keep the commerce engine (Phase 6) generic from day one.** `products.type` (`ebook`|`agent`|
  `course`) is the extension point for any future 4th pillar — design the `orders`/`products` schema
  so adding a new product type is a new enum value, not a new table + new checkout flow.
- **Decouple deployment from domain.** Already true (Vercel + rewrites) — just don't hardcode
  `whyai.co.in` anywhere; use `window.location`/env-based base URLs so staging/preview deployments
  keep working.

---

## 6. Security — major risks and where each is addressed

| # | Risk | Mitigation | Addressed in |
|---|---|---|---|
| 1 | Course/ebook/agent descriptions rendered via `dangerouslySetInnerHTML` → XSS if content ever comes from anywhere but the owner's own commit (a future admin UI, user reviews, agent descriptions from a third-party seller) | Sanitize with DOMPurify before render now, even for owner-authored content — habit beats remembering to add it later | Phase 1 (`feat/sanitize-lesson-html`) |
| 2 | Fake auth today; once real, weak session handling (XSS-stealable tokens, no session expiry) | Use Supabase's managed session handling (secure storage, refresh tokens), never roll your own token storage in plain `localStorage` | Phase 5 (Auth) |
| 3 | Database wide open to any authenticated (or anonymous) client once Supabase is live | **Row Level Security (RLS) policies on every table from the first migration** — users can only read/write their own rows; product/course content is public-read, admin-write only | Phase 5 (Auth) + Phase 6 (`feat/db-schema-products-orders` ships with RLS, not added after) |
| 4 | Payment/webhook spoofing — someone calls your "mark order paid" endpoint directly without actually paying | Verify Stripe/Razorpay **webhook signatures** server-side (Supabase Edge Function/Vercel Function), never trust a client-side "I paid" callback | Phase 6 (`feat/stripe-checkout-integration`) |
| 5 | You never touch card data (PCI scope) — but make sure it stays that way | Stripe/Razorpay hosted Checkout/Payment Links only; never build a custom card form | Phase 2/3 (v0) and Phase 6 (v1) — already the plan, call it out explicitly |
| 6 | Ebook/agent files pirated via a leaked permanent URL | **Signed URLs with short expiry** from Supabase Storage, generated per-request after a verified purchase, not a static public link | Phase 6 (`feat/purchase-gated-downloads`) |
| 7 | **Agent marketplace supply-chain risk**: if "AI Agents" ship as downloadable code/scripts, a malicious or buggy agent could harm the buyer's machine/accounts, or a buyer could upload something to be resold | Manually review every agent before listing (v0); any future "agent demo runs on our infra" feature must execute in a sandboxed, network/credential-isolated environment — never `eval`/execute agent code directly in the main app | Phase 3 (listing policy) + flagged as a hard requirement if a "run this agent for me" feature is ever built |
| 8 | Secrets leakage (Supabase service key, Stripe secret key) | Keys only in `.env.local` / Vercel project env vars, never in client bundle (service-role keys are server-only, used in Edge/Vercel Functions, never in `VITE_*` vars which ship to the browser) | Phase 0 (`.env.example`) through Phase 6 |
| 9 | Dependency vulnerabilities (86+ npm packages already, more coming) | `npm audit` + Dependabot/Renovate enabled on the repo, checked in CI | Phase 0 (`chore/ci`) |
| 10 | Brute-force login / credential stuffing | Rely on Supabase Auth's built-in rate limiting; add a CAPTCHA on signup if abuse appears | Phase 5 (Auth), revisit post-launch |
| 11 | Analytics/tracking (goal 6) collecting personal data without consent → legal exposure (India's DPDP Act / GDPR if any EU users) | Cookie/consent banner before any tracking script loads; anonymize IP in PostHog config; publish a privacy policy page | Phase 4 (`feat/analytics-consent-banner`) |
| 12 | CORS/CSRF on any serverless function (webhooks, future admin actions) | Lock Edge/Vercel Function CORS to known origins; webhooks authenticate via signature, not cookies, so CSRF doesn't apply to them | Phase 6 |

---

## 7. Analytics & user tracking — what "complete" means here

Two passes, not one big bang (same incremental philosophy as the product pillars):

- **v0 (Phase 4, right after the first sellable v0s exist in Phases 2–3):** pageview tracking on
  every route, plus the handful of events that actually matter for a pre-revenue check: `signup`,
  `login`, `course_view`, `lesson_complete`, `product_view` (ebook/agent), `buy_click` (did they even
  click "Buy now"?). This is enough to see where people fall off *before* investing in Phase 8.
- **v1 (Phase 8, after auth + commerce v1 exist):** full funnel (landing → catalog → detail → buy
  click → payment success, broken down by product), session replay for UX debugging, cohort
  retention for course engagement, and a lightweight internal dashboard (PostHog's own UI is enough
  to start — no need to build a custom one).

---

## Phase 0 — Repo hygiene (branch: `chore/*`)

Small, no-risk groundwork so later phases aren't fighting the tooling.

- [ ] `chore/lint-format`: Add ESLint + Prettier config matching the existing code style; `npm run lint`.
- [ ] `chore/env-example`: Add `.env.example` documenting future `VITE_SUPABASE_URL`,
      `VITE_SUPABASE_ANON_KEY`, etc. Add `.env*.local` to `.gitignore` if not already covered.
- [ ] `chore/ci`: Add a GitHub Actions workflow that runs `npm run build` + `npm audit` on every PR
      into `dev`/`main` (catches broken builds *and* known-vulnerable dependencies before merge —
      currently nothing does this). Security risk #9.

**Verify locally:** `npm run lint` and `npm run build` both pass clean.
**Merge:** each item is its own PR into `dev`.

---

## Phase 1 — Finish the AI & Agents course content (Pillar 1, v0)

No backend changes. Just fill in what's already stubbed, because this is the core product.

- [ ] `feat/sanitize-lesson-html`: Add DOMPurify around the `dangerouslySetInnerHTML` call in
      `CourseViewer` before adding any more lesson content. Security risk #1 — cheap to fix now,
      expensive to remember later once there's more HTML to retrofit.
- [ ] `feat/course-content-ml-fundamentals`: Write real lessons for course `2` (Machine Learning
      Fundamentals) in `courseContent.ts`, following the structure already used for course `1`.
- [ ] `feat/course-content-deep-learning`: Same for course `3` (Deep Learning).
- [ ] `feat/course-content-nlp` / `feat/course-content-cv` / `feat/course-content-genai`: Same for
      courses `4`, `5`, `6`.
- [x] `docs/book-3-agentic-ai-and-agents/` written: the full Agentic AI curriculum draft (12
      chapters — agent architecture, planning/reasoning, tool use, memory, multi-agent systems,
      frameworks, safety/evaluation, monetizing agents, and a working capstone agent). This is the
      content source for the item below.
- [x] `feat/course-content-agentic-ai`: Transcribed into 11 real lessons + 1 locked "coming soon"
      lesson in `courseContentData['7']`, live and unlocked on `/courses`. `CourseViewer.tsx` was
      also rebuilt as a persistent-sidebar, one-chapter-at-a-time layout (not the original
      single-column viewer) — see Book 1 Ch.11 §11.2 for the current shape, and
      [`docs/book-3-agentic-ai-and-agents/13-course-v2-spec.md`](../docs/book-3-agentic-ai-and-agents/13-course-v2-spec.md)
      for the owner's fuller W3Schools-parity vision (nested chapters, quizzes, exercises, real
      Python execution, 21-topic curriculum) — deliberately phased as future work, not built yet.
- [ ] `feat/course-content-rl`: Same for course `8`.
- [ ] `feat/course-progress-localstorage`: Track lesson-completion/progress in `localStorage` keyed by
      course id (no backend yet) so the progress bars on the Courses page and Dashboard stop being
      hardcoded `0`.

**Verify locally:** open `/courses`, click into each course, confirm lessons render (and that
sanitized HTML still renders correctly — formatting, no stripped tags that should survive), mark
lessons complete, refresh and confirm progress persists (localStorage step only).
**Merge:** one PR per course into `dev`.

---

## Phase 2 — eBook Store v0 (Pillar 2, fastest path to a real sale)

Goal: a customer can actually pay you for an ebook this phase. No Supabase, no custom checkout yet.

- [ ] `feat/ebook-catalog-page`: New `/ebooks` route + page. Static data file `src/pages/ebooks/ebookData.ts`
      (title, description, cover image, price, a Stripe/Razorpay **payment link** URL per ebook — created
      manually in the Stripe/Razorpay dashboard, no API integration needed yet).
- [ ] `feat/ebook-detail-page`: `/ebooks/:id` detail page with description, table of contents, "Buy now"
      button that opens the payment link in a new tab.
- [ ] `feat/ebook-delivery-v0`: After payment, the provider's payment-link confirmation page shows a
      direct download link (Stripe/Razorpay both support this natively) **or** you email the PDF
      manually for the first few sales. Document this manual step in `docs/ROADMAP.md` so it isn't lost.
      Never put a permanent public download URL directly in the repo/catalog page — security risk #6.
- [ ] `feat/ebook-nav-entry`: Add "eBooks" to the navbar and landing page features section.

**Verify locally:** browse `/ebooks`, open a detail page, click "Buy now," confirm it lands on the
real payment link (use a test-mode link while verifying).
**Merge:** one PR per item into `dev`. This phase can ship and start earning before Phase 5 (real auth)
exists at all.

---

## Phase 3 — AI Agents Marketplace v0 (Pillar 3, same pattern as Phase 2)

Reuse everything learned in Phase 2 — the goal is to not build two different systems.

- [ ] `feat/agents-catalog-page`: `/agents` route. Static data file `src/pages/agents/agentData.ts`
      (name, description, category, price, demo video/GIF, payment link, delivery note — e.g. "a GitHub
      repo invite" or "a Notion template link" for v0 delivery).
- [ ] `feat/agents-detail-page`: `/agents/:id` detail page with a demo (video/GIF/screenshot), feature
      list, "Buy now" → payment link.
- [ ] `feat/agents-delivery-v0`: Manual delivery for first sales (send repo access / template link by
      email), same honest documentation as the ebook delivery step. Every agent listed must be manually
      reviewed by the owner before publishing — security risk #7 (supply-chain risk to the buyer).
- [ ] `feat/agents-nav-entry`: Add "AI Agents" to navbar + landing page.

**Verify locally:** same checklist shape as Phase 2.
**Merge:** one PR per item into `dev`.

At the end of Phase 3, all three pillars have a **real, sellable v0** with zero backend. This is the
milestone to pause on and get actual customer feedback before investing further.

---

## Phase 4 — Baseline analytics & tracking (v0)

Now that Phases 2–3 generate real traffic worth measuring, add lightweight tracking before building
anything else — flying blind on a storefront wastes the traffic you already have.

- [ ] `feat/analytics-setup`: Add PostHog (cloud free tier to start), wrap it in `src/lib/analytics.ts`
      (one `track(event, props)` function — never call the PostHog SDK directly from components, so
      swapping providers later stays a one-file change, per §5).
- [ ] `feat/analytics-consent-banner`: Cookie/consent banner gating when tracking actually starts;
      add a short `/privacy` page. Security/legal risk #11 — do this *before* shipping tracking, not
      after.
- [ ] `feat/analytics-pageviews`: Auto-track a pageview event on every React Router navigation.
- [ ] `feat/analytics-core-events`: Instrument `signup`, `login`, `course_view`, `lesson_complete`,
      `product_view` (ebook/agent), `buy_click` using the same `track()` wrapper.

**Verify locally:** open the PostHog project dashboard, perform each tracked action in the running
app, confirm the event shows up live. Confirm declining the consent banner stops events from firing.
**Merge:** one PR per item into `dev`.

---

## Phase 5 — Real Auth (Supabase)

Needed before we can gate paid content automatically and show "my purchases"/"my progress" across
devices.

- [ ] `feat/supabase-setup`: Create Supabase project, add `src/utils/supabaseClient.ts`, wire env vars
      via `.env.local` (never commit keys — security risk #8).
- [ ] `feat/auth-signup-login`: Replace the mock `login`/`signup` in `AuthContext.tsx` with real
      Supabase Auth calls (email/password to start; OAuth providers later).
- [ ] `feat/auth-session-persistence`: Use Supabase's session listener so refreshing the page keeps you
      logged in. Security risk #2 — rely on Supabase's managed session storage, don't hand-roll it.
- [ ] `feat/auth-protected-routes`: Wire the already-existing route guards (Dashboard/Profile) to the
      real `isAuthenticated` state instead of the mock one.
- [ ] `feat/auth-logout-everywhere`: Confirm logout clears session + redirects correctly from every page.
- [ ] `feat/db-rls-baseline`: Turn on Row Level Security on every table as it's created, with a
      default-deny policy plus explicit "own rows only" policies. Security risk #3 — do this in the
      same PR as each `CREATE TABLE`, never as a follow-up.

**Verify locally:** signup a real test account, confirm row appears in Supabase, log out, log back in,
refresh mid-session, confirm Dashboard/Profile stay accessible only when logged in. Try querying
another user's row from the browser console with your own session — confirm RLS blocks it.
**Merge:** one PR per item into `dev`.

---

## Phase 6 — Unified commerce engine (v1 for Pillars 2 & 3)

Replace the manual-delivery v0 with one shared system so ebooks and agents don't duplicate logic.

- [ ] `feat/db-schema-products-orders`: Supabase tables: `products` (type: `ebook`|`agent`|`course`,
      title, price, description, asset_url), `orders` (user_id, product_id, status, provider_ref) —
      ships with RLS from the start (public can read published products; only the owner/service role
      can write; a user can only read their own `orders` rows). Keep `products.type` as the extension
      point for any future product category, per §5.
- [ ] `feat/payments-provider-interface`: A small `src/lib/payments.ts` interface (`createCheckout`,
      `verifyWebhook`) implemented for Stripe (or Razorpay) — components/pages call the interface, not
      the SDK directly, per §5.
- [ ] `feat/stripe-checkout-integration`: Real Stripe (or Razorpay) Checkout session creation + webhook
      endpoint (Vercel Function or Supabase Edge Function — still no separate backend server to host).
      Verify the webhook signature server-side before trusting it — security risk #4.
- [ ] `feat/purchase-gated-downloads`: Webhook marks the `orders` row paid → **short-lived signed**
      Supabase Storage URL unlocks the ebook PDF / agent package automatically. Security risk #6.
- [ ] `feat/my-library-page`: New section on `/profile` ("My Purchases") listing bought ebooks/agents
      with their download links.
- [ ] `feat/migrate-ebook-agent-static-data`: Move `ebookData.ts` / `agentData.ts` rows into the
      `products` table via a one-off script; catalog pages read from Supabase instead of static files.
- [ ] `feat/analytics-purchase-events`: Track `checkout_started` and `purchase_completed` (with
      product id/type, not raw payment details) through the same analytics wrapper from Phase 4.

**Verify locally:** use Stripe/Razorpay test mode end-to-end: buy a test ebook, confirm the webhook
signature check rejects a forged request and accepts a real one, confirm it appears in "My Purchases"
with a working (and expiring) download link, confirm the purchase event shows up in PostHog.
**Merge:** one PR per item into `dev`. This phase is the biggest — don't let it block Phases 1–4.

---

## Phase 7 — Course progress → Supabase (Pillar 1, v1)

Now that auth + a database exist, move course progress off `localStorage`.

- [ ] `feat/db-schema-courses-progress`: `course_progress` table (user_id, course_id, lesson_id,
      completed_at), RLS: a user can only read/write their own rows.
- [ ] `feat/course-progress-sync`: Courses/Dashboard read progress from Supabase when logged in, fall
      back to `localStorage` for guests.
- [ ] `feat/course-paywall` (optional): If some courses become paid, reuse the `products`/`orders`
      tables from Phase 6 to gate advanced courses behind purchase.

**Verify locally:** complete a lesson while logged in, confirm it's in the DB, log in on a different
browser profile, confirm progress follows the account.
**Merge:** one PR per item into `dev`.

---

## Phase 8 — Full analytics, funnels & dashboards (v1)

Builds on the Phase 4 baseline now that there's a real signup/purchase funnel to analyze.

- [ ] `feat/analytics-full-funnel`: Build the landing → catalog → detail → buy_click →
      checkout_started → purchase_completed funnel per product type in PostHog.
- [ ] `feat/analytics-session-replay`: Turn on session replay (consent-gated, same banner as Phase 4)
      for UX debugging on the storefront and course viewer.
- [ ] `feat/analytics-retention`: Course-engagement cohort/retention view (lesson completions over
      time per user segment).
- [ ] `feat/analytics-dashboard-review`: Set up a saved PostHog dashboard the owner actually checks
      weekly — no value in collecting data nobody looks at.

**Verify locally:** generate a handful of real test events across the funnel, confirm the funnel/
retention views in PostHog populate correctly and match what was actually clicked.
**Merge:** one PR per item into `dev`.

---

## Phase 9 — Practice platform, polish, and launch (backlog, lower priority)

Only after Pillars 1–3 have real v1s and real users:

- [ ] `feat/practice-real-execution`: Integrate Judge0 or Piston for real code execution (replaces the
      simulated run output) — run untrusted user code in the provider's sandbox, never execute it
      directly on your own infra.
- [ ] `feat/contests-mvp`: Decide if contests ship at all for v1; if yes, wire real problems + a simple
      leaderboard.
- [ ] `feat/seo-meta`: Per-page `<title>`/meta tags, OG images for course/ebook/agent detail pages.
- [ ] `feat/domain-cutover`: Point `whyai.co.in` at the Vercel deployment, update Supabase/Stripe/
      PostHog redirect URLs and allowed origins.
- [ ] `feat/zoho-email` (optional): Set up org email via Zoho for support/delivery emails.
- [ ] `chore/security-pass`: Re-review the table in §6 against what's actually shipped; file any gaps
      as new checklist items before public launch.

---

## 10. Workflow for every single checklist item above

1. Branch off `dev`: `git checkout -b <branch-name-from-the-checklist-item>`.
2. Implement **only that item** — resist pulling in the next checklist item "while you're in there."
3. Run it locally (`npm run dev`), click through the actual change in the browser. For anything
   UI-visible, get a visual confirmation (screenshot or the project owner's own check) before moving on.
4. Check the box in this file (`docs/ROADMAP.md`) in the same PR.
5. Open a PR into `dev` with a short description of what was verified.
6. Only after `dev` accumulates a stable set of phase items does `dev` get merged into `main` for
   deployment — matching the pattern already visible in this repo's git history.

## 11. Immediate next action

Start at **Phase 1 → `feat/sanitize-lesson-html`**, then `feat/course-content-agentic-ai` (or Phase 2's
catalog page, if the owner wants a sellable thing live before writing more course content) — all are
unblocked right now and need zero new infrastructure.
