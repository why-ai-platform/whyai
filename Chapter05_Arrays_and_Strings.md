# Chapter 5: Arrays and Strings — `std::vector` and `std::string`

**Topic:** Programming in Modern C++ — From C to C++

**Prerequisites:** Chapters 1–4 (C arrays, pointers, `malloc`, C++ stream I/O).

**What you will learn**
- Why C arrays are awkward when the size is not known until run time.
- How `std::vector` provides an array that can grow and shrink.
- Why C strings are error-prone, and how `std::string` fixes that.
- How operators such as `+`, `=`, and `<` acquire meaning for library types.

---

## 1. Introduction

C arrays and C strings work in C++ exactly as they do in C. That is the backward
compatibility guarantee, and it is genuinely useful. But both carry costs that the
C++ standard library removes:

| Problem in C | C++ answer |
|---|---|
| Array size fixed at compile time | `std::vector` — resizable at run time |
| Manual `malloc`/`free` for dynamic arrays | `std::vector` — manages its own memory |
| No bounds information travels with the array | `std::vector::size()` |
| Strings are `char` arrays with a `'\0'` convention | `std::string` — a real type |
| `strcpy`/`strcat`/`strcmp` with manual buffer sizing | `=`, `+`, `<`, `==` |

---

## 2. Arrays Work the Same in C++

A basic array program is identical in the two languages apart from I/O:

```cpp
#include <iostream>

int main() {
    int arr[5];
    for (int i = 0; i < 5; ++i)
        arr[i] = i * i;
    for (int i = 0; i < 5; ++i)
        std::cout << arr[i] << ' ';
    std::cout << '\n';
    return 0;
}
```

```
0 1 4 9 16
```

Everything you learned about arrays in Chapter 2 still applies — including the lack
of bounds checking.

---

## 3. The Array Sizing Problem

The core limitation: **a C array's size must be fixed at compile time.** C
programmers have two traditional workarounds.

### 3.1 Workaround 1 — declare an array big enough

```c
#define MAX 100          /* manifest constant */

int main() {
    int arr[MAX];        /* hope 100 is always enough */
    /* ... */
}
```

Using a manifest constant is much better than scattering the literal `100` through
the code: change the `#define` once and every array declared with `MAX` follows.
Hard-coded literals require you to find and edit every occurrence, and missing one
produces a bug that may not surface for months.

The remaining problems are inherent: if the real need is 101 elements you overflow;
if it is 3 elements you have wasted the rest.

### 3.2 Workaround 2 — allocate at run time with `malloc`

```c
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);

    int *arr = (int *)malloc(n * sizeof(int));   /* size computation + cast */
    if (!arr) return 1;                          /* check for failure       */

    /* ... use arr ... */

    free(arr);                                   /* must not forget         */
    return 0;
}
```

This works, but you are now responsible for the size arithmetic, the cast from
`void *`, the null check, and the matching `free` on **every** exit path — including
early returns and error paths.

---

## 4. Introducing `std::vector`

`std::vector` is **not** a built-in type. It is a class template provided by the
standard library in the `<vector>` header.

```cpp
#include <iostream>
#include <vector>

const int MAX = 100;

int main() {
    std::vector<int> arr(MAX);      /* 100 ints, all value-initialized to 0 */

    for (int i = 0; i < 5; ++i)
        arr[i] = i * i;

    for (int i = 0; i < 5; ++i)
        std::cout << arr[i] << ' ';
    std::cout << '\n';
    return 0;
}
```

```
0 1 4 9 16
```

Compare the declarations:

```cpp
int              arr[MAX];     /* element type outside, size in brackets      */
std::vector<int> arr(MAX);     /* element type in angle brackets, size as an
                                  argument to the constructor                 */
```

The angle brackets say *what the elements are*; the parentheses say *how many*.
After declaration, **access notation is identical** — `arr[i]` works for both. That
is deliberate: a vector is meant to be a drop-in, better-behaved array.

