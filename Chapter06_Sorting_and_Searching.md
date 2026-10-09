# Chapter 6: Sorting and Searching

**Topic:** Programming in Modern C++ — From C to C++

**Prerequisites:** Chapters 1–5 (arrays, pointers, function pointers, `std::vector`).

**What you will learn**
- Why hand-written sorts are usually the wrong choice.
- How C's `qsort` and `bsearch` work, and why their interface is so awkward.
- How C++'s `std::sort` and `std::binary_search` remove that awkwardness.
- The idea of a **range** (`begin`, `end`) that underpins all C++ algorithms.
- What else `<algorithm>` offers.

---

## 1. Introduction

Sorting and searching are the two operations almost every program eventually
needs. This chapter looks at three levels of solution — hand-written, C standard
library, C++ standard library — and shows how much the interface quality matters.

---

## 2. Hand-Written Sorting: Bubble Sort

The algorithm is identical in C and C++. Only the I/O differs.

**C:**

```c
#include <stdio.h>

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - 1 - i; ++j)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
}

int main() {
    int data[] = {40, 10, 100, 90, 20};
    int n = sizeof(data) / sizeof(data[0]);
    bubbleSort(data, n);
    for (int i = 0; i < n; ++i) printf("%d ", data[i]);
    printf("\n");
    return 0;
}
```

**C++:**

```cpp
#include <iostream>

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - 1 - i; ++j)
            if (a[j] > a[j + 1])
                std::swap(a[j], a[j + 1]);     /* from <utility> */
}

int main() {
    int data[] = {40, 10, 100, 90, 20};
    int n = sizeof(data) / sizeof(data[0]);
    bubbleSort(data, n);
    for (int i = 0; i < n; ++i) std::cout << data[i] << ' ';
    std::cout << '\n';
    return 0;
}
```

Both print:

```
10 20 40 90 100
```

**Takeaway:** sorting code written in C can be used as-is in C++. The language
difference is only the I/O header and the `std` namespace. But neither version is
what you should actually write — bubble sort is O(n²), and the standard library
already has a well-tested, well-optimized sort.

---

## 3. Sorting in C: `qsort`

`qsort` lives in `<stdlib.h>`. The name reflects its typical quicksort-based
implementation.

```c
void qsort(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *));
```

Four parameters:

1. **`base`** — the array to sort.
2. **`nmemb`** — how many elements, always counting from index 0.
3. **`size`** — the size of one element in bytes. `qsort` does not know the element
   *type*, so it needs this byte offset to step from one element's address to the
   next.
4. **`compar`** — a comparison **function pointer**. `qsort` cannot know how to
   compare values of an unknown type, so the caller must supply that knowledge.

### 3.1 Why a comparison function is unavoidable

For `int` you could imagine `qsort` just using `<`. But it is also expected to sort
C strings, which must be compared with `strcmp`, and structures, which must be
compared on whichever member you care about. Since no built-in operator covers all
of these, `qsort` delegates comparison entirely to the caller.

### 3.2 The `void *` cost

Because `qsort` works for any type, the comparison function's parameters must be
`const void *` — pointers to constant data of unknown type. Inside the function you
must cast to the real type and dereference before you can compare:

```c
#include <stdio.h>
#include <stdlib.h>

int compare_desc(const void *p, const void *q) {
    int a = *(const int *)p;        /* cast, then dereference */
    int b = *(const int *)q;
    if (a < b) return  1;           /* "a after b"  → descending */
    if (a > b) return -1;
    return 0;
}

int main() {
    int data[] = {40, 10, 100, 90, 20};
    qsort(data, 5, sizeof(int), compare_desc);
    for (int i = 0; i < 5; ++i) printf("%d ", data[i]);
    printf("\n");
    return 0;
}
```

```
100 90 40 20 10
```

Sorting C strings shows the same shape with an extra level of indirection:

```c
#include <string.h>

int compare_str(const void *p, const void *q) {
    const char *a = *(const char * const *)p;   /* element IS a char*  */
    const char *b = *(const char * const *)q;
    return strcmp(a, b);
}

int main() {
    const char *names[] = {"Zoe", "Adam", "Mia"};
    qsort(names, 3, sizeof(names[0]), compare_str);
    /* names == {"Adam", "Mia", "Zoe"} */
    return 0;
}
```

The double indirection in `*(const char * const *)p` is exactly the kind of detail
that makes `qsort` unpopular. Despite being in the standard library, many C
programmers would rather hand-write a bubble, selection, insertion, or merge sort
specialized to their data type than get that cast right — which trades a correct,
fast library routine for slower, less-tested code.

---

## 4. Sorting in C++: `std::sort`

C++ provides `<algorithm>`, a header full of ready-made algorithms. `std::sort` is
the counterpart to `qsort`.

```cpp
#include <algorithm>
#include <iostream>

int main() {
    int data[] = {40, 10, 100, 90, 20};

    std::sort(data, data + 5);                  /* ascending, no comparator */

    for (int x : data) std::cout << x << ' ';
    std::cout << '\n';
    return 0;
}
```

