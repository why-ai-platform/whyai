# Chapter 7: Multi-Agent Systems — When One Agent Isn't the Right Shape

## 7.1 Why use more than one agent at all

A single agent with a long, ambiguous mix of responsibilities ("handle sales, support, refunds,
and content writing") tends to perform worse at each individual job than several smaller agents
each focused on one job — the same reason a company has separate roles rather than one person doing
everything. Splitting work across multiple agents also lets each one carry a shorter, more focused
set of tools and instructions, which (per Chapter 5 §5.5's logic) directly improves reliability.

## 7.2 The orchestrator–worker pattern

The most common structure: one **orchestrator** agent receives the overall request, decides which
specialized **worker** agent(s) the task needs, delegates to them, and combines their results into
a final answer. Example directly relevant to WhyAI: an orchestrator agent handling a customer
message might delegate "does this customer want a refund?" to a dedicated refund-handling worker
(with narrow, carefully-scoped tools) while handling general product questions itself — keeping the
riskiest capability (processing a refund) isolated in one small, auditable place rather than mixed
into a general-purpose agent's broad toolset.

## 7.3 Debate / critique patterns

Two (or more) agents can be set up to deliberately disagree-and-reconcile: one produces an answer,
a second is specifically prompted to find flaws in it, and either the first revises based on the
critique or a third arbitrates. This is a more elaborate, more expensive version of Chapter 4 §4.5's
self-reflection, useful when the stakes of a wrong answer are high enough to justify the extra cost
— e.g., checking generated marketing copy for a regulated/sensitive claim before it's published,
not every routine customer reply.

## 7.4 Parallel fan-out

For tasks that decompose into independent sub-tasks (summarize each of 10 documents, then combine),
multiple worker agents can run **simultaneously** rather than one after another, each handling a
slice of the work, with a final step merging their results. This trades more total API calls for
much lower wall-clock time — relevant once an agent's workload genuinely has independent pieces,
not for a single linear conversation like Chapter 11's.

## 7.5 How agents actually talk to each other

Underneath any of these patterns, "communication" between agents is usually nothing more exotic
than: one agent's output (text, or a structured result) becomes part of another agent's input
context — often literally passed as a tool result, or as a message in that second agent's own
history. There's no special "agent-to-agent language" required for simple cases; the complexity
lives in deciding *when* to hand off and *what* to hand off, not in some novel protocol. (Some
frameworks, covered next in Chapter 8, do add structured conventions for this at scale — worth
knowing they exist, not required to understand the underlying mechanism.)

## 7.6 Does WhyAI need multi-agent systems yet?

**Not for Chapter 11's capstone, and probably not for a while.** A single, well-scoped storefront
assistant handling product questions and recommendations is squarely a single-agent problem — see
§7.1's framing: multi-agent earns its complexity when one agent's job has genuinely grown too broad
or too risky to keep in one place. The natural trigger to revisit this: if/when WhyAI's agent
handles something materially riskier than answering product questions (e.g., actually processing
refunds or changing order records), splitting that capability into its own narrowly-scoped worker
agent (§7.2) — rather than adding more tools to one general agent — is the point worth remembering
from this chapter.