### 4.1 Common ways to construct a vector

```cpp
std::vector<int> a;                    /* empty — size 0                      */
std::vector<int> b(10);                /* 10 elements, each 0                 */
std::vector<int> c(10, -1);            /* 10 elements, each -1                */
std::vector<int> d = {2, 3, 5, 7, 11}; /* from an initializer list (C++11)    */
std::vector<int> e(d);                 /* a copy of d                         */
```

### 4.2 Core operations

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {10, 20, 30};

    std::cout << v.size()  << '\n';      /* 3  — the size travels with it   */
    std::cout << v.empty() << '\n';      /* 0  (false)                      */
    std::cout << v.front() << '\n';      /* 10                              */
    std::cout << v.back()  << '\n';      /* 30                              */

    v.push_back(40);                     /* append — grows automatically    */
    v.pop_back();                        /* remove the last element         */

    std::cout << v.at(1) << '\n';        /* 20 — BOUNDS CHECKED             */
    /* v.at(99) would throw std::out_of_range; v[99] is undefined behaviour */

    for (int x : v)
        std::cout << x << ' ';
    std::cout << '\n';
    return 0;
}
```

```
3
0
10
30
20
10 20 30
```

Note `at()` versus `[]`: `at()` checks the index and throws `std::out_of_range` on
a bad one; `[]` does not check, matching raw-array performance. Use `at()` while
developing, `[]` in measured hot paths.

---

## 5. Run-Time Sizing: `vector` versus `malloc`

The scenario that really separates them: the size is known only once the user
supplies it.

**C:**

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int count;
    printf("How many? ");
    scanf("%d", &count);

    int *arr = (int *)malloc(count * sizeof(int));
    if (!arr) { fprintf(stderr, "alloc failed\n"); return 1; }

    for (int i = 0; i < count; ++i) arr[i] = i;
    for (int i = 0; i < count; ++i) printf("%d ", arr[i]);
    printf("\n");

    free(arr);
    return 0;
}
```

**C++:**

```cpp
#include <iostream>
#include <vector>

int main() {
    int count;
    std::cout << "How many? ";
    std::cin >> count;

    std::vector<int> arr;        /* starts empty */
    arr.resize(count);           /* now holds 'count' elements */

    for (int i = 0; i < count; ++i) arr[i] = i;
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';

    return 0;                    /* memory released automatically */
}
```

`resize()` grows or shrinks the element count on demand:

```cpp
std::vector<int> v(10);      /* 10 elements  */
v.resize(100);               /* now 100: the first 10 kept, the rest zeroed */
v.resize(3);                 /* now 3: the rest discarded                   */
```

What the C++ version eliminates:

- the `sizeof` arithmetic,
- the cast from `void *`,
- the null check (allocation failure throws `std::bad_alloc` instead),
- the `free` call — and therefore the possibility of leaking, double-freeing, or
  missing the `free` on an error path,
- the need to carry the length around separately, since `arr.size()` always knows.

That last point deserves emphasis. A C array passed to a function decays to a bare
pointer and loses its length; a `std::vector` passed to a function keeps it.

```cpp
void print(const std::vector<int> &v) {      /* no length parameter needed */
    for (std::size_t i = 0; i < v.size(); ++i)
        std::cout << v[i] << ' ';
    std::cout << '\n';
}
```

---

## 6. Strings: C versus C++

After numbers, sequences of characters are the most commonly needed kind of data.

### 6.1 C strings

C has no string type. `<string.h>` supplies functions that operate on a convention:
a **`char` array terminated by the null character** (ASCII 0, written `'\0'`).
Scanning stops at the first null; anything after it is not part of the string.

```c
char s[16] = "hello";
/*  s holds: 'h' 'e' 'l' 'l' 'o' '\0'  followed by 10 unspecified bytes */
```

Everything is the programmer's responsibility: allocating a big enough buffer,
keeping the terminator intact, and never writing past the end.

