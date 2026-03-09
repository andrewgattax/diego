# Development Guidelines

## Tech Stack

- **React 19** with TypeScript (ES2022 target)
- **Vite 7** as build tool and dev server
- **Tailwind CSS v4** with new inline theme system via `@tailwindcss/vite` plugin
- **ShadCN UI** components built on Radix UI primitives
- **OKLCH** color space for theme colors
- **Montserrat** (sans), **Georgia** (serif), **Fira Code** (mono) fonts

## Path Aliases

Use `@/` prefix for imports from `src/` directory:

```tsx
import { Button } from "@/components/ui/button"
import { themeService } from "@/services/themeService"
import cabajo from "@/assets/cabajo.jpeg"
```

Configured in both `vite.config.ts` and `tsconfig.app.json`.

## Project Structure

```
src/
├── assets/
│   └── images/           # Imported images (Vite processes these)
├── components/
│   └── ui/               # ShadCN UI components
├── services/
│   └── themeService.ts   # Theme management singleton
├── lib/
│   └── utils.ts          # cn() utility for className merging
├── App.tsx               # Root component with theme initialization
├── main.tsx              # Entry point
└── index.css             # Global styles with @theme inline
public/                   # Static assets (favicon, robots.txt, etc.)
```

## Theme System

### Dark Mode

The app uses a dedicated `themeService` singleton that:
- Detects system preference on first load
- Persists user choice to localStorage (`app-theme` key)
- Provides `init()`, `toggle()`, and `getCurrentTheme()` methods
- Listens for system preference changes with `listenForSystemChanges(callback)`

**Required pattern in App component:**

```tsx
import { useEffect, useState } from "react";
import { themeService } from "@/services/themeService";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(themeService.init());
  }, []);

  const toggleTheme = () => {
    setTheme(themeService.toggle());
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {/* Your app content */}
    </div>
  );
}
```

**Critical:** The root div must have `className={theme === "dark" ? "dark" : ""}` for Tailwind's dark mode to work.

### Tailwind CSS v4 Inline Theme

Colors are defined in `src/index.css` using the new `@theme inline` syntax:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... maps CSS vars to Tailwind color tokens */
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... actual color values in OKLCH */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode overrides */
}
```

### Custom Dark Variant

Dark mode uses a custom variant for better composition:

```css
@custom-variant dark (&:is(.dark *));
```

This means `dark:` prefix only applies when the element has `.dark` in its ancestry, not just on the html element.

### Border Radius System

Base radius set in `:root`:
```css
--radius: 0.625rem;
```

All other radius values are calculated from this base:
- `sm`: base - 4px
- `md`: base - 2px
- `lg`: base (default)
- `xl`: base + 4px
- `2xl`: base + 8px
- `3xl`: base + 12px
- `4xl`: base + 16px

### Typography

Font families configured in `:root`:
```css
--font-family-sans: "Montserrat", system-ui, -apple-system, sans-serif;
--font-family-serif: "Georgia", "Cambria", "Times New Roman", Times, serif;
--font-family-mono: "Fira Code", "Courier New", Courier, monospace;
```

Web fonts (Montserrat) loaded in `index.html` via Google Fonts.

Use in components:
```tsx
<h1 className="font-sans">...</h1>
<p className="font-serif">...</p>
<code className="font-mono">...</code>
```

### OKLCH Color Format

```css
oklch(lightness chroma hue)
```

- **lightness**: 0-1 (0 = black, 1 = white)
- **chroma**: 0-0.4 (0 = gray, higher = more saturated)
- **hue**: 0-360 (color wheel position)

## Component Patterns

### ShadCN UI Components

Components use:
- **class-variance-authority** for variant management
- **Radix UI Slot** for `asChild` pattern (composition)
- **cn()** utility from `@/lib/utils` for className merging

Example (Button):

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background hover:bg-accent",
        /* ... */
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
        /* ... */
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Adding ShadCN Components

```bash
npx shadcn@latest add [component-name]
```

Components are added to `src/components/ui/`.

## Asset Handling

### src/assets/ - For imported images (Recommended)

Place images used in components here. Vite processes, optimizes, and adds content hashes.

```tsx
import myImage from "@/assets/images/logo.png";

function Component() {
  return <img src={myImage} alt="Logo" className="w-32 h-32" />;
}
```

### public/ - For static assets

For files that don't need processing: favicon, robots.txt, OG images. Served at root URL.

```tsx
<img src="/favicon.ico" alt="Favicon" />
```

## Build Process

```bash
npm run build    # Runs: tsc -b && vite build
```

TypeScript compilation happens before Vite build. Build fails if type checking fails.

## TypeScript Configuration

- **Strict mode** enabled
- **Path aliases**: `@/*` → `./src/*`
- **jsx**: `react-jsx` (new JSX transform)
- **Unused locals/parameters**: Allowed (not flagged)

## Available Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - TypeScript check + production build
- `npm run preview` - Preview production build locally

## Key Dependencies

**Runtime:**
- `react` & `react-dom` 19.2.0
- `class-variance-authority` - Component variants
- `clsx` + `tailwind-merge` - className merging
- `lucide-react` - Icon library
- `radix-ui` - Unstyled component primitives

**Dev:**
- `@tailwindcss/vite` - Tailwind CSS v4 Vite plugin
- `tailwindcss` 4.1.18
- `tw-animate-css` - Tailwind animations
- `@vitejs/plugin-react` - React support for Vite
- `vite` 7.2.4
