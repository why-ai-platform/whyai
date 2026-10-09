# Chapter 9: The UI Component Library (`components/ui/`)

This folder holds 48 small files plus two helpers — by file count, more than half the entire
`src/` directory. Rather than writing 48 near-identical sub-chapters, this chapter explains the
**one pattern** every file follows (in depth, using two real examples), then gives a reference
table for the rest. This is the standard open-source **shadcn/ui** component set, generated for
this project and then customized slightly — it is not hand-written from scratch, which is exactly
why every file looks so structurally similar.

## 9.1 The shared idea: unstyled primitives + Tailwind classes + variants

Nearly every file here wraps a component from **Radix UI** (one of the ~25 `@radix-ui/react-*`
packages in `package.json`, Chapter 3). Radix provides the *behavior* and *accessibility* (keyboard
navigation, focus trapping, ARIA attributes screen readers rely on) for complex widgets like
dialogs, dropdowns, and accordions — but deliberately ships with **zero visual styling**. Each file
in `components/ui/` adds that missing styling using Tailwind classes, and exposes the result under
a friendlier name.

## 9.2 `utils.ts` — the helper every other file in this folder imports

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`cn` ("class names") solves one specific, recurring problem: combining a component's *default*
Tailwind classes with whatever *extra* classes the caller passes in via a `className` prop, while
correctly resolving conflicts (e.g. if the default says `px-4` but the caller passes `px-8`, the
result should be `px-8`, not both applied confusingly). `clsx` joins multiple class strings/
conditionals into one string; `twMerge` then intelligently drops earlier conflicting Tailwind
classes in favor of later ones. You'll see `className={cn(someDefaultClasses, className)}` in
nearly every file in this folder.

## 9.3 Walkthrough 1 — `button.tsx` (the simplest case)

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 ... [&_svg]:pointer-events-none ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 ...",
        outline: "border bg-background text-foreground hover:bg-accent ...",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground ...",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

- **`cva`** ("class variance authority," the npm package of the same name) is a tiny utility for
  defining a component that has named **variants** — here, `variant` (default/destructive/outline/
  secondary/ghost/link — six visual styles) and `size` (default/sm/lg/icon). Calling
  `buttonVariants({ variant: "outline", size: "sm" })` returns the right combination of Tailwind
  classes as one string. This is *why* code elsewhere in the app can just write `<Button
  variant="outline" size="sm">` and get a fully-styled, differently-shaped button without repeating
  any CSS.
- **`asChild` and `Slot`** — a Radix pattern for letting `Button` "merge" its styling onto a
  *different* underlying element instead of rendering its own `<button>`. You'll see this used in
  [Footer.tsx](../../src/components/common/Footer.tsx): `<Button variant="ghost" size="icon"
  asChild><a href={social.href}>...</a></Button>` — this renders a single real `<a>` tag styled
  exactly like the button, rather than an invalid `<button><a>...</a></button>` nesting.
- **`{...props}`** — any prop not explicitly named (`onClick`, `disabled`, `type`, etc.) passes
  straight through to the real underlying `<button>` (or whatever `asChild` substitutes), so
  `Button` behaves like a normal HTML button for everything it doesn't customize.

## 9.4 Walkthrough 2 — `dialog.tsx` (a compound component)

This file doesn't export one component — it exports **nine**: `Dialog`, `DialogTrigger`,
`DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`,
`DialogTitle`, `DialogDescription`. This "compound component" pattern lets a caller assemble exactly
the dialog structure it needs, piece by piece — seen in real use in
[LoginDialog.tsx](../../src/pages/landing/LoginDialog.tsx) (Chapter 10):

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Welcome to WhyAi</DialogTitle>
      <DialogDescription>...</DialogDescription>
    </DialogHeader>
    {/* form content */}
  </DialogContent>
