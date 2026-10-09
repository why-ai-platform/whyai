# Chapter 5: Authentication & Security, Explained From Zero

This chapter explains the *mechanisms* behind the security table in
[docs/ROADMAP.md](../ROADMAP.md) §6, for a reader who hasn't encountered these concepts before.

## 5.1 Why a password can't just be checked by a website's own frontend code

Imagine login worked by shipping the correct password to every visitor's browser, and having
client-side JavaScript compare it to what they typed. Anyone could open their browser's developer
tools, read that correct password straight out of the downloaded code, and log in as anyone. **This
is exactly why password-checking must happen on a server** (Chapter 4) that only the server itself
can see the stored, correct value for — the browser only ever sends what the visitor typed, and
gets back a yes/no (plus, if yes, a token proving it — see §5.2).

## 5.2 Hashing — how a server avoids ever storing your actual password

Even on the server, storing passwords as plain readable text is dangerous (anyone who ever gains
access to the database — a hacker, or a careless employee — would see every password immediately).
Instead, a password is run through a **hashing function** — a one-way mathematical scrubber that
turns `"mypassword123"` into something like `"$2b$12$Kx9..."`, where going *backward* (recovering
the original password from the hash) is computationally infeasible. The server stores only the
hash. To check a login attempt, it hashes the newly-typed password the same way and compares the
two hashes — never the original password itself. Supabase Auth (Chapter 3) already does this
correctly, with well-tested, modern hashing — this is exactly why "don't write your own
authentication system" is standard advice: getting this subtly wrong is a common, serious mistake.

## 5.3 Sessions and tokens — how a website remembers you're logged in

After a successful login, the server needs a way to recognize you on every *subsequent* request
without asking for your password again on every click. It issues a **session token** — a long,
random, hard-to-guess string — which the browser then automatically attaches to future requests
(commonly stored in a cookie). The server checks "does this token match a currently valid session"
instead of re-checking a password every time. This is also exactly why, in Book 1 Ch.6, WhyAI's
*current* mock login is so fragile: there is no token, no server, no persistence at all — `useState`
alone forgets everything on refresh.

## 5.4 Row Level Security (RLS) — the database's own bouncer

Once real data exists in Supabase (Chapter 3), a critical question arises: if the React app can
query the database somewhat directly, what stops a curious visitor from opening their browser's
developer console and querying *someone else's* order history or course progress? **Row Level
Security** is Postgres's (and Supabase's) built-in answer: you write a **policy** directly on each
table, in the database itself, saying things like "a row in `orders` is only visible to the request
if `orders.user_id` matches the currently logged-in user's id." This rule is enforced by the
database itself, on every single query, regardless of what the requesting code asks for or how it's
written — it cannot be bypassed by clever or malicious frontend code, because the check never
happens in the frontend at all. This is why [docs/ROADMAP.md](../ROADMAP.md) §6 risk #3 insists RLS
ship in the *same* change as every new table, not as a follow-up — a table with no RLS policy at
all is, by default on Supabase, either fully open or fully closed depending on configuration, and
either mistake is a real data exposure risk.

## 5.5 Webhook signature verification — proving a message really came from Stripe/Razorpay

A **webhook** is a request a payment provider sends *to your server* to say "this payment just
succeeded." The naive, dangerous approach is to trust any request that arrives at that URL claiming
to be a successful payment — but anyone on the internet could send a fake one, claiming a purchase
succeeded when it never did, to unlock a paid ebook for free. The real payment provider instead
**signs** every genuine webhook request with a secret key only it and your server know, and your
server's job is to **verify that signature** before trusting the message at all — a few lines using
the provider's own SDK. This is [docs/ROADMAP.md](../ROADMAP.md) §6 risk #4, and exactly why Chapter
4's "payment webhook handler" needs to be real server-side code (Option A/C), never something a
browser could fake its way past.

## 5.6 Signed URLs — why a purchased ebook's download link can't just be a plain public link

If an ebook's PDF sat at a permanent, public URL like `https://whyai.co.in/files/book.pdf`, anyone
who ever saw that link — forwarded in an email, posted anywhere — could download it forever,
whether they paid or not. A **signed URL** instead is generated on demand, *after* verifying a
purchase, and contains a cryptographic signature plus a short expiry time (e.g. valid for 10
minutes). Supabase Storage (Chapter 3) generates these directly. This is
[docs/ROADMAP.md](../ROADMAP.md) §6 risk #6.

## 5.7 HTTPS — the baseline everything above assumes

**HTTPS** encrypts every request and response between browser and server, so nobody intercepting
the connection (on public WiFi, for instance) can read passwords, tokens, or payment details in
transit, or silently alter them. Vercel (Chapter 1 §1.4) provides this automatically for WhyAI with
no configuration needed — it's worth knowing it's there, and why every one of the mechanisms above
would be far weaker without it.
