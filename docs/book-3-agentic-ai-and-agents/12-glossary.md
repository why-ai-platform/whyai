# Chapter 12: Glossary

Terms introduced in this book, in addition to Book 1's and Book 2's glossaries. Alphabetical.

**Agent** — a system given a goal (not a single instruction) that decides its own steps, takes
real actions via tools, and uses each result to decide its next step (Ch.1).

**Agent loop / agentic loop** — the perceive → reason → act → feed-back cycle every agent runs,
implemented as a `while`/`for` loop calling the model repeatedly (Ch.3).

**Chain-of-thought** — prompting or model behavior that reasons step by step before answering,
rather than jumping straight to a final answer (Ch.4 §4.1).

**Context window** — the maximum amount of text a model can consider at once in a single request;
not the same thing as memory (Ch.6 §6.1).

**Embeddings** — a representation of text as a list of numbers such that texts with similar
meaning produce similar numbers, enabling search by meaning rather than exact match (Ch.6 §6.4).

**Eval (evaluation set)** — a fixed list of realistic test inputs with known-good expected
outputs, used to measure whether an agent actually works before and after changes (Ch.9 §9.6).

**Function calling** — the mechanism by which a model produces a structured request to call a
specific tool with specific arguments, instead of describing the action in free-text prose (Ch.5
§5.3).

**Guardrail** — any mechanism (validation, confirmation gate, sandbox, rate limit) that constrains
what an agent is allowed to do, specifically to prevent a class of harmful outcome (Ch.9).

**Human-in-the-loop** — requiring a person's explicit confirmation before an agent's action
actually executes, typically reserved for irreversible or high-consequence actions (Ch.9 §9.3).

**JSON Schema** — the standard format used to describe a tool's expected input shape (field names,
types, which are required) so both the model and your own validation code agree on it (Ch.5 §5.1).

**Multi-agent system** — an architecture using more than one agent, each with a narrower role,
coordinated by an orchestrator or by direct hand-off (Ch.7).

**Orchestrator** — the plain code (or, in a multi-agent system, a dedicated agent) that runs the
loop: sending requests, running tools, feeding results back (Ch.3 §3.1, Ch.7 §7.2).

**Prompt injection** — an attack where text an agent reads (a user message, a document, a search
result) contains instructions attempting to override the agent's real instructions (Ch.9 §9.1).

**RAG (Retrieval-Augmented Generation)** — retrieving the most relevant stored information (often
via embeddings) and including it in a model's context before it answers, rather than relying only
on what's in the prompt already (Ch.6 §6.4).

**ReAct** — a reasoning pattern that interleaves reasoning and acting one step at a time, adapting
to each action's real result, rather than planning every step in advance (Ch.4 §4.2).

**Sandbox** — an isolated execution environment with no access to real credentials/filesystem/
network beyond what's explicitly intended, required for running any code an agent generated or
received (Ch.9 §9.4).

**Scaffolding** — the code wrapped around a language model (the loop, tools, memory) that turns it
into an agent; the model itself doesn't change (Ch.2 §2.2).

**Self-reflection / self-critique** — an agent checking its own draft output against the original
goal in a separate reasoning pass, before presenting a final answer (Ch.4 §4.5).

**Task decomposition** — breaking one large, vague goal into smaller, concretely achievable
sub-goals (Ch.4 §4.4).

**Tool** — a function exposed to a model with a name, description, and input schema, which the
model can request be called; the model never executes it directly (Ch.5 §5.1).

**Tool runner** — an SDK helper that automates the agentic loop for tools you define, without you
hand-writing the `while` loop (Ch.8 §8.1).

See also: **[Book 1's glossary](../book-1-codebase-explained/20-glossary.md)** (frontend/React/
TypeScript) and **[Book 2's glossary](../book-2-tech-stack-and-scale/11-glossary.md)** (backend/
infrastructure/scaling).