</Dialog>
```

- `Dialog` itself is just `DialogPrimitive.Root` re-exported — all the actual open/close logic,
  focus trapping, and "click outside or press Escape to close" behavior comes from Radix; this
  file adds nothing but a `data-slot="dialog"` attribute (used for styling hooks / debugging, not
  functionally required).
- `DialogContent` is the most substantial wrapper: it renders `DialogPortal` (which uses React's
  **portal** mechanism to render the dialog's HTML at the very end of `<body>`, outside the normal
  component tree position, so it can visually sit on top of everything else regardless of where in
  the page it was written), plus `DialogOverlay` (the dark semi-transparent backdrop), the actual
  centered white box with animation classes (`data-[state=open]:animate-in ...` — Tailwind classes
  that only apply when Radix sets a specific `data-state` attribute, driving open/close animations
  purely through CSS), and a close `✕` button in the corner.
- `open={open} onOpenChange={onOpenChange}` — this is a **controlled component** pattern (Chapter 1
  §1.3's "state" idea, but the state is kept in the *caller*, not inside `Dialog` itself): the
  parent component owns a `useState<boolean>` for whether the dialog is open, and passes both the
  current value and a setter down; `Dialog` never decides on its own whether it's open, it just
  reports "the user tried to close me" back up via `onOpenChange`.

## 9.5 The remaining 46 files — reference table

Every file below follows the same recipe as §9.3/§9.4: wrap the matching `@radix-ui/react-*`
package (or, for a few, build a self-contained widget with no Radix backing at all — noted below),
style it with Tailwind via `cn()`, and re-export it under a plain name. "Used by a live page?"
reflects what's actually rendered today (Chapters 10–15), not what exists.

| File | Wraps | Used by a live page? |
|---|---|---|
| `accordion.tsx` | `@radix-ui/react-accordion` | No |
| `alert.tsx`, `alert-dialog.tsx` | (none) / `@radix-ui/react-alert-dialog` | No |
| `aspect-ratio.tsx` | `@radix-ui/react-aspect-ratio` | No |
| `avatar.tsx` | `@radix-ui/react-avatar` | Yes — `ProfilePage` (Ch.13) |
| `badge.tsx` | `cva` only, no Radix | Yes — nearly every page |
| `breadcrumb.tsx` | (none, plain markup) | Yes — via `BreadcrumbNav` (Ch.8) |
| `button.tsx` | `@radix-ui/react-slot` | Yes — nearly every page |
| `calendar.tsx` | `react-day-picker` | No |
| `card.tsx` | (none, plain markup) | Yes — nearly every page |
| `carousel.tsx` | `embla-carousel-react` | No |
| `chart.tsx` | `recharts` | No |
| `checkbox.tsx` | `@radix-ui/react-checkbox` | No (Profile page uses plain `<input type="checkbox">` instead, Ch.13) |
| `collapsible.tsx` | `@radix-ui/react-collapsible` | No |
| `command.tsx` | `cmdk` | No |
| `context-menu.tsx` | `@radix-ui/react-context-menu` | No |
| `dialog.tsx` | `@radix-ui/react-dialog` | Yes — `LoginDialog` (Ch.10) |
| `drawer.tsx` | `vaul` | No |
| `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` | No |
| `form.tsx` | `react-hook-form` | No |
| `hover-card.tsx` | `@radix-ui/react-hover-card` | No |
| `input.tsx` | (none, plain `<input>`) | Yes — `LoginDialog`, `ProfilePage` |
| `input-otp.tsx` | `input-otp` | No |
| `label.tsx` | `@radix-ui/react-label` | Yes — `LoginDialog`, `ProfilePage` |
| `menubar.tsx` | `@radix-ui/react-menubar` | No |
| `navigation-menu.tsx` | `@radix-ui/react-navigation-menu` | No |
| `pagination.tsx` | (none, plain markup) | No |
| `popover.tsx` | `@radix-ui/react-popover` | No |
| `progress.tsx` | `@radix-ui/react-progress` | Yes — `CoursesPage`, `CourseViewer`, `DashboardPage` (Ch.11, 13) |
| `radio-group.tsx` | `@radix-ui/react-radio-group` | No (Profile page uses plain `<input type="radio">` instead) |
| `resizable.tsx` | `react-resizable-panels` | No |
| `scroll-area.tsx` | `@radix-ui/react-scroll-area` | Yes — `CoursesLayout` (orphaned, Ch.2) and `PracticePage` (Ch.12) |
| `select.tsx` | `@radix-ui/react-select` | No |
| `separator.tsx` | `@radix-ui/react-separator` | No |
| `sheet.tsx` | `@radix-ui/react-dialog` (a side-drawer variant) | No |
| `sidebar.tsx` | plain markup + `use-mobile.ts` (Ch.7) | No |
| `skeleton.tsx` | (none, plain markup, loading placeholder) | No |
| `slider.tsx` | `@radix-ui/react-slider` | No |
| `sonner.tsx` | `sonner` package, theme-aware wrapper | Yes — rendered once in `App.tsx` as `<Toaster />` (Ch.5) |
| `switch.tsx` | `@radix-ui/react-switch` | Yes — dark-mode toggle in `Navbar` (Ch.8) |
| `table.tsx` | (none, plain markup) | No |
| `tabs.tsx` | `@radix-ui/react-tabs` | Yes — `LoginDialog`, `PracticePage`, `DashboardPage`, `ProfilePage` |
| `textarea.tsx` | (none, plain `<textarea>`) | No (pages use a raw `<textarea>` directly instead, e.g. `ProfilePage`) |
| `toggle.tsx`, `toggle-group.tsx` | `@radix-ui/react-toggle(-group)` | No |
| `tooltip.tsx` | `@radix-ui/react-tooltip` | No |

Every file also defines a TypeScript `type ...Props = React.ComponentProps<typeof
SomePrimitive.Part>` style signature, meaning it automatically inherits every prop the underlying
Radix primitive (or native HTML element) accepts, plus whatever extra ones (like `variant` on
`Button`) it adds itself — so these components type-check as if they were the real thing, with
extras.

## 9.6 Why so many unused components exist

This is normal for a shadcn/ui-based project, not a mistake: the *entire* component set is
typically generated/installed up front so any of them is available the moment a page needs it,
rather than adding one file at a time per feature. Nothing about having 30+ unused files here is
broken or slows down the live app — Vite's bundler (Chapter 1 §1.5) only includes files that are
actually imported from the real entry graph in the final `dist/` build; an unused file in
`components/ui/` costs nothing in the shipped bundle.