### 6.2 C++ `std::string`

Like `vector`, `std::string` is not built into the language — it is a standard
library class, from the `<string>` header. It behaves like a value: you can assign
it, compare it, concatenate it, and it manages its own storage.

---

## 7. Worked Example: Concatenation

Task: join `"hello "` and `"world"`.

**C:**

```c
#include <stdio.h>
#include <string.h>

int main() {
    const char *str1 = "hello ";
    const char *str2 = "world";

    char str[32];            /* must be large enough — but how large? */
    strcpy(str, str1);       /* copy the first                        */
    strcat(str, str2);       /* append the second                     */

    printf("%s\n", str);
    return 0;
}
```

**C++:**

```cpp
#include <iostream>
#include <string>

int main() {
    std::string str1 = "hello ";
    std::string str2 = "world";

    std::string str = str1 + str2;     /* "string addition" */

    std::cout << str << '\n';
    return 0;
}
```

Both print:

```
hello world
```

### 7.1 Why `+` works on strings

Just as `x + y` adds two integers, `str1 + str2` concatenates two strings. This is
**operator overloading**: C++ lets a type define what the standard operators mean
for it. `std::string` defines `+` as concatenation.

The same mechanism lets *you* define operators for your own types — `+` on a
`Rectangle` could mean "the bounding union of two rectangles", `+` on a `Complex`
could mean complex addition. Chapters 15–16 and 33–34 cover how to do this.

### 7.2 The buffer-size problem disappears

This is the practical win. In C you must decide `str`'s size **before** you know how
long the result will be. Get it wrong and `strcat` writes past the end of the
buffer — a buffer overflow, which is both a crash and a classic security
vulnerability:

```c
char str[8];
strcpy(str, "hello ");
strcat(str, "world");    /* needs 12 bytes, has 8 — memory corruption */
```

In C++, `str1 + str2` produces a string sized to fit, and `std::string` allocates
whatever storage that needs:

```cpp
std::string str = str1 + str2;   /* always correctly sized */
```

---

## 8. Beyond Concatenation

`std::string` supports the natural operators across the board.

| Operation | C | C++ |
|---|---|---|
| Copy | `strcpy(dst, src)` | `dst = src` |
| Append | `strcat(dst, src)` | `dst += src` |
| Compare equal | `strcmp(a,b) == 0` | `a == b` |
| Compare order | `strcmp(a,b) < 0` | `a < b` |
| Length | `strlen(s)` | `s.size()` or `s.length()` |
| Find substring | `strstr(s, t)` | `s.find(t)` |

```cpp
#include <iostream>
#include <string>

int main() {
    std::string a = "apple";
    std::string b = "banana";

    std::cout << (a == b) << '\n';        /* 0 — not equal          */
    std::cout << (a <  b) << '\n';        /* 1 — "apple" sorts first */

    a += " pie";                          /* append in place         */
    std::cout << a << '\n';               /* apple pie               */
    std::cout << a.size() << '\n';        /* 9                       */
    std::cout << a.substr(0, 5) << '\n';  /* apple                   */
    std::cout << a.find("pie") << '\n';   /* 6                       */

    if (a.find("cake") == std::string::npos)
        std::cout << "no cake\n";
    return 0;
}
```

```
0
1
apple pie
9
apple
6
no cake
```

### 8.1 Why this is better than `strcmp`

`strcmp` is awkward in a specific way: it takes two `char` pointers and returns a
negative number, zero, or a positive number. You must remember the convention and
compare the *result* against zero:

```c
if (strcmp(a, b) == 0) { /* equal */ }     /* easy to write == 1 by mistake */
if (strcmp(a, b) <  0) { /* a before b */ }
```

With `std::string` you compare strings the same way you compare integers or
doubles — `==`, `<`, `>=` all mean what they say, and no `<string.h>` function is
involved at all. Sorting a container of strings therefore works out of the box:

