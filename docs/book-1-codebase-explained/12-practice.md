# Chapter 12: The Practice Platform

Route: `ROUTES.PRACTICE` (`/practice`) → `PracticePage`,
[pages/practice/index.tsx](../../src/pages/practice/index.tsx). (`ProblemSolve.tsx` is an orphaned
placeholder, not used — see Chapter 2 and 19.)

## 12.1 Data

`mockProblems` — 3 hardcoded `Problem` objects (id, title, difficulty, category, `solved` boolean,
description, `examples` array, `constraints` array). `defaultCode` — a hardcoded starter Python
script shown in the editor.

## 12.2 State

- `selectedProblem` — defaults to `mockProblems[0]`, changes when a different problem is clicked in
  the sidebar list.
- `code` — the editable text in the code editor, initialized to `defaultCode`.
- `output` — the text shown in the "Output" terminal panel.
- `isRunning` — disables/relabels the Run button while a (fake) run is in progress.
- `testResults` — `{ passed, total } | null`, drives the pass/fail badge next to "Output."

## 12.3 Reading navigation state

```tsx
const location = useLocation();
const fromPlayground = location.state?.fromPlayground || false;
```
This reads the router state Chapter 11 §11.1 described being attached by `CoursesPage`'s
Playground tab. `location.state?.fromPlayground` uses **optional chaining** (`?.`) — if `state` is
`undefined` (navigated here directly, not from the Playground), this short-circuits to `undefined`
instead of throwing an error trying to read `.fromPlayground` off nothing; `|| false` then supplies
a final fallback. Based on this, `breadcrumbItems` is built as either a 4-step trail (Home →
Courses → Playground → Practice) or a plain 2-step one (Home → Practice) — purely cosmetic, but a
good concrete example of a page adapting its own UI based on *how* the user arrived at it.

## 12.4 `handleRunCode` — the simulated execution

```tsx
const handleRunCode = async () => {
  setIsRunning(true);
  setOutput('Running your code...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  const mockOutput = `...hardcoded multi-line string with fake results...`;
  setOutput(mockOutput);
  setTestResults({ passed: 2, total: 3 });
  setIsRunning(false);
};
```
This is the same "fake delay, then fixed fake result" pattern as `AuthContext.login` (Chapter 6):
a 2-second artificial wait (to make the Run button's disabled/"Running..." state feel real), then
the **exact same hardcoded output text every single time**, regardless of what code is actually in
the editor. **Nothing is executed. No Python runs anywhere.** The "GPU detected: Tesla T4,"
performance numbers, and specific test failure shown are all a fixed string — a key fact worth
being explicit about, since the UI (badges saying "GPU Enabled," "Python 3.10") is otherwise
genuinely convincing. [docs/ROADMAP.md](../ROADMAP.md) Phase 9 (`feat/practice-real-execution`)
plans to replace this with a real sandboxed code-execution service (Judge0 or Piston).

`handleReset` simply restores `code` to `defaultCode` and clears `output`/`testResults`.

## 12.5 Layout

A 12-column grid: a 3-column problem list sidebar (clicking a problem calls
`setSelectedProblem(problem)`), and a 9-column main area stacked vertically — a `<Tabs>` block
(Description/Examples/Constraints/Submissions, reading from `selectedProblem`'s fields; the
"Submissions" tab is a static "coming soon" placeholder, no actual submission history exists
anywhere), then a side-by-side code editor (a plain `<textarea>` — not a real code editor like
Monaco/CodeMirror; no syntax highlighting, no line numbers) and the output terminal (a `<pre>`
block showing `output` or a placeholder string).
