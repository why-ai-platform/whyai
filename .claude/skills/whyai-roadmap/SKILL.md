---
name: whyai-roadmap
description: Use when working on the WhyAI repo (AI/agents courses, ebook store, AI agent marketplace, plus the cross-cutting flexibility/security/analytics requirements) to pick up the next item in docs/ROADMAP.md, implement it on its own branch, verify it locally, and merge it one feature at a time. Triggers on requests like "next roadmap item", "continue the whyai plan", "work on the ebook store", "work on the agents marketplace", "add analytics tracking", "security review of whyai", or any WhyAI feature request that doesn't name a specific existing bug.
---

# WhyAI incremental delivery

This repo is built one small, locally-verified feature at a time — never a big batch of unrelated
changes in one branch. The full plan lives in [`docs/ROADMAP.md`](../../../docs/ROADMAP.md); read it
first, every time, since it's a living document and checkboxes change.

## Process

1. **Read `docs/ROADMAP.md` in full.** Find the first unchecked `- [ ]` item, respecting phase order
   (don't jump ahead to Phase 5 while Phase 1 items sit unchecked) unless the user explicitly asks for
   a specific later item by name.
2. **Confirm scope with the user in one line** if the item is ambiguous (e.g. "Agentic AI" curriculum
   content requires judgment calls about what to teach) — otherwise just proceed, this is a solo
   project and most items are unambiguous.
3. **Branch**: `git checkout -b <the-branch-name-given-in-the-checklist-item>` off `dev` (create `dev`
   locally tracking `origin/dev` if it doesn't exist yet). Never commit directly to `main`.
4. **Implement only that one checklist item.** If you notice related work worth doing, add it as a new
   checklist item in `docs/ROADMAP.md` under the right phase instead of doing it now.
5. **Verify locally before claiming done:**
   - Run `npm run dev` (or `npm run build` for a final check) and confirm it compiles.
   - For anything UI-visible, actually look at it — use the `run` skill to launch the dev server and
     screenshot the affected page(s), or walk the user through what to click if they'd rather check
     themselves. Don't report a UI change as working without having seen it render.
   - For anything touching data persistence (localStorage now, Supabase from Phase 5 onward), verify
     the round-trip: write it, reload, confirm it's still there.
   - Never fabricate verification — if you couldn't actually run it (e.g. sandboxed, no network), say
     so plainly instead of claiming it was checked.
6. **Check the box** for that item in `docs/ROADMAP.md` as part of the same change.
7. **Log it in `CHANGELOG.md`** (repo root) — one entry per shipped item, same change as step 6. See
   "Change tracking" below; this is non-negotiable, the owner asked for a running record of every
   change so progress is visible without digging through git log or PR history.
8. **Commit and open a PR into `dev`** (not `main`) with a description naming what was verified. Do
   not merge the PR yourself — this project merges after the owner reviews, per its existing workflow.
9. **Stop after one item** and report back, unless the user explicitly asked to keep going through
   several items in one sitting.

## Change tracking (every change, no exceptions)

The owner wants a standing record of what's changed, kept up to date as it happens — not
reconstructed later from memory or git log. `CHANGELOG.md` at the repo root is that record:

- Every PR that ships a roadmap item adds one entry under an `## [Unreleased]` section at the top:
  date, the roadmap item's branch/checklist name, a one-line description of what actually changed,
  and which files/areas it touched. Keep entries terse — this is a log, not a report.
- This applies to *every* change, not just roadmap items: config edits, dependency bumps, hotfixes,
  anything touching the repo gets a line, even a one-off typo fix.
- When `dev` is merged into `main` for a release, move the accumulated `[Unreleased]` entries under a
  new dated version heading (`## [YYYY-MM-DD]`) in the same PR — don't let entries pile up unlabeled.
- Never silently skip this step to save time; if a change is genuinely too trivial to log (e.g. a
  typo in a comment with no behavioral effect), say so explicitly rather than omitting the entry
  without comment.

## Hard rules specific to this repo

- Never commit secrets. Supabase/Stripe/Razorpay keys go in `.env.local` (gitignored), referenced via
  `.env.example` placeholders only.
- Phases 2–3 (ebook/agent store v0) are intentionally backend-free — don't "improve" them by jumping to
  Supabase/Stripe integration early; that's Phase 6 on purpose, so the owner can start selling before
  any infra exists.
- Keep ebook and agent product data/components structurally parallel (same shape for catalog/detail/
  buy-flow) — Phase 6 unifies them into one commerce engine, which is much easier if they didn't drift
  apart in Phases 2–3.
- If an architectural default in `docs/ROADMAP.md` §2 (Supabase, Stripe vs Razorpay, static-data-first)
  needs to change, update that table and say so explicitly — don't silently switch approaches mid-phase.
