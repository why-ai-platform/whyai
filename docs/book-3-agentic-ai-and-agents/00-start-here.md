# Book 3: Agentic AI — From Concepts to Your First Agent

## What this is, and its current status

This is the curriculum for WhyAI's **Agentic AI** course (course id `7` in
[`src/pages/courses/index.tsx`](../../src/pages/courses/index.tsx)) — pillar 1 of the three
product pillars, and specifically the advanced capstone of it. It explains every core agentic-AI
concept from zero, chapter by chapter, and ends with a real, working, practical project: building
your first AI agent, applied directly to WhyAI's own pillars 2 and 3 (selling eBooks and selling AI
Agents).

**Status: locked, future feature.** This book is the *content draft* for
[docs/ROADMAP.md](../ROADMAP.md) Phase 1's `feat/course-content-agentic-ai` item — the writing step,
not the shipping step. As of this chapter, the "Agentic AI" course card on the live `/courses` page
is marked `locked: true` and shows "Coming Soon" instead of "Start Course" — on purpose. The real
lesson content shown in `CourseViewer` still only covers course `1` (Book 1, Ch.11 §11.2); this
book has **not** been transcribed into `src/pages/courses/viewer/courseContent.ts` yet. That
transcription — turning these chapters into real `Lesson` entries, matching the pattern already
used for course `1` — is the next, separate roadmap step once this content is reviewed. Don't
unlock the course card without doing that step, or clicking "Start Course" will land on a lesson
list that doesn't exist (the same "Course Not Found" fallback Book 1 Ch.11 §11.2 describes).

## Who this book is for

Zero prior exposure to AI agents assumed — same ground rule as Books 1 and 2. If you've used
ChatGPT or Claude but never built anything with an API, every concept here is explained before it's
used.

## Chapters

1. **[01-what-is-an-agent.md](01-what-is-an-agent.md)** — what actually makes something an
   "agent" rather than a chatbot or a script.
2. **[02-agentic-ai-vs-llms.md](02-agentic-ai-vs-llms.md)** — the relationship between a language
   model (the "brain") and an agent (the "body" that acts on the world).
3. **[03-agent-architecture-the-loop.md](03-agent-architecture-the-loop.md)** — the
   perceive → reason → act loop every agent is built from, piece by piece.
4. **[04-planning-and-reasoning.md](04-planning-and-reasoning.md)** — how an agent decides what to
   do next: chain-of-thought, ReAct, task decomposition, self-reflection.
5. **[05-tool-use-and-function-calling.md](05-tool-use-and-function-calling.md)** — how an agent
   actually *does* things in the world, beyond generating text.
6. **[06-memory-systems.md](06-memory-systems.md)** — what an agent remembers, for how long, and
   where that memory actually lives.
7. **[07-multi-agent-systems.md](07-multi-agent-systems.md)** — when and why to use more than one
   agent, and how they coordinate.
8. **[08-frameworks-and-ecosystem.md](08-frameworks-and-ecosystem.md)** — the real tools people
   build agents with today, compared honestly.
9. **[09-safety-guardrails-and-evaluation.md](09-safety-guardrails-and-evaluation.md)** — what can
   go wrong with an autonomous agent, and how to catch it before a customer does.
10. **[10-monetizing-agents.md](10-monetizing-agents.md)** — how AI agents are actually sold as a
    product — directly informing WhyAI's pillar 3.
11. **[11-your-first-agent-capstone.md](11-your-first-agent-capstone.md)** — **the practical
    chapter.** Build a real, working agent: a WhyAI Storefront Assistant that answers questions
    about, and recommends, WhyAI's own ebooks and AI agents.
12. **[12-glossary.md](12-glossary.md)** — every term from this book, defined plainly.

## How this connects to the rest of the docs

- The business case for *why* AI agents are a product pillar at all: [docs/ROADMAP.md](../ROADMAP.md)
  §1, pillar 3.
- The security risk specific to selling agents (reviewing what you distribute, sandboxing anything
  that executes): [docs/ROADMAP.md](../ROADMAP.md) §6, risk #7 — referenced again in Ch.9 of this
  book.
- The existing course/lesson system this content will eventually live inside: Book 1,
  [Ch.11](../book-1-codebase-explained/11-courses.md).