```cpp
#include <algorithm>
#include <string>
#include <vector>
#include <iostream>

int main() {
    std::vector<std::string> names = {"Zoe", "adam", "Mia", "Bob"};
    std::sort(names.begin(), names.end());      /* uses std::string's < */
    for (const std::string &n : names)
        std::cout << n << ' ';
    std::cout << '\n';
    return 0;
}
```

```
Bob Mia Zoe adam
```

(Uppercase letters sort before lowercase in ASCII — a reminder that `<` on strings
is *lexicographic by character code*, not a locale-aware alphabetical ordering.)

### 8.2 Reading strings

```cpp
#include <iostream>
#include <string>

int main() {
    std::string word, line;

    std::cin >> word;                /* reads one whitespace-delimited word */
    std::getline(std::cin, line);     /* reads the rest of the line          */

    std::cout << "word=[" << word << "] line=[" << line << "]\n";
    return 0;
}
```

No buffer, no length limit, no `fgets` and trailing-newline cleanup.

### 8.3 Interoperating with C APIs

When you must call a C function, `c_str()` gives you a null-terminated `const
char *`:

```cpp
#include <cstdio>
#include <string>

int main() {
    std::string path = "data.txt";
    std::FILE *f = std::fopen(path.c_str(), "r");   /* C API, C++ string */
    if (f) std::fclose(f);
    return 0;
}
```

---

## 9. Common Pitfalls

| Pitfall | Example | Fix |
|---|---|---|
| `v[i]` out of range | `v[v.size()]` | use `v.at(i)`, or check the index |
| Holding a reference across a resize | `int &r = v[0]; v.push_back(1);` | re-index after any growth |
| `"a" + "b"` | both are `const char*`, not strings | `std::string("a") + "b"` |
| Comparing `char*` with `==` | compares addresses, not text | use `std::string`, or `strcmp` |
| `s.find(t) == -1` | `find` returns `std::string::npos` | compare against `std::string::npos` |
| Mixing `cin >> x` and `getline` | the leftover newline is read immediately | consume it, or use `getline` throughout |
| Passing containers by value | copies the whole thing | pass `const std::vector<T>&` |

---

## 10. Summary

- C arrays and C strings continue to work in C++ unchanged — but both leave the
  bookkeeping to you.
- **`std::vector`** gives array syntax (`v[i]`) with run-time sizing (`resize`,
  `push_back`), a size that travels with the object (`size()`), optional bounds
  checking (`at`), and automatic memory management — replacing the
  `malloc`/`sizeof`/cast/`free` ritual entirely.
- **`std::string`** turns the C-string convention into a real type: `=` replaces
  `strcpy`, `+` and `+=` replace `strcat`, `==`/`<`/`>` replace `strcmp`, and the
  result is always correctly sized, which removes an entire class of buffer-overflow
  bugs.
- Both are made possible by **operator overloading** — the ability of a C++ type to
  give meaning to the standard operators. That mechanism is the subject of later
  chapters, and it is what makes library types feel like built-in ones.

---

## 11. Exercises

1. Read `n` from the user, then read `n` integers into a `std::vector<int>` using
   `push_back`, and print their average. Note that you never wrote a size
   calculation.
2. Rewrite the same program with `malloc`/`free` in C. Count the lines of
   bookkeeping code that exist only to manage memory.
3. Write a function `std::string join(const std::vector<std::string> &parts,
   const std::string &sep)`. Test it with an empty vector and a single element.
4. Demonstrate the `char str[8]` buffer overflow from §7.2 under a sanitizer
   (`g++ -fsanitize=address`) and read the diagnostic.
5. Write a palindrome checker for `std::string` that ignores case and spaces.
6. Sort a `std::vector<std::string>` case-insensitively by supplying a custom
   comparison function to `std::sort`.

---

**Next:** Chapter 6 compares hand-written sorting and searching with the C standard
library's `qsort`/`bsearch` and the C++ `<algorithm>` header.
