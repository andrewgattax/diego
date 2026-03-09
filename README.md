# Vite Template

A modern React template built with Vite, TypeScript, Tailwind CSS v4, and ShadCN UI components.

## Stack

- **Vite** - Lightning-fast build tool and dev server
- **React 19** - Latest React with TypeScript support
- **Tailwind CSS v4** - Utility-first CSS framework with the new Vite plugin
- **ShadCN UI** - Beautiful, accessible component library built on Radix UI
- **TypeScript** - Type-safe development

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Package Name

Before starting your project, update the package name in both:

1. **package.json** - Update the `name` field (currently `"vite-template"`)
2. **index.html** - Update the `<title>` tag (currently `"vite-template"`)

### Theme Customization

The theme is configured in `src/index.css` using Tailwind CSS v4's new inline theme system.

#### Color Variables

Edit the CSS custom properties in the `:root` selector for light mode:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more colors */
}
```

And in the `.dark` selector for dark mode:

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... more colors */
}
```

#### Border Radius

Adjust the base border radius:

```css
:root {
  --radius: 0.625rem;
}
```

All other radius values (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`) are calculated from this base value.

#### Typography

The font system is configured in `src/index.css` with three font families:

**Default fonts (configured in `:root`):**

```css
:root {
  --font-family-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-family-serif: "Georgia", "Cambria", "Times New Roman", Times, serif;
  --font-family-mono: "Fira Code", "Courier New", Courier, monospace;
}
```

**Using Web Fonts (Google Fonts example):**

1. Add the Google Fonts link to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Update the font variable in `src/index.css`:

```css
:root {
  --font-family-sans: "Inter", sans-serif;
}
```

**Using fonts in components:**

```tsx
<h1 className="font-sans">Sans serif text</h1>
<p className="font-serif">Serif paragraph</p>
<code className="font-mono">Monospace code</code>
```

#### Using OKLCH Colors

This template uses OKLCH color space for better perceptual uniformity. The format is:

```css
oklch(lightness chroma hue)
```

- **lightness**: 0-1 (0 = black, 1 = white)
- **chroma**: 0-0.4 (0 = gray, higher = more saturated)
- **hue**: 0-360 (color wheel position)

### Adding ShadCN Components

This template includes the Button component. To add more components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

Components are added to `src/components/ui/` and can be imported like:

```tsx
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

### Assets and Images

This template uses Vite's asset handling with two locations for different purposes:

#### src/assets/ - For imported images (Recommended)

Place images you use in your components here:

```
src/
└── assets/
    ├── images/
    │   ├── logo.png
    │   └── hero.jpg
    └── cabajo.jpeg
```

Import and use them in your components:

```tsx
import myImage from "@/assets/images/logo.png";

function App() {
  return <img src={myImage} alt="Logo" className="w-32 h-32" />;
}
```

**Benefits:** Vite processes and optimizes these images, adds content hashes for caching, and bundles them efficiently.

#### public/ - For static assets

Place files that don't need processing here:

```
public/
├── favicon.ico
├── robots.txt
└── og-image.png
```

Reference by URL (served at root):

```tsx
<img src="/favicon.ico" alt="Favicon" />
```

**Use for:** Favicons, robots.txt, Open Graph images, or files that need stable URLs.

## Project Structure

```
vite-template/
├── src/
│   ├── assets/
│   │   └── images/       # Project images (imported in components)
│   ├── components/
│   │   └── ui/           # ShadCN components
│   ├── services/
│   │   └── themeService.ts # Theme management service
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles & theme
├── public/               # Static assets (favicon, robots.txt, etc.)
├── index.html            # HTML template
├── package.json          # Dependencies & scripts
└── vite.config.ts        # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview the production build locally

## Dark Mode

Dark mode is fully integrated with a dedicated theme service that handles theme detection and switching.

### Theme Service

The `themeService` provides automatic theme detection and manual toggling:

```tsx
import { themeService } from "@/services/themeService";

// Initialize theme (call in your app entry point)
themeService.init();

// Toggle between light and dark
themeService.toggle();

// Get current theme
const currentTheme = themeService.getCurrentTheme(); // "light" | "dark"
```

### Configuration

The theme service is pre-configured in `src/services/themeService.ts` with these options:

```ts
{
  defaultTheme: "light",      // Fallback theme when no preference is detected
  detectFromBrowser: true     // Auto-detect from system preference
}
```

### Usage in React

Initialize the theme in your app and use it with state:

```tsx
import { useEffect, useState } from "react";
import { themeService } from "@/services/themeService";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initialize theme on mount
    setTheme(themeService.init());
  }, []);

  const toggleTheme = () => {
    setTheme(themeService.toggle());
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "dark" : "light"} mode
      </button>
    </div>
  );
}
```

### Theme Persistence

The theme service automatically:
- Saves the user's choice to `localStorage`
- Remembers the preference across sessions
- Detects system preference changes (when `detectFromBrowser: true`)
- Falls back to the `defaultTheme` when no preference exists

### Manual Dark Mode

You can still manually apply dark mode by adding the `dark` class to the HTML element:

```tsx
document.documentElement.classList.add("dark");
```