```
10 20 40 90 100
```

### 4.1 Parameter-by-parameter comparison

| | `qsort` | `std::sort` |
|---|---|---|
| Container | `data` | `data` (the **begin** of the range) |
| Extent | element count: `5` | **one past the end**: `data + 5` |
| Element size | `sizeof(int)` — required | not needed; deduced from the type |
| Comparator | `const void*` function pointer, required | optional; ordinary typed parameters |

**Ranges.** The pair (begin, one-past-the-end) is called a **range** in C++, and it
is the uniform convention across the whole algorithm library. `data + 5` means "the
position just after the last element", so the range `[data, data+5)` covers
indices 0 through 4. For containers you write `v.begin(), v.end()`:

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {40, 10, 100, 90, 20};
std::sort(v.begin(), v.end());
std::sort(v.begin(), v.begin() + 3);    /* sort only the first three */
```

**No element size.** The compiler knows the element type from the pointer or
iterator type, so there is nothing to pass and nothing to get wrong.

**Natural comparators.** When you do supply a comparison, it takes ordinary typed
parameters — no `void *`, no casting, no dereferencing:

```cpp
#include <algorithm>
#include <iostream>

bool descending(int i, int j) { return i > j; }   /* "i comes before j" */

int main() {
    int data[] = {40, 10, 100, 90, 20};
    std::sort(data, data + 5, descending);
    for (int x : data) std::cout << x << ' ';
    std::cout << '\n';
    return 0;
}
```

```
100 90 40 20 10
```

### 4.2 A note on comparator conventions

The two libraries mean different things by their comparator's result, which is a
common source of confusion:

- **`qsort`** wants a **three-way** result: negative, zero, or positive.
- **`std::sort`** wants a **Boolean**: "does the first argument come *strictly
  before* the second?"

So to sort descending, a `qsort` comparator returns `+1` when `a < b`, while a
`std::sort` comparator returns `true` when `a > b`. Both achieve descending order;
the difference is convention, not logic.

The `std::sort` comparator must impose a *strict weak ordering* — in particular,
`cmp(x, x)` must be `false`. Writing `>=` instead of `>` violates this and can
crash at run time:

```cpp
bool bad(int i, int j) { return i >= j; }   /* WRONG: not a strict ordering */
bool good(int i, int j) { return i >  j; }  /* correct                      */
```

### 4.3 The comparator is optional

For any type that already has `<` — all built-in types, `std::string`, and your own
types once you define `operator<` — you may omit the comparator and get ascending
order:

```cpp
std::vector<std::string> names = {"Zoe", "Adam", "Mia"};
std::sort(names.begin(), names.end());         /* uses std::string::operator< */
```

Descending still requires an explicit comparator, or the ready-made
`std::greater<>`:

```cpp
#include <functional>
std::sort(v.begin(), v.end(), std::greater<int>());
```

With C++11 and later, a **lambda** keeps the comparison at the call site:

```cpp
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
```

Sorting structures by a chosen field is then a one-liner:

```cpp
#include <algorithm>
#include <string>
#include <vector>

struct Employee { std::string name; int age; double salary; };

int main() {
    std::vector<Employee> staff = {
        {"Mia", 31, 72000}, {"Adam", 45, 65000}, {"Zoe", 28, 81000}
    };

    std::sort(staff.begin(), staff.end(),
              [](const Employee &a, const Employee &b) { return a.age < b.age; });
    /* staff is now ordered: Zoe(28), Mia(31), Adam(45) */
    return 0;
}
```

The equivalent in C requires a named function, `void *` casts, and no access to
anything but file-scope state.

**Consequence:** `std::sort` is pleasant enough to use that C++ programmers rarely
write their own sort routines — which means they get an optimized, correct,
O(n log n) algorithm every time.

---

## 5. Binary Search

Binary search finds whether a key exists in a **sorted** array, and where, in
O(log n) time.

### 5.1 C: `bsearch`

```c
void *bsearch(const void *key, const void *base, size_t nmemb, size_t size,
              int (*compar)(const void *, const void *));
```

Five parameters: the **address** of the key (passed as `void *` because the type is
unknown), the array (which must already be sorted), the element count, the element
size, and a comparison function.

```c
#include <stdio.h>
#include <stdlib.h>

int compare_asc(const void *p, const void *q) {
    int a = *(const int *)p, b = *(const int *)q;
    if (a < b) return -1;        /* THREE-way: less / equal / greater */
    if (a > b) return  1;
    return 0;
}

int main() {
    int data[] = {10, 20, 40, 90, 100};
    int key = 90;

    int *found = (int *)bsearch(&key, data, 5, sizeof(int), compare_asc);

    if (found) printf("found at index %ld\n", (long)(found - data));
    else       printf("not found\n");
    return 0;
}
```

```
found at index 3
```

**Note the three-way comparison.** Sorting needs only a two-way answer ("does `a`
come before `b`?"). Binary search needs a **three-way** answer, because at each
step it must decide between three actions: stop (equal), search left (less), or
search right (greater). This mirrors `strcmp`'s negative/zero/positive convention.
The `void *` casting burden is identical to `qsort`'s.

### 5.2 C++: `std::binary_search`

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {10, 20, 40, 90, 100};

    bool found = std::binary_search(data.begin(), data.end(), 90);
    std::cout << (found ? "found\n" : "not found\n");
    return 0;
}
```

