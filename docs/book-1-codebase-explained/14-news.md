# Chapter 14: News

Two live routes: `ROUTES.NEWS` (`/news`) → `NewsPage`, `ROUTES.NEWS_DETAIL` (`/news/:id`) →
`NewsDetail`. Both read from one shared data file.

## 14.1 `newsData.ts` — the data

[pages/news/newsData.ts](../../src/pages/news/newsData.ts) exports an `interface NewsItem` (id,
title, description, category, date, image, comments, trending, content, author, readTime) and a
`newsData: NewsItem[]` array of 4 full articles, each with a long `content` string containing raw
HTML (`<h2>`, `<h3>`, `<ul>`, `<strong>`, etc.) — the exact same `dangerouslySetInnerHTML` pattern
and the exact same "safe only because the owner writes every word of it" caveat as the course
lesson content in Chapter 11 §11.2, flagged in the same [docs/ROADMAP.md](../ROADMAP.md) §6 risk
#1.

**Worth knowing**: [landing/NewsSection.tsx](../../src/pages/landing/NewsSection.tsx) (Chapter 10)
defines its **own separate, shorter copy** of the first 4 articles' preview fields (title,
description, category, date, image, comments, trending) directly inside itself, rather than
importing and slicing `newsData`. The ids and content happen to match today by coincidence of
careful copying, but editing an article in `newsData.ts` will **not** update what the landing page
preview shows — they are two independent sources of the same information. This is a concrete,
findable case of the kind of duplication [docs/ROADMAP.md](../ROADMAP.md) §5 (flexibility
principles) argues against for anything added going forward.

## 14.2 `NewsPage` — the listing

**State**: `selectedCategory`, defaulting to `'All'`.

```tsx
const categories = ['All', ...Array.from(new Set(newsData.map(item => item.category)))];
const filteredNews = selectedCategory === 'All' ? newsData : newsData.filter(item => item.category === selectedCategory);
```
`newsData.map(item => item.category)` produces `['Generative AI', 'Agentic AI', 'Machine Learning',
'Deep Learning']` (one per article, with duplicates possible if two articles shared a category).
Wrapping that in `new Set(...)` removes any duplicates (a `Set` can only hold each distinct value
once); `Array.from(...)` converts it back to a plain array so `.map()` can render category filter
buttons from it. This is a general, reusable technique worth remembering: **"get the unique values
from a list" = `Array.from(new Set(list))`**.

Clicking a category button calls `setSelectedCategory(category)`, which re-renders the grid with
`filteredNews` recomputed. Clicking any article card calls `navigate(ROUTES.NEWS_DETAIL.replace(
':id', item.id.toString()))` (the same dynamic-route pattern from Chapter 10 §10.3). If a category
filter produces zero results, a "No news articles found" message shows instead of an empty grid
(currently unreachable in practice, since every one of the 4 hardcoded articles has a genuinely
unique category — but it's there for when more articles with overlapping categories exist).

## 14.3 `NewsDetail` — the article view

```tsx
const { id } = useParams<{ id: string }>();
const newsItem = newsData.find(item => item.id === Number(id));
```
`useParams` reads the `:id` segment from the URL as a **string** (URL segments are always text);
`Number(id)` converts it to a number before comparing against `item.id` (which is typed as
`number` in the data), since `"3" === 3` would be `false` in JavaScript/TypeScript (strict equality
`===` does not convert types) despite looking equivalent. If no article matches (an id that doesn't
exist, or isn't a valid number at all), `newsItem` is `undefined`, and the component shows an
"Article Not Found" card — the same not-found pattern used in `CourseViewer` (Chapter 11 §11.2).

**Related articles**: `newsData.filter(item => item.category === newsItem.category && item.id !==
newsItem.id).slice(0, 3)` — every other article sharing the same category, excluding the current
one, capped at 3. Clicking a related article calls `navigate(...)` to that article's own detail
page *and* `window.scrollTo(0, 0)` — necessary because React Router, by default, does **not**
automatically scroll to the top when navigating between two routes that render the same component
type (`NewsDetail` rendering a different article is still "the same component," so without this
explicit scroll reset, you'd land on the new article already scrolled halfway down the page).

A "Comments" section at the bottom shows the article's `comments` count in a heading but is purely
a "coming soon" placeholder — no real comment data or form exists.
