# Chapter 8: Frameworks & the Agent-Building Ecosystem

Chapter 3 showed the agent loop can be written by hand, in plain code, calling an LLM API directly.
This chapter surveys what else exists, and when reaching for it is worth the added dependency.

## 8.1 The real spectrum of options (using Claude's own ecosystem as the concrete example)

It's worth being precise here, because these names get conflated constantly:

- **Writing the loop yourself** (Chapter 3) — full control, zero framework dependency, the
  approach Chapter 11 actually uses. The right choice whenever the loop's logic is simple enough
  that a framework wouldn't meaningfully reduce the code, which is true for most single-purpose
  business agents.
- **A "tool runner" helper** — a thin SDK helper (Claude's API SDK ships one) that automates the
  "call the model, run the requested tool, feed the result back, repeat" cycle for tools *you*
  define, so you don't hand-write the `while` loop from Chapter 3 — without adding any built-in
  tools or a hosting platform. A small, low-commitment step up from a fully manual loop.
- **A general-purpose agent framework** — **LangChain**/**LangGraph**, **CrewAI**, **AutoGen**,
  and similar open-source libraries provide pre-built pieces for the patterns in Chapters 4–7
  (planning strategies, multi-agent orchestration, memory abstractions) across *multiple* model
  providers, not just one. The tradeoff: real learning curve, and an extra abstraction layer
  between your code and the model's actual API, which can make it harder to see or control exactly
  what's being sent — a cost worth paying once an agent's structure is genuinely complex enough
  (e.g. a many-step, many-agent pipeline) that reimplementing those patterns by hand would take
  real engineering time.
- **A batteries-included coding/filesystem agent SDK** — e.g. Anthropic's **Claude Agent SDK**
  (the library Claude Code itself is built on): ships a full agent loop *and* a set of built-in
  tools (reading/writing files, running shell commands, web search) out of the box. The right tool
  specifically for building agents that operate on a codebase or filesystem — not the shape of
  WhyAI's storefront assistant, which has no filesystem to work in, only a product catalog.
- **A managed/hosted agent platform** — e.g. Anthropic's **Managed Agents**: you define an agent's
  configuration once, and the platform itself runs the loop *and* hosts the environment the agent's
  tools execute in (a sandboxed workspace), rather than your own server. Worth it specifically once
  you need persisted, versioned agent configs, very long-running sessions, or don't want to operate
  the hosting yourself — more platform commitment than Chapter 11's capstone needs to get started,
  but the natural next step once a WhyAI agent needs to run unattended on a schedule or for a long
  session (ties to Chapter 10's discussion of *how* a sold agent is actually delivered to a buyer).

## 8.2 A comparison, for picking

| Option | You write | Who hosts it | Best fit |
|---|---|---|---|
| Manual loop | The whole loop | You | Learning (this book), simple single-agent jobs |
| Tool-runner helper | Just the tool functions | You | Same as manual, less boilerplate |
| LangChain/LangGraph, CrewAI, AutoGen | Agent config using the framework's abstractions | You | Complex multi-step/multi-agent pipelines, provider flexibility |
| Claude Agent SDK | A prompt + options | You | Coding/filesystem agents (not WhyAI's current need) |
| Managed Agents (hosted) | Agent config + your own tools | The platform | Long-running, persisted, or scheduled agents you don't want to operate yourself |

## 8.3 Why Chapter 11 picks the manual loop

Three reasons, each tying back to earlier chapters: (1) a storefront Q&A/recommendation assistant
is exactly the "simple enough that a framework doesn't earn its cost" case from §8.1; (2) seeing
every piece of the loop in plain code is what makes Chapter 3's architecture concrete rather than
abstract — the whole point of a *first* agent; (3) it keeps the example provider-agnostic in
spirit (the same loop shape works with any tool-calling LLM API, even though the concrete code
calls Claude's) and dependency-light, which matters for something meant to be read and understood
start to finish, not just run.

## 8.4 When to revisit this chapter

Once WhyAI is building a *second* or *third* distinct agent product for the marketplace (pillar 3),
or once an agent's job grows into genuinely multi-step/multi-agent territory (Chapter 7), this is
the chapter to come back to — not before. Adopting a framework before its complexity is earned adds
a learning curve and an abstraction layer for no present benefit, the same anti-pattern
[docs/ROADMAP.md](../ROADMAP.md) (and Book 2 Ch.9) warn against for infrastructure generally.