```
found
```

Three arguments: the range (begin, end) and the key. As with `std::sort`, the
comparator is optional for types that already have `<`.

If you need the *position* rather than a yes/no answer, use `std::lower_bound`,
which returns an iterator to the first element not less than the key:

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {10, 20, 40, 90, 100};
    int key = 90;

    auto it = std::lower_bound(data.begin(), data.end(), key);

    if (it != data.end() && *it == key)
        std::cout << "index " << (it - data.begin()) << '\n';
    else
        std::cout << "not found\n";
    return 0;
}
```

```
index 3
```

> **Precondition:** both `bsearch` and `binary_search` require the range to be
> **sorted by the same ordering** the search uses. Searching an unsorted range does
> not produce an error — it produces a wrong answer.

Binary search is dramatically easier to use correctly in C++, to the point where
essentially nobody writes their own.

---

## 6. The Rest of `<algorithm>`

`<algorithm>` contains far more than sort and search. A representative sample:

```cpp
#include <algorithm>
#include <numeric>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {4, 1, 7, 1, 9, 3};

    std::replace(v.begin(), v.end(), 1, 0);        /* every 1 becomes 0     */
    std::rotate(v.begin(), v.begin() + 2, v.end());/* rotate left by 2      */
    std::reverse(v.begin(), v.end());              /* reverse in place      */

    auto mx  = *std::max_element(v.begin(), v.end());
    auto cnt =  std::count(v.begin(), v.end(), 0);
    auto sum =  std::accumulate(v.begin(), v.end(), 0);   /* <numeric>      */

    auto it  =  std::find(v.begin(), v.end(), 7);
    bool has =  it != v.end();

    v.erase(std::remove(v.begin(), v.end(), 0), v.end()); /* erase-remove   */

    std::cout << mx << ' ' << cnt << ' ' << sum << ' ' << has << '\n';
    for (int x : v) std::cout << x << ' ';
    std::cout << '\n';
    return 0;
}
```

Other frequently used names: `copy`, `transform`, `fill`, `unique`, `merge`,
`min_element`, `all_of` / `any_of` / `none_of`, `for_each`, `next_permutation`,
`nth_element`, `partial_sort`, `set_union`, `set_intersection`.

These are designed to be usable straight from the reference documentation, even
before you have mastered the language. Browsing the header's contents once is a
genuinely high-return investment.

---

## 7. Common Pitfalls

| Pitfall | Consequence | Fix |
|---|---|---|
| `std::sort(v.begin(), v.size())` | type error / nonsense | pass `v.end()` |
| Comparator using `>=` or `<=` | undefined behaviour, possible crash | use strict `>` or `<` |
| Searching an unsorted range | silently wrong result | sort first |
| Mismatched sort and search orderings | silently wrong result | use the same comparator for both |
| Forgetting `qsort` needs `sizeof(elem)` | corrupt results | always pass `sizeof(a[0])` |
| `bsearch` with a two-way comparator | wrong result | return negative / zero / positive |
| `std::remove` without `erase` | elements not actually removed | use the erase-remove idiom |
| Iterator invalidated by modification | undefined behaviour | re-obtain iterators after resizing |

---

## 8. Summary

| | Hand-written | C: `qsort`/`bsearch` | C++: `std::sort`/`std::binary_search` |
|---|---|---|---|
| Correctness | your responsibility | library-tested | library-tested |
| Performance | often O(n²) | O(n log n) | O(n log n), often faster (inlining) |
| Type safety | per-type code | `void *`, casts | fully typed |
| Comparator | built in | mandatory, three-way, `void*` | optional, two-way, natural types |
| Element size | implicit | must be passed | deduced |
| Extent | count | count | range `[begin, end)` |

Sorting and searching in C++ take less code, are harder to get wrong, and are
usually faster than the alternatives — which is why C++ programmers almost never
write their own. The same holds for the dozens of other algorithms in
`<algorithm>`: merge, swap, remove, rotate, transform, and the rest.

---

## 9. Exercises

1. Sort an array of `double` in descending order, once with `qsort` and once with
   `std::sort`. Compare the line counts and the opportunities for error.
2. Write a `qsort` comparator for a `struct Employee` that orders by salary, then
   the equivalent `std::sort` lambda.
3. Sort a `std::vector<std::string>` by length, breaking ties alphabetically.
4. Explain, with a concrete input, why a `>=` comparator can cause `std::sort` to
   read out of bounds.
5. Use `std::lower_bound` and `std::upper_bound` to find all occurrences of a
   repeated key in a sorted vector.
6. Pick five algorithms from `<algorithm>` you have not used, read their
   documentation, and write a one-line example of each.

---

**Next:** Chapter 7 applies the same comparison to a data structure — the stack —
by implementing one in C and then using the ready-made `std::stack`.
