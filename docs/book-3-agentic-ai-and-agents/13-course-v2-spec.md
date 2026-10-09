# Chapter 13: Course v2 — The Full W3Schools-Parity Vision (Owner's Spec)

**Status: not built.** This chapter preserves the owner's full specification for where the Agentic
AI course should eventually go, given verbatim on 2026-10-09, so it isn't lost. What's actually
live today (11 flat lessons + 1 locked "coming soon" lesson, a persistent chapter sidebar, HTML/CSS
diagrams, no stock photos — Chapters 1–12 of this book, transcribed into
`courseContentData['7']`) is a deliberately smaller v1. This chapter is the roadmap for v2, not a
description of the current state.

## The owner's full spec, preserved verbatim

> # Prompt: Build a Complete Agentic AI Course Learning Page for WhyAI
>
> I already have an existing website named **WhyAI — Easy AI Learning**. [...]
>
> *(Full text preserved in the project's working notes from the 2026-10-09 session. Summary of
> every distinct requirement below, organized so each one maps to a roadmap item.)*

## What it actually asks for, broken into separately-buildable pieces

| # | Requirement | Current state | What building it really requires |
|---|---|---|---|
| 1 | Nested chapter → multiple-lessons-per-chapter structure | Flat list of 12 lessons | A data model change: `CourseContent.lessons` becomes `CourseContent.chapters[].lessons[]`; sidebar becomes a two-level expand/collapse tree |
| 2 | Curriculum search | None | Client-side filter over chapter/lesson titles (+ maybe body text) — moderate, self-contained |
| 3 | Expand/collapse chapters, current-lesson highlight, completed indicators | Flat highlight only (no grouping to expand) | Depends on #1 |
| 4 | Course progress indicator | Done (`X/Y` + progress bar in the top bar) | — |
| 5 | Learning objectives, real-world analogies, "how it works," architecture diagrams per lesson | Diagrams: done (HTML/CSS). Objectives/analogies as a *named section* per lesson: not done | Content-writing work, same effort shape as Chapters 1–11 of this book |
| 6 | Python code examples with syntax highlighting | Plain `<pre><code>` blocks, no syntax highlighting | A real highlighter (e.g. Prism/Shiki) wired into the lesson renderer |
| 7 | "Expected output" + line-by-line code walkthroughs | Not done | Content-writing work, per lesson |
| 8 | Common mistakes section | Not done | Content-writing work, per lesson |
| 9 | Practice exercises with hints/solution-reveal | Not done | New content type + a reveal/hide UI component |
| 10 | Knowledge-check quizzes with scoring | Not done | A real quiz component (state, scoring, explanations) + quiz content per lesson |
| 11 | Copy-code button | Not done | Small, self-contained, quick to add |
| 12 | **Real Python code execution** | PracticePage's "Run Code" is explicitly mocked (Book 1 Ch.12) — same gap here | A real sandboxed execution service (Judge0/Piston or similar) — this is backend infrastructure, not a frontend task. [docs/ROADMAP.md](../ROADMAP.md) Phase 9 (`feat/practice-real-execution`) already names this exact gap for the Practice platform; a course-embedded Python runner is the same problem, not a separate one |
| 13 | Bookmarks | Not done | Needs a place to persist them — trivial once real auth/DB exist (roadmap Phase 5+), awkward before |
| 14 | 21-topic full curriculum (LLM fundamentals, Python foundations, prompt engineering, RAG, MCP, multi-agent, evaluation, security, deployment, capstone, "ebook and AI agents product") | 11 topics live, covering roughly items 1–2 and 6–11 of the 21 at a conceptual level | Substantial additional content-writing — several times the volume already written |

## Why this isn't being built in one pass

Three of this project's own standing rules, set by the owner earlier in this same project, apply
directly here:

- **"Verify each feature locally and merge one by one"** ([docs/ROADMAP.md](../ROADMAP.md) §10) —
  fourteen features bundled into one change can't be verified piece by piece.
- **"Do not add fake execution results or buttons that do nothing"** (the owner's own words, in the
  spec above) — a Python sandbox cannot be stubbed without violating this directly; it has to be a
  real backend service or not exist yet.
- **Match complexity to the stakes** — building a quiz engine, an exercise system, and a two-level
  curriculum tree all at once, untested, is exactly the kind of batch change this project's workflow
  exists to avoid.

## Proposed phasing (recommendation, not yet started)

**v2.1 — Structure, no new infrastructure needed:**
- `feat/course-chapter-lesson-tree`: restructure the data model to chapters-containing-lessons, even
  1:1 with today's content at first; sidebar becomes an expand/collapse tree.
- `feat/course-search`: client-side curriculum search.
- `feat/course-copy-code`: copy-to-clipboard button on code blocks.
- `feat/course-syntax-highlighting`: wire in a real highlighter for the existing code blocks.

**v2.2 — Content depth (same shape as Chapters 1–11 of this book, more volume):**
- Add "Learning Objectives," "Common Mistakes," and "Practical Exercise" (static, no auto-grading
  yet — just the prompt + a reveal-able written solution) sections to each existing lesson.
- Expand the curriculum toward the owner's 21-topic outline, one topic at a time, each its own
  reviewable change — not all 21 at once.

**v2.3 — Real interactivity (needs backend groundwork from [docs/ROADMAP.md](../ROADMAP.md) Phase
5+):**
- `feat/course-quiz-engine`: a real multiple-choice component with scoring + explanations.
- `feat/course-bookmarks`: needs real auth/DB to persist per-user.
- `feat/course-python-sandbox`: real code execution — the same infrastructure decision as
  [docs/ROADMAP.md](../ROADMAP.md) Phase 9's `feat/practice-real-execution`; build it once, use it
  in both places.

Nothing here is scheduled yet — this is the menu, not a commitment. Whoever picks this back up
should ask the owner which v2.x item to start on before assuming the whole list.
