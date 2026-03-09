interface ThemeServiceConfig {
  defaultTheme: "light" | "dark";
  detectFromBrowser: boolean;
}

class ThemeService {
  private config: ThemeServiceConfig;
  private storageKey = "app-theme";

  constructor(config: ThemeServiceConfig) {
    this.config = config;
  }

  init(): "light" | "dark" {
    // Check for saved theme first
    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      this.applyTheme(savedTheme);
      return savedTheme;
    }

    // Detect from browser if enabled
    if (this.config.detectFromBrowser) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = prefersDark ? "dark" : "light";
      this.applyTheme(theme);
      this.saveTheme(theme);
      return theme;
    }

    // Fall back to default theme
    this.applyTheme(this.config.defaultTheme);
    this.saveTheme(this.config.defaultTheme);
    return this.config.defaultTheme;
  }

  toggle(): "light" | "dark" {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme(): "light" | "dark" {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }

  private applyTheme(theme: "light" | "dark"): void {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  private saveTheme(theme: "light" | "dark"): void {
    localStorage.setItem(this.storageKey, theme);
  }

  private getSavedTheme(): "light" | "dark" | null {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return null;
  }

  listenForSystemChanges(callback: (theme: "light" | "dark") => void): () => void {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!this.getSavedTheme()) {
        const theme = e.matches ? "dark" : "light";
        this.applyTheme(theme);
        callback(theme);
      }
    };

    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }
}

// Create and export a singleton instance
export const themeService = new ThemeService({
  defaultTheme: "light",
  detectFromBrowser: true,
});

export { ThemeService };
export type { ThemeServiceConfig };
