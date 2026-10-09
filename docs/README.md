# WhyAI Docs Index

> **New Claude session?** You don't need this file first — [`../CLAUDE.md`](../CLAUDE.md) at the
> repo root is read automatically at the start of every session and links everything below. This
> index is for a human browsing `docs/` directly.

- **[ROADMAP.md](ROADMAP.md)** — the phased development plan: 3 product pillars (AI/agents
  courses, eBook store, AI agent marketplace) + 3 cross-cutting requirements (flexibility &
  scalability, security, analytics), broken into small, independently-verifiable feature-branch
  checklist items.
- **[../CHANGELOG.md](../CHANGELOG.md)** — running, dated record of every change made to this repo.
- **[book-1-codebase-explained/](book-1-codebase-explained/00-start-here.md)** — a from-zero,
  chapter-by-chapter explanation of every file in `src/`: what it does, every function, how a
  click turns into a screen update. 21 chapters, no prior Node.js/TypeScript/React knowledge
  assumed.
- **[book-2-tech-stack-and-scale/](book-2-tech-stack-and-scale/00-start-here.md)** — where a
  database would go, backend options, how auth/security actually work, caching/CDNs, and a staged,
  trigger-based plan for scaling to a very large number of users without over-building early. 12
  chapters, no prior infrastructure knowledge assumed.
- **[diagrams/whyai-blueprint.html](diagrams/whyai-blueprint.html)** — a 3-sheet, hand-drawn
  engineering-blueprint-styled diagram set of the codebase's *current* state: system architecture,
  a class diagram of the data model (and why it's unused), and a class diagram of the components/
  Context/auth dependencies. Open the file directly in a browser to view it.

## Reading order

New to the codebase, zero backend/infra knowledge: **Book 1** end to end, then **Book 2** end to
end, glancing at the blueprint diagrams alongside Book 1 Ch.17 and Book 2 Ch.10. Already know the
code, just want the plan: **ROADMAP.md** on its own is self-contained.
