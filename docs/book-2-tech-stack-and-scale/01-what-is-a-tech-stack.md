# Chapter 1: What Is a "Tech Stack"?

A **tech stack** is just the list of tools/technologies a piece of software is built from, usually
grouped into layers. This chapter defines each layer in plain terms before Chapter 2 maps WhyAI
onto it.

## 1.1 Client and server

Every website involves (at least) two computers talking to each other:

- **The client** — the visitor's own device: their phone or laptop, running a web browser. All of
  Book 1 describes client-side code — everything that runs inside the visitor's browser.
- **The server** — a computer, somewhere else, that the client sends requests to over the internet
  and gets responses back from. "The backend," "the API," and "the server" are generally the same
  idea.

A request from client to server and the response back is called a **round trip**. Every round trip
takes real time — the subject of Chapter 8.

## 1.2 What is a database?

A **database** is organized, persistent storage for data that needs to survive beyond a single
visit and be shared across everyone using the application — user accounts, orders, course
progress, anything that must still be there tomorrow and must be the same no matter who's looking
at it. Today, WhyAI has nothing like this (Book 1 Ch.17) — the closest thing is the browser's own
`localStorage`, which is private to one device and not a real database at all. Chapter 3 of this
book is entirely about where a real one goes.

The most common kind for an app like this is a **relational database** — data organized into
named **tables** (like spreadsheets: rows = individual records, columns = fields each record has),
with tables able to reference each other (e.g. an "orders" table row referencing which "user" row
made that purchase). **PostgreSQL** ("Postgres") is the specific, extremely common, free and
open-source relational database this book recommends (Chapter 3).

## 1.3 What is a "backend"/"server-side logic"?

Beyond just storing data, a backend also *does things*: checking a password is correct before
letting someone log in, verifying a payment actually went through before unlocking a purchased
ebook, enforcing "you can only see your own order history, not anyone else's." This logic has to
live somewhere the visitor's own browser can't tamper with — which is exactly why it runs on a
server, not in the client-side code Book 1 described. Chapter 4 covers the different ways to build
this.

## 1.4 What is "hosting," and what is Vercel?

**Hosting** means paying/using a service that keeps your application's files (or server code)
running and reachable on the internet, 24/7. **Vercel**, which WhyAI already uses
([vercel.json](../../vercel.json), Book 1 Ch.3 §3.4), is a hosting platform specialized for exactly
this kind of project: it automatically builds the project from its GitHub repository and serves the
resulting files from a global network of servers (Chapter 6 explains why "global" matters).

## 1.5 What is latency?

**Latency** is the delay between asking for something and getting it back — specifically, the time
a round trip takes. A page that "feels fast" has low latency on the things that matter most (first
paint, clicking a button, submitting a form); a page that "feels slow" usually has high latency
somewhere in that chain. Chapter 8 breaks down exactly where latency comes from and how to reduce
each source.

## 1.6 What does "scale" mean?

**Scaling** means a system continuing to work correctly and quickly as more people use it at the
same time. A system that works great with 10 simultaneous visitors but falls over (crashes, or
becomes extremely slow) with 10,000 simultaneous visitors "doesn't scale." Chapter 7 is entirely
about what makes a system scale well, and Chapter 9 gives concrete numbers for when each concern
actually starts to matter for WhyAI specifically — most scaling techniques are unnecessary, and
actively wasteful, before you actually have the traffic that needs them.

With this vocabulary, Chapter 2 maps WhyAI's actual, current stack onto these layers.
