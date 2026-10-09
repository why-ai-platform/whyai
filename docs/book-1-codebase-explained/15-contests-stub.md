# Chapter 15: Contests (Unfinished)

Both files in [pages/contests/](../../src/pages/contests/) are placeholders, in full:

```tsx
// pages/contests/index.tsx
export function ContestsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Contests</h1>
      <p>AI/ML coding contests and competitions</p>
    </div>
  );
}
```

```tsx
// pages/contests/ContestDetail.tsx
export function ContestDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Contest Detail</h1>
      <p>Contest problems, leaderboard, timer, and rankings</p>
    </div>
  );
}
```

Neither has any state, any data, or any logic beyond a heading and one line of description text.
`ROUTES.CONTESTS` and `ROUTES.CONTEST_DETAIL` exist in [constants/index.ts](../../src/constants/index.ts)
(Chapter 5 §5.2), but **no `<Route>` in `App.tsx` uses either constant** (Chapter 5 §5.1) — so even
typing `/contests` directly into the browser's address bar does not reach this file at all; it hits
`App.tsx`'s catch-all route instead and gets redirected straight to the home page (Chapter 5 §5.1,
step 7).

`types/index.ts`'s shared `Contest` interface (id, title, description, startTime, endTime,
problems, participants — Chapter 5 §5.3) and `Submission` interface were both evidently designed
with a contest feature in mind, but neither type is imported or used by these two files, or
anywhere else in the project.

The `Trophy`/"Contests & Practice" mention in `Hero.tsx`'s decorative feature row (Chapter 10 §10.1)
and the "Weekly Contests, Leaderboards, Prizes" bullet list in `FeaturesSection.tsx` (Chapter 10
§10.4) are both purely marketing copy describing a feature that does not exist behind them yet.

[docs/ROADMAP.md](../ROADMAP.md) Phase 9 (`feat/contests-mvp`) explicitly treats this as an open
decision rather than an assumed requirement: "Decide if contests ship at all for v1" — building out
these two files is one option; deleting them and the associated marketing copy, to stop promising a
feature that isn't being prioritized, is an equally valid option, since contests aren't one of the
three revenue pillars the project owner set as the priority (courses, ebooks, AI agents).
