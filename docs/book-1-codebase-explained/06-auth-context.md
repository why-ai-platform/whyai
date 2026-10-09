# Chapter 6: Authentication — `AuthContext.tsx`, Function by Function

File: [src/contexts/AuthContext.tsx](../../src/contexts/AuthContext.tsx). This is one of the most
important files to understand precisely, because almost every other page checks its output to
decide what to show.

## 6.1 The shape of things

```tsx
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

`createContext` (from Chapter 1 §1.3) creates a Context object. Its starting value is `undefined`
— that's intentional, and it's checked for in `useAuth()` below. `User | null` means "either a
`User` object, or the literal value `null`" — TypeScript's way of writing "logged in, or not."

## 6.2 `AuthProvider` — the component that holds the real state

```tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  ...
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- `const [user, setUser] = useState<User | null>(null)` — the **one piece of real state** in this
  entire authentication system. It starts as `null` (nobody logged in) and lives only in this
  component's memory.
- `{children}` — whatever was placed *inside* `<AuthProvider>...</AuthProvider>` in `App.tsx`
  (which is everything: `<Router>` and all pages) gets rendered here, now wrapped so it can access
  the context.
- `<AuthContext.Provider value={{...}}>` — this is what actually makes the `user`,
  `isAuthenticated`, `login`, `signup`, and `logout` values available to any descendant component
  that asks for them via `useAuth()`.
- **`isAuthenticated: !!user`** — `!!` is a common double-negation trick to convert *any* value to
  a strict `true`/`false`. `!user` is `true` when `user` is `null` (falsy); `!!user` flips that
  back, so it's `true` exactly when `user` is **not** `null`. This is the single source of truth
  every page checks to decide "is someone logged in?"

## 6.3 `login(email, password)`

```tsx
const login = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const mockUser: User = { id: "1", email, name: email.split("@")[0] };
  setUser(mockUser);
};
```

Step by step:

1. `await new Promise((resolve) => setTimeout(resolve, 1000))` — this line does **nothing** except
   artificially wait one second. It exists purely to *simulate* what a real network request to a
   server would feel like (so the loading spinner in `LoginDialog`, Chapter 10, has something to
   show). There is no server call here at all.
2. **Any email and any password are accepted — there is no password check whatsoever.** This is
   mock authentication, explicitly and currently by design (per the code comment
   `// Mock authentication - in production, use Supabase`).
3. `name: email.split("@")[0]` — takes the part of the email before the `@` as a makeshift display
   name. Typing `jane.doe@example.com` produces the name `jane.doe`.
4. `setUser(mockUser)` — this is the line that actually "logs someone in": it updates the one piece
   of state, which causes every component reading `isAuthenticated`/`user` via `useAuth()` to
   re-render.

**What's missing compared to a real login**: no password verification, no server round-trip, no
persisted session — refreshing the browser resets `user` back to `null` immediately, because
`useState(null)` always starts fresh on every page load; nothing is saved to `localStorage` or any
cookie. [docs/ROADMAP.md](../ROADMAP.md) Phase 5 (`feat/auth-signup-login`,
`feat/auth-session-persistence`) replaces this entire function with real Supabase calls plus a
persisted session.

## 6.4 `signup(name, email, password)`

Nearly identical to `login`, except the display `name` is taken directly from the form field
instead of derived from the email, and again — no account is actually created anywhere, no
duplicate-email check, no password strength rule. Calling `signup` and `login` both just overwrite
the same in-memory `user` state.

## 6.5 `logout()`

```tsx
const logout = () => {
  setUser(null);
};
```

The simplest function in the file: sets `user` back to `null`. No server call, nothing to clean up
(there is no token or session to invalidate yet) — just resets the one piece of state.

## 6.6 `useAuth()` — how every other component reads this

```tsx
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

`useContext(AuthContext)` reads whatever value the nearest enclosing `<AuthContext.Provider>`
supplied. Because `App.tsx` wraps literally everything in `<AuthProvider>`, every component in the
app can safely call `useAuth()`. The `if (context === undefined) throw ...` is a safety check: it
would only ever fire if some component tried to call `useAuth()` from *outside* an `AuthProvider`
entirely (a programming mistake) — it converts a confusing bug into an immediate, clear error
message pointing at the real cause.

Components that call `useAuth()` in this codebase: `Navbar` (Chapter 8), `LoginDialog` (Chapter 10),
`DashboardPage` and `ProfilePage` (Chapter 13), `CoursesPage` (Chapter 11). Every one of them
destructures exactly the fields it needs, e.g. `const { isAuthenticated, user, logout } =
useAuth();`.
